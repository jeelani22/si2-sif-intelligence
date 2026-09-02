import urllib.request
import json

def run_integration_tests():
    print("=== 1. TESTING SWAGGER OPENAPI SPEC ===")
    req_swagger = urllib.request.Request("http://127.0.0.1:8000/openapi.json")
    with urllib.request.urlopen(req_swagger) as resp:
        openapi = json.loads(resp.read().decode("utf-8"))
        print(f"OpenAPI Version: {openapi.get('openapi')}")
        print(f"Title: {openapi.get('info', {}).get('title')}")
        paths = list(openapi.get("paths", {}).keys())
        print(f"Documented Endpoints ({len(paths)}):")
        for p in paths:
            print(f"  • {p}")

    print("\n=== 2. TESTING CORS CONFIGURATION (Pre-flight OPTIONS) ===")
    req_cors = urllib.request.Request("http://127.0.0.1:8000/api/reports/analyze", method="OPTIONS")
    req_cors.add_header("Origin", "http://localhost:3000")
    req_cors.add_header("Access-Control-Request-Method", "POST")
    req_cors.add_header("Access-Control-Request-Headers", "Content-Type")
    with urllib.request.urlopen(req_cors) as resp:
        print(f"Status: {resp.status}")
        print(f"access-control-allow-origin: {resp.headers.get('access-control-allow-origin')}")
        print(f"access-control-allow-methods: {resp.headers.get('access-control-allow-methods')}")
        print(f"access-control-allow-headers: {resp.headers.get('access-control-allow-headers')}")

    print("\n=== 3. TESTING ENERGY ISOLATION ANALYSIS SCENARIO ===")
    payload = {
        "report_type": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-102A",
        "hazard": "Electrical Energy",
        "life_saving_rule": "Energy Isolation",
        "description": "During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. This is a recurring issue in this zone."
    }
    req_post = urllib.request.Request("http://127.0.0.1:8000/api/reports/analyze", method="POST")
    req_post.add_header("Content-Type", "application/json")
    req_post.add_header("Origin", "http://localhost:3000")
    with urllib.request.urlopen(req_post, data=json.dumps(payload).encode("utf-8")) as resp:
        res_json = json.loads(resp.read().decode("utf-8"))
        print(f"HTTP Status: {resp.status}")
        print("FastAPI JSON Response:")
        print(json.dumps(res_json, indent=2))

if __name__ == "__main__":
    run_integration_tests()
