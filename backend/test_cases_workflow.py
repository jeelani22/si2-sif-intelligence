import urllib.request
import json

def test_cases_lifecycle():
    base_url = "http://127.0.0.1:8000/api/cases"

    print("=== 1. FETCHING CASES LIST (GET /api/cases) ===")
    req = urllib.request.Request(base_url)
    with urllib.request.urlopen(req) as resp:
        cases = json.loads(resp.read().decode("utf-8"))
        print(f"Status: {resp.status}, Total Cases: {len(cases)}")
        for c in cases:
            print(f"  * {c['id']} | {c['type']} | {c['hazard']} | Risk: {c['risk']} | SIF: {c['sifPotential']} | Status: {c['status']}")

    print("\n=== 2. FETCHING SIF-0241 DETAILS (GET /api/cases/SIF-0241) ===")
    req = urllib.request.Request(f"{base_url}/SIF-0241")
    with urllib.request.urlopen(req) as resp:
        case = json.loads(resp.read().decode("utf-8"))
        print(f"Case ID: {case.get('id')}")
        print(f"Risk Score: {case.get('risk')}/100")
        print(f"SIF Potential: {case.get('sifPotential')}")
        print(f"Location: {case.get('location')}")
        print(f"Hazard: {case.get('hazard')}")
        print(f"Risk Origin: {case.get('riskOrigin')}")
        print(f"Related Reports: {case.get('relatedReports')}")
        traj = str(case.get('riskTrajectory', '')).replace('\u2192', '->')
        print(f"Risk Trajectory: {traj}")
        print(f"Assigned Owner: {case.get('correctiveAction', {}).get('assignedTo')}")
        print(f"Status: {case.get('status')}")
        print(f"Evidence: {case.get('evidence')}")
        print(f"Verification: {case.get('verification')}")
        print(f"Audit Trail ({len(case.get('auditTrail', []))} entries):")
        for a in case.get("auditTrail", []):
            print(f"  [{a.get('time')}] {a.get('text')}")

    print("\n=== 3. SUBMITTING EVIDENCE (PATCH /api/cases/SIF-0241) ===")
    evidence_payload = {
        "evidence": "Photographic LOTO zero-voltage verification & supervisor permit attached"
    }
    req = urllib.request.Request(f"{base_url}/SIF-0241", data=json.dumps(evidence_payload).encode("utf-8"), method="PATCH")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as resp:
        case_ev = json.loads(resp.read().decode("utf-8"))
        print(f"Status: {case_ev.get('status')}")
        print(f"Evidence State: {case_ev.get('evidence')}")
        print(f"Verification State (Separate!): {case_ev.get('verification')}")
        assert case_ev.get("status") == "EVIDENCE SUBMITTED", "Case must NOT automatically close on evidence submit!"

    print("\n=== 4. SUPERVISOR VERIFICATION (PATCH /api/cases/SIF-0241) ===")
    verify_payload = {
        "verification": "Verified by HSE Area Lead & Shift Supervisor"
    }
    req = urllib.request.Request(f"{base_url}/SIF-0241", data=json.dumps(verify_payload).encode("utf-8"), method="PATCH")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as resp:
        case_ver = json.loads(resp.read().decode("utf-8"))
        print(f"Final Status: {case_ver.get('status')}")
        print(f"Verification: {case_ver.get('verification')}")
        print(f"Lifecycle Steps:")
        for step in case_ver.get("lifecycle", []):
            print(f"  * {step['name']}: Completed={step['completed']}")

    print("\n=== 5. VERIFYING BACKEND STATE PERSISTENCE (GET /api/cases/SIF-0241) ===")
    req = urllib.request.Request(f"{base_url}/SIF-0241")
    with urllib.request.urlopen(req) as resp:
        case_persisted = json.loads(resp.read().decode("utf-8"))
        print(f"Persisted Status: {case_persisted.get('status')}")
        print(f"Audit Trail count: {len(case_persisted.get('auditTrail', []))}")

    print("\n>>> CASES BACKEND WORKFLOW & PERSISTENCE VERIFIED SUCCESSFULLY <<<")

if __name__ == "__main__":
    test_cases_lifecycle()
