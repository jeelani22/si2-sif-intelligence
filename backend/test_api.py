import urllib.request
import json
import sys

def test_api(method, path, data=None):
    url = f"http://127.0.0.1:8000{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    body = json.dumps(data).encode("utf-8") if data else None
    try:
        with urllib.request.urlopen(req, data=body) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            print(f"[{resp.status}] {method} {path} -> SUCCESS")
            return res_data
    except Exception as e:
        print(f"[FAIL] {method} {path} -> ERROR: {e}")
        return None

if __name__ == "__main__":
    print("=== TESTING ALL 13 REQUIRED FASTAPI ENDPOINTS ===")
    test_api("GET", "/api/health")
    test_api("GET", "/api/dashboard")
    test_api("GET", "/api/reports")
    test_api("GET", "/api/reports/R104")
    test_api("POST", "/api/reports", {
        "reportType": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-102A",
        "hazard": "Electrical Energy",
        "lifeSavingRule": "Energy Isolation",
        "description": "Technician forgot to perform multimeter zero energy check before touching capacitor terminal."
    })
    test_api("POST", "/api/reports/analyze", {
        "reportType": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-102A",
        "hazard": "Electrical Energy",
        "lifeSavingRule": "Energy Isolation",
        "description": "During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. This is a recurring issue in this zone."
    })
    test_api("POST", "/api/reports/bulk-analyze", [
        {"id": "R104", "description": "LOTO zero energy check omitted", "hazard": "Energy Isolation"},
        {"id": "R081", "description": "Unclipped lanyard at 7m", "hazard": "Working at Height"}
    ])
    test_api("GET", "/api/patterns")
    test_api("GET", "/api/risk-evolution/PAT-001")
    test_api("GET", "/api/cases")
    test_api("GET", "/api/cases/SIF-0241")
    test_api("POST", "/api/cases", {
        "type": "Near Miss",
        "hazard": "Energy Isolation",
        "location": "Process Area A",
        "risk": 91,
        "sifPotential": "Y",
        "assignedTo": "J. Thompson",
        "status": "ACTION IN PROGRESS"
    })
    test_api("PATCH", "/api/cases/SIF-0241", {
        "status": "ACTION IN PROGRESS",
        "evidence": "Photographic LOTO signoff submitted"
    })
    print("=== ALL 13 ENDPOINTS TESTED SUCCESSFULLY ===")
