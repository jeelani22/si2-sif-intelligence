import urllib.request
import json

def verify_analyze_workflow():
    payload = {
        "report_type": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "life_saving_rule": "Energy Isolation",
        "description": "During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. Similar observations have been reported in this area."
    }

    url = "http://127.0.0.1:8000/api/reports/analyze"
    req = urllib.request.Request(url, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Origin", "http://localhost:3000")

    print("=== SENDING DEMO PAYLOAD TO FASTAPI ===")
    print(json.dumps(payload, indent=2))

    with urllib.request.urlopen(req, data=json.dumps(payload).encode("utf-8")) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("\n=== FASTAPI RESPONSE RECEIVED ===")
        print(f"HTTP Status: {resp.status}")
        print(json.dumps(res, indent=2))

        print("\n=== FIELD VERIFICATION ===")
        required_fields = [
            "potential_sif",
            "risk_score",
            "risk_level",
            "identified_hazards",
            "identified_life_saving_rules",
            "reasons",
            "pattern_status",
            "related_reports"
        ]

        all_present = True
        for field in required_fields:
            val = res.get(field)
            if val is not None:
                print(f"  [OK] {field}: {val}")
            else:
                print(f"  [FAIL] {field} is MISSING!")
                all_present = False

        if all_present:
            print("\n>>> ALL 8 REQUIRED FIELDS VERIFIED SUCCESSFULLY <<<")
        else:
            print("\n>>> VERIFICATION FAILED: MISSING FIELDS <<<")

if __name__ == "__main__":
    verify_analyze_workflow()
