import urllib.request
import json

def test_risk_evolution():
    base_url = "http://127.0.0.1:8000/api"

    print("=== 1. FETCHING PATTERNS LIST (GET /api/patterns) ===")
    req = urllib.request.Request(f"{base_url}/patterns")
    with urllib.request.urlopen(req) as resp:
        patterns = json.loads(resp.read().decode("utf-8"))
        print(f"Status: {resp.status}, Patterns count: {len(patterns)}")
        for p in patterns:
            print(f"  * Pattern ID: {p.get('id')} | Hazard: {p.get('hazard')} | Location: {p.get('location')} | Current Score: {p.get('currentRiskScore')}")

    print("\n=== 2. FETCHING RISK EVOLUTION (GET /api/risk-evolution/PAT-001) ===")
    req = urllib.request.Request(f"{base_url}/risk-evolution/PAT-001")
    with urllib.request.urlopen(req) as resp:
        evo = json.loads(resp.read().decode("utf-8"))
        print(f"Status: {resp.status}")
        print(f"Hazard: {evo.get('hazard')}")
        print(f"Location: {evo.get('location')}")
        print(f"Current Risk Score: {evo.get('currentRiskScore')}/{evo.get('maxScore')}")
        print(f"Logic Banner: {evo.get('logicBanner')}")
        print(f"Escalation Message: {evo.get('escalationMessage')}")

        print("\n=== 3. VERIFYING TRAJECTORY POINTS ===")
        trajectory = evo.get("trajectoryPoints", [])
        expected = [
            ("R001", 22, "Non-SIF"),
            ("R017", 39, "Non-SIF"),
            ("R043", 57, "Rising Risk"),
            ("R081", 76, "High Risk"),
            ("R104", 91, "Potential SIF")
        ]

        for expected_id, expected_risk, expected_class in expected:
            match = next((pt for pt in trajectory if pt.get("id") == expected_id), None)
            assert match is not None, f"Point {expected_id} missing in trajectory!"
            assert match.get("risk") == expected_risk, f"Point {expected_id} risk mismatch ({match.get('risk')} != {expected_risk})!"
            print(f"  [OK] {match.get('id')} -> {match.get('risk')} -> {match.get('classification')} (Band: {match.get('band')}, Status: {match.get('status')})")

        print("\n=== 4. VERIFYING CHECKLIST & RELATED REPORTS ===")
        for item in evo.get("checklist", []):
            print(f"  * Checklist: {item.get('text')}")
        print(f"Related Reports: {evo.get('relatedReports')}")

    print("\n>>> RISK EVOLUTION API AND TRAJECTORY ENGINE VERIFIED SUCCESSFULLY <<<")

if __name__ == "__main__":
    test_risk_evolution()
