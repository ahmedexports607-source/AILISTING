"""Etsy Open API v3 OAuth 2.0 + PKCE integration."""
import os
import base64
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

ETSY_API = "https://api.etsy.com/v3"
SCOPES = "shops_r listings_w listings_r"
# Single-user demo: all state keyed under this user id.
DEFAULT_USER = "default"


def _pkce_pair():
    verifier = secrets.token_urlsafe(48)
    digest = hashlib.sha256(verifier.encode()).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
    return verifier, challenge


def _etsy_headers(access_token: Optional[str] = None):
    keystring = os.environ["ETSY_KEYSTRING"]
    shared = os.environ["ETSY_SHARED_SECRET"]
    # Etsy v3 requires x-api-key on every request; use keystring:shared_secret.
    h = {"x-api-key": f"{keystring}:{shared}"}
    if access_token:
        h["Authorization"] = f"Bearer {access_token}"
    return h


def _origin_from_request(req: Request) -> str:
    # Prefer forwarded headers set by Kubernetes ingress.
    proto = req.headers.get("x-forwarded-proto", req.url.scheme)
    host = req.headers.get("x-forwarded-host", req.headers.get("host", ""))
    return f"{proto}://{host}"


async def _token_request(data: dict):
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            f"{ETSY_API}/public/oauth/token",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if r.is_error:
        raise HTTPException(r.status_code, f"Etsy token error: {r.text}")
    return r.json()


