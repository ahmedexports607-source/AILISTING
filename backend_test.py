#!/usr/bin/env python3
"""Backend API tests for Etsy integration and existing endpoints."""
import requests
import json
import sys
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://workforce-fabric-ai.preview.emergentagent.com"

def print_test(name, passed, details=""):
    """Print test result with formatting."""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_root_endpoint():
    """Test GET /api/ endpoint."""
    print("=" * 60)
    print("TEST: Root endpoint GET /api/")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        passed = response.status_code == 200
        data = response.json() if passed else None
        
        if passed and data:
            print_test(
                "GET /api/",
                passed and data.get("message") == "Hello World",
                f"Status: {response.status_code}, Response: {data}"
            )
        else:
            print_test("GET /api/", False, f"Status: {response.status_code}, Response: {response.text}")
        return passed
    except Exception as e:
        print_test("GET /api/", False, f"Exception: {str(e)}")
        return False

def test_status_endpoints():
    """Test existing status check endpoints."""
    print("=" * 60)
    print("TEST: Status check endpoints")
    print("=" * 60)
    
    # Test POST /api/status
    try:
        payload = {"client_name": f"test_client_{datetime.now().timestamp()}"}
        response = requests.post(f"{BASE_URL}/api/status", json=payload, timeout=10)
        passed = response.status_code == 200
        data = response.json() if passed else None
        
        if passed and data:
            print_test(
                "POST /api/status",
                passed and data.get("client_name") == payload["client_name"],
                f"Status: {response.status_code}, Created: {data.get('client_name')}"
            )
        else:
            print_test("POST /api/status", False, f"Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print_test("POST /api/status", False, f"Exception: {str(e)}")
        passed = False
    
    # Test GET /api/status
    try:
        response = requests.get(f"{BASE_URL}/api/status", timeout=10)
        get_passed = response.status_code == 200
        data = response.json() if get_passed else None
        
        if get_passed and isinstance(data, list):
            print_test(
                "GET /api/status",
                True,
                f"Status: {response.status_code}, Retrieved {len(data)} status checks"
            )
        else:
            print_test("GET /api/status", False, f"Status: {response.status_code}, Response: {response.text}")
            get_passed = False
    except Exception as e:
        print_test("GET /api/status", False, f"Exception: {str(e)}")
        get_passed = False
    
    return passed and get_passed

def test_etsy_status():
    """Test GET /api/etsy/status endpoint."""
    print("=" * 60)
    print("TEST: Etsy status endpoint")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/api/etsy/status", timeout=10)
        passed = response.status_code == 200
        data = response.json() if passed else None
        
        if passed and data:
            # Should return {"connected": false} or {"connected": true, ...}
            has_connected_field = "connected" in data
            print_test(
                "GET /api/etsy/status",
                passed and has_connected_field,
                f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
            )
            return passed and has_connected_field
        else:
            print_test("GET /api/etsy/status", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test("GET /api/etsy/status", False, f"Exception: {str(e)}")
        return False

def test_etsy_connect():
    """Test GET /api/etsy/connect endpoint."""
    print("=" * 60)
    print("TEST: Etsy connect endpoint")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/api/etsy/connect", timeout=10)
        passed = response.status_code == 200
        data = response.json() if passed else None
        
        if passed and data:
            auth_url = data.get("auth_url", "")
            # Verify auth_url contains required parameters
            has_client_id = "client_id=exrim1606tkej8alecztd70p" in auth_url
            has_challenge_method = "code_challenge_method=S256" in auth_url
            has_state = "state=" in auth_url
            # Check for URL-encoded version of /api/etsy/callback
            has_redirect_uri = "redirect_uri=" in auth_url and ("%2Fapi%2Fetsy%2Fcallback" in auth_url or "/api/etsy/callback" in auth_url)
            starts_with_etsy = auth_url.startswith("https://www.etsy.com/oauth/connect?")
            
            all_checks = has_client_id and has_challenge_method and has_state and has_redirect_uri and starts_with_etsy
            
            details = f"Status: {response.status_code}\n"
            details += f"   Auth URL starts with Etsy OAuth: {starts_with_etsy}\n"
            details += f"   Contains client_id=exrim1606tkej8alecztd70p: {has_client_id}\n"
            details += f"   Contains code_challenge_method=S256: {has_challenge_method}\n"
            details += f"   Contains state parameter: {has_state}\n"
            details += f"   Contains redirect_uri with /api/etsy/callback: {has_redirect_uri}\n"
            details += f"   Full URL: {auth_url}"
            
            print_test("GET /api/etsy/connect", all_checks, details)
            return all_checks
        else:
            print_test("GET /api/etsy/connect", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test("GET /api/etsy/connect", False, f"Exception: {str(e)}")
        return False

def test_etsy_callback_fake_state():
    """Test GET /api/etsy/callback with fake state."""
    print("=" * 60)
    print("TEST: Etsy callback with fake state")
    print("=" * 60)
    try:
        fake_state = "fake_state_12345"
        response = requests.get(
            f"{BASE_URL}/api/etsy/callback",
            params={"state": fake_state, "code": "fake_code"},
            timeout=10
        )
        passed = response.status_code == 200
        
        # Should return HTML page with error message
        is_html = "text/html" in response.headers.get("content-type", "")
        contains_error = "Invalid or expired state" in response.text or "failed" in response.text.lower()
        
        details = f"Status: {response.status_code}\n"
        details += f"   Content-Type is HTML: {is_html}\n"
        details += f"   Contains error message: {contains_error}\n"
        details += f"   Response length: {len(response.text)} chars"
        
        print_test(
            "GET /api/etsy/callback (fake state)",
            passed and is_html and contains_error,
            details
        )
        return passed and is_html and contains_error
    except Exception as e:
        print_test("GET /api/etsy/callback (fake state)", False, f"Exception: {str(e)}")
        return False

def test_etsy_disconnect():
    """Test POST /api/etsy/disconnect endpoint."""
    print("=" * 60)
    print("TEST: Etsy disconnect endpoint")
    print("=" * 60)
    try:
        response = requests.post(f"{BASE_URL}/api/etsy/disconnect", timeout=10)
        passed = response.status_code == 200
        data = response.json() if passed else None
        
        if passed and data:
            has_ok = data.get("ok") == True
            print_test(
                "POST /api/etsy/disconnect",
                passed and has_ok,
                f"Status: {response.status_code}, Response: {json.dumps(data)}"
            )
            return passed and has_ok
        else:
            print_test("POST /api/etsy/disconnect", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test("POST /api/etsy/disconnect", False, f"Exception: {str(e)}")
        return False

def test_etsy_publish_not_connected():
    """Test POST /api/etsy/publish without being connected."""
    print("=" * 60)
    print("TEST: Etsy publish without connection")
    print("=" * 60)
    try:
        payload = {
            "title": "Test Product",
            "description": "Test description",
            "price": 29.99,
            "quantity": 1,
            "tags": ["test"]
        }
        response = requests.post(f"{BASE_URL}/api/etsy/publish", json=payload, timeout=10)
        
        # Should return 401 with "Etsy not connected" message
        is_401 = response.status_code == 401
        
        try:
            error_data = response.json()
            has_error_msg = "not connected" in str(error_data).lower() or "etsy not connected" in str(error_data).lower()
        except Exception:
            has_error_msg = "not connected" in response.text.lower()
        
        details = f"Status: {response.status_code}\n"
        details += f"   Is 401 Unauthorized: {is_401}\n"
        details += f"   Contains 'not connected' message: {has_error_msg}\n"
        details += f"   Response: {response.text[:200]}"
        
        print_test(
            "POST /api/etsy/publish (not connected)",
            is_401 and has_error_msg,
            details
        )
        return is_401 and has_error_msg
    except Exception as e:
        print_test("POST /api/etsy/publish (not connected)", False, f"Exception: {str(e)}")
        return False

def verify_mongo_state_record():
    """
    Note: This test cannot directly verify MongoDB records without database access.
    The /api/etsy/connect endpoint should create a state record in db.etsy_oauth_states.
    This would need to be verified through backend logs or direct database access.
    """
    print("=" * 60)
    print("NOTE: MongoDB state record verification")
    print("=" * 60)
    print("⚠️  INFO: Cannot directly verify MongoDB etsy_oauth_states record without DB access.")
    print("   The /api/etsy/connect endpoint should create a state record in db.etsy_oauth_states.")
    print("   This can be verified by:")
    print("   1. Checking backend logs")
    print("   2. Direct MongoDB query: db.etsy_oauth_states.find()")
    print()

def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("BACKEND API TESTS - ETSY INTEGRATION")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print("=" * 60 + "\n")
    
    results = {}
    
    # Test existing endpoints first
    results["root"] = test_root_endpoint()
    results["status"] = test_status_endpoints()
    
    # Test Etsy endpoints
    results["etsy_status"] = test_etsy_status()
    results["etsy_connect"] = test_etsy_connect()
    results["etsy_callback"] = test_etsy_callback_fake_state()
    results["etsy_disconnect"] = test_etsy_disconnect()
    results["etsy_publish_unauth"] = test_etsy_publish_not_connected()
    
    # MongoDB verification note
    verify_mongo_state_record()
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60 + "\n")
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
