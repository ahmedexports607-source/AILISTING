"""Magic Listing generator — uses vision LLM to write an Etsy listing from a photo."""
import os
import json
import re
import base64
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent


SYSTEM_PROMPT = (
    "You are the Listing Expert for a heritage Indian textiles brand called Chhaape. "
    "You look at a single product photo and write a complete, ready-to-publish Etsy listing. "
    "Voice is warm, artisan, story-first. Never salesy. Prefer 'hand-carved' over 'hand made'. "
    "Never use 'cheap', 'discount', 'clearance'. "
    "Return ONLY a compact JSON object with this exact shape and no prose: "
    "{\"title\": str (max 140 chars, keyword-rich), "
    "\"description\": str (150-400 words, sensory, material, dimensions, care), "
    "\"tags\": [str, ...] (10 to 13 tags, each max 20 chars, lowercase, no punctuation), "
    "\"price\": number (USD, whole or one-decimal), "
    "\"who_made\": one of ['i_did','collective','someone_else'], "
    "\"when_made\": one of ['made_to_order','2020_2026','2010_2019','before_2010'], "
    "\"taxonomy_id\": integer (Etsy taxonomy id best fit; fabric=1213, home decor=891, wooden crafts=323, clothing=562)}"
)


class GeneratedListing(BaseModel):
    title: str
    description: str
    tags: list[str]
    price: float
    who_made: str = "i_did"
    when_made: str = "made_to_order"
    taxonomy_id: int = 1213
    image_id: Optional[str] = None
    image_data_url: Optional[str] = None


def _extract_json(text: str) -> dict:
    text = text.strip()
    # Remove markdown fences if any
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    # Try direct parse first
    try:
        return json.loads(text)
    except Exception:
        pass
    # Fallback: extract the outermost {...}
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if not m:
        raise ValueError("LLM did not return JSON")
    return json.loads(m.group(0))


async def _generate_from_bytes(image_bytes: bytes, mime: str) -> dict:
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise HTTPException(500, "EMERGENT_LLM_KEY not configured")

    b64 = base64.b64encode(image_bytes).decode()
    chat = LlmChat(
        api_key=key,
        session_id=f"magic-{uuid.uuid4()}",
        system_message=SYSTEM_PROMPT,
    ).with_model("gemini", "gemini-2.5-flash")

    msg = UserMessage(
        text="Write the Etsy listing for this product photo. Return JSON only.",
        file_contents=[ImageContent(image_base64=b64)],
    )
    reply = await chat.send_message(msg)
    return _extract_json(reply if isinstance(reply, str) else str(reply))


def build_router(image_store: dict) -> APIRouter:
    """image_store is a shared dict {image_id: (mime, bytes)} kept in memory."""
    router = APIRouter(prefix="/api/magic", tags=["magic"])

    @router.post("/generate", response_model=GeneratedListing)
    async def generate(image: UploadFile = File(...)):
        content = await image.read()
        if not content:
            raise HTTPException(400, "Empty image")
        mime = image.content_type or "image/jpeg"
        if mime not in ("image/jpeg", "image/png", "image/webp"):
            # Best-effort: accept anyway but warn
            mime = "image/jpeg"

        try:
            data = await _generate_from_bytes(content, mime)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(502, f"LLM error: {e}")

        # Normalise fields with safe defaults
        image_id = str(uuid.uuid4())
        image_store[image_id] = (mime, content)

        # Enforce constraints
        tags = data.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        tags = [str(t)[:20].lower() for t in tags][:13]
        title = str(data.get("title", "Handmade textile"))[:140]

        try:
            price = float(data.get("price", 24))
            if price <= 0:
                price = 24.0
        except Exception:
            price = 24.0

        who_made = data.get("who_made", "i_did")
        if who_made not in ("i_did", "collective", "someone_else"):
            who_made = "i_did"
        when_made = data.get("when_made", "made_to_order")

        try:
            taxonomy_id = int(data.get("taxonomy_id", 1213))
        except Exception:
            taxonomy_id = 1213

        return GeneratedListing(
            title=title,
            description=str(data.get("description", "")),
            tags=tags,
            price=round(price, 2),
            who_made=who_made,
            when_made=when_made,
            taxonomy_id=taxonomy_id,
            image_id=image_id,
            image_data_url=f"data:{mime};base64,{base64.b64encode(content).decode()}",
        )

    @router.get("/image/{image_id}")
    async def get_image(image_id: str):
        if image_id not in image_store:
            raise HTTPException(404, "not found")
        mime, data = image_store[image_id]
        from fastapi.responses import Response
        return Response(content=data, media_type=mime)

    return router


def get_image_store():
    """Backward-compat helper to expose the store to other routers (e.g. Etsy)."""
    return _IMAGE_STORE


_IMAGE_STORE: dict = {}