async def _refresh(conn: dict, db: AsyncIOMotorDatabase) -> str:
    tokens = await _token_request({
        "grant_type": "refresh_token",
        "client_id": os.environ["ETSY_KEYSTRING"],
        "refresh_token": conn["refresh_token"],
    })
    upd = {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "access_expires_at": datetime.now(timezone.utc) + timedelta(seconds=tokens.get("expires_in", 3600)),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.etsy_connections.update_one({"_id": conn["_id"]}, {"$set": upd})
    return tokens["access_token"]


async def _get_token(db: AsyncIOMotorDatabase) -> tuple[dict, str]:
    conn = await db.etsy_connections.find_one({"_id": DEFAULT_USER})
    if not conn:
        raise HTTPException(401, "Etsy not connected")
    exp = conn.get("access_expires_at")
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if not exp or exp <= datetime.now(timezone.utc) + timedelta(minutes=2):
        token = await _refresh(conn, db)
    else:
        token = conn["access_token"]
    return conn, token


class DraftPayload(BaseModel):
    title: str
    description: str
    price: float = Field(gt=0)
    quantity: int = Field(gt=0, default=1)
    tags: list[str] = []
    who_made: str = "i_did"
    when_made: str = "made_to_order"
    taxonomy_id: int = 68887262  # "Craft Supplies & Tools > Fabric & Notions > Fabric" fallback
    image_url: Optional[str] = None  # optional; if provided we'll upload it after creation


def build_router(db_getter) -> APIRouter:
    """db_getter is a callable returning the AsyncIOMotorDatabase."""
    router = APIRouter(prefix="/api/etsy", tags=["etsy"])

    @router.get("/status")
    async def status():
        db = db_getter()
        conn = await db.etsy_connections.find_one({"_id": DEFAULT_USER})
        if not conn:
            return {"connected": False}
        return {
            "connected": True,
            "shop_id": conn.get("shop_id"),
            "shop_name": conn.get("shop_name"),
            "user_id": conn.get("etsy_user_id"),
        }

    @router.get("/connect")
    async def connect(request: Request):
        db = db_getter()
        origin = _origin_from_request(request)
        redirect_uri = f"{origin}/api/etsy/callback"
        state = secrets.token_urlsafe(24)
        verifier, challenge = _pkce_pair()
        await db.etsy_oauth_states.insert_one({
            "_id": state,
            "code_verifier": verifier,
            "redirect_uri": redirect_uri,
            "created_at": datetime.now(timezone.utc),
        })
        params = {
            "response_type": "code",
            "client_id": os.environ["ETSY_KEYSTRING"],
            "redirect_uri": redirect_uri,
            "scope": SCOPES,
            "state": state,
            "code_challenge": challenge,
            "code_challenge_method": "S256",
        }
        return {"auth_url": "https://www.etsy.com/oauth/connect?" + urlencode(params)}

    @router.get("/callback", response_class=HTMLResponse)
    async def callback(request: Request, code: Optional[str] = None, state: Optional[str] = None, error: Optional[str] = None):
        db = db_getter()

        def _close_page(msg: str, ok: bool):
            payload = f'{{"type":"etsy-oauth","ok":{"true" if ok else "false"},"message":{msg!r}}}'
            html = (
                "<!doctype html><html><head><title>Etsy</title>"
                "<style>body{background:#0f0f10;color:#e9e2d7;font-family:-apple-system,sans-serif;"
                "display:flex;align-items:center;justify-content:center;height:100vh;margin:0}"
                ".c{text-align:center}.b{color:#f97316;font-size:20px}</style></head>"
                "<body><div class='c'><div class='b'>" + ("Connected to Etsy" if ok else "Etsy connect failed") + "</div>"
                "<div style='color:#8a827c;margin-top:8px'>" + msg + "</div>"
                "<div style='color:#5c5751;margin-top:16px;font-size:12px'>You can close this window.</div></div>"
                "<script>try{window.opener&&window.opener.postMessage(" + payload + ",'*')}catch(e){};"
                "setTimeout(function(){window.close()},1200)</script></body></html>"
            )
            return HTMLResponse(html)

        if error or not code or not state:
            return _close_page(error or "Missing code/state", False)

        pending = await db.etsy_oauth_states.find_one_and_delete({"_id": state})
        if not pending:
            return _close_page("Invalid or expired state", False)

        try:
            tokens = await _token_request({
                "grant_type": "authorization_code",
                "client_id": os.environ["ETSY_KEYSTRING"],
                "redirect_uri": pending["redirect_uri"],
                "code": code,
                "code_verifier": pending["code_verifier"],
            })
        except HTTPException as e:
            return _close_page(str(e.detail)[:180], False)

        access = tokens["access_token"]
        # Etsy access token is prefixed with the user_id.
        etsy_user_id = access.split(".", 1)[0]

        # Fetch shops
        shop_id = None
        shop_name = None
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                r = await client.get(
                    f"{ETSY_API}/application/users/{etsy_user_id}/shops",
                    headers=_etsy_headers(access),
                )
            if r.status_code == 200:
                data = r.json()
                if isinstance(data, dict) and data.get("shop_id"):
                    shop_id = data["shop_id"]
                    shop_name = data.get("shop_name")
                elif isinstance(data, dict) and data.get("results"):
                    shop_id = data["results"][0]["shop_id"]
                    shop_name = data["results"][0].get("shop_name")
        except Exception:
            pass

        await db.etsy_connections.update_one(
            {"_id": DEFAULT_USER},
            {"$set": {
                "etsy_user_id": etsy_user_id,
                "shop_id": shop_id,
                "shop_name": shop_name,
                "access_token": access,
                "refresh_token": tokens["refresh_token"],
                "access_expires_at": datetime.now(timezone.utc) + timedelta(seconds=tokens.get("expires_in", 3600)),
                "scopes": tokens.get("scope", SCOPES),
                "updated_at": datetime.now(timezone.utc),
            }},
            upsert=True,
        )
        return _close_page(f"Shop {shop_name or shop_id} linked", True)

    @router.post("/disconnect")
    async def disconnect():
        db = db_getter()
        await db.etsy_connections.delete_one({"_id": DEFAULT_USER})
        return {"ok": True}

    @router.get("/shop")
    async def shop():
        db = db_getter()
        conn, token = await _get_token(db)
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(
                f"{ETSY_API}/application/shops/{conn['shop_id']}",
                headers=_etsy_headers(token),
            )
        if r.is_error:
            raise HTTPException(r.status_code, r.text)
        return r.json()

    @router.post("/publish")
    async def publish(payload: DraftPayload):
        db = db_getter()
        conn, token = await _get_token(db)
        shop_id = conn.get("shop_id")
        if not shop_id:
            raise HTTPException(400, "No shop associated with Etsy account")

        form = {
            "quantity": str(payload.quantity),
            "title": payload.title[:140],
            "description": payload.description,
            "price": str(round(payload.price, 2)),
            "who_made": payload.who_made,
            "when_made": payload.when_made,
            "taxonomy_id": str(payload.taxonomy_id),
        }
        if payload.tags:
            form["tags"] = ",".join(t[:20] for t in payload.tags[:13])

        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(
                f"{ETSY_API}/application/shops/{shop_id}/listings",
                data=form,
                headers=_etsy_headers(token),
            )
        if r.is_error:
            raise HTTPException(r.status_code, f"Etsy create listing error: {r.text}")
        data = r.json()
        listing_id = data.get("listing_id")

        image_uploaded = False
        if payload.image_url and listing_id:
            try:
                async with httpx.AsyncClient(timeout=40) as client:
                    img_resp = await client.get(payload.image_url)
                if img_resp.status_code == 200:
                    files = {"image": ("photo.jpg", img_resp.content, img_resp.headers.get("content-type", "image/jpeg"))}
                    async with httpx.AsyncClient(timeout=60) as client:
                        up = await client.post(
                            f"{ETSY_API}/application/shops/{shop_id}/listings/{listing_id}/images",
                            files=files,
                            headers=_etsy_headers(token),
                        )
                    image_uploaded = up.status_code < 400
            except Exception:
                image_uploaded = False

        return {
            "listing_id": listing_id,
            "url": f"https://www.etsy.com/listing/{listing_id}",
            "state": data.get("state", "draft"),
            "image_uploaded": image_uploaded,
        }

    @router.post("/publish-with-image")
    async def publish_with_image(
        title: str = Form(...),
        description: str = Form(...),
        price: float = Form(...),
        quantity: int = Form(1),
        tags: str = Form(""),
        who_made: str = Form("i_did"),
        when_made: str = Form("made_to_order"),
        taxonomy_id: int = Form(68887262),
        image: Optional[UploadFile] = File(None),
    ):
        db = db_getter()
        conn, token = await _get_token(db)
        shop_id = conn.get("shop_id")
        if not shop_id:
            raise HTTPException(400, "No shop associated with Etsy account")

        form = {
            "quantity": str(quantity),
            "title": title[:140],
            "description": description,
            "price": str(round(price, 2)),
            "who_made": who_made,
            "when_made": when_made,
            "taxonomy_id": str(taxonomy_id),
        }
        if tags:
            form["tags"] = ",".join(t.strip()[:20] for t in tags.split(",") if t.strip())[:1000]

        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(
                f"{ETSY_API}/application/shops/{shop_id}/listings",
                data=form,
                headers=_etsy_headers(token),
            )
        if r.is_error:
            raise HTTPException(r.status_code, f"Etsy create listing error: {r.text}")
        data = r.json()
        listing_id = data.get("listing_id")

        image_uploaded = False
        if image and listing_id:
            content = await image.read()
            files = {"image": (image.filename or "photo.jpg", content, image.content_type or "image/jpeg")}
            async with httpx.AsyncClient(timeout=60) as client:
                up = await client.post(
                    f"{ETSY_API}/application/shops/{shop_id}/listings/{listing_id}/images",
                    files=files,
                    headers=_etsy_headers(token),
                )
            image_uploaded = up.status_code < 400

        return {
            "listing_id": listing_id,
            "url": f"https://www.etsy.com/listing/{listing_id}",
            "state": data.get("state", "draft"),
            "image_uploaded": image_uploaded,
        }

    return router
