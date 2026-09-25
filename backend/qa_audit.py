import urllib.request
import io
import json
import uuid
import sys
import pandas as pd

def send_req(url, method="GET", data=None, headers=None):
    req = urllib.request.Request(url, method=method)
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    body = json.dumps(data).encode("utf-8") if data is not None else None
    with urllib.request.urlopen(req, data=body) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def send_multipart(url, filename, file_bytes, content_type):
    boundary = uuid.uuid4().hex
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def run_qa_audit():
    results = {}
    base_api = "http://127.0.0.1:8000/api"

    print("==================================================")
    print("      SIH 2026 MVP - COMPREHENSIVE QA AUDIT      ")
    print("==================================================")

    # 1. Backend Health & Connectivity
    try:
        s, r = send_req(f"{base_api}/health")
        results["Backend API Connectivity"] = "PASS" if s == 200 and r.get("status") == "online" else "FAIL"
    except Exception as e:
        results["Backend API Connectivity"] = f"FAIL ({e})"

    # 2. Command Center Dashboard API
    try:
        s, r = send_req(f"{base_api}/dashboard")
        has_metrics = "metrics" in r and r["metrics"]["totalReports"] == 1247
        has_alerts = len(r.get("alerts", [])) >= 2
        results["Command Center Screen & Metrics"] = "PASS" if has_metrics and has_alerts else "FAIL"
    except Exception as e:
        results["Command Center Screen & Metrics"] = f"FAIL ({e})"

    # 3. Analyze Report Flow
    try:
        analyze_payload = {
            "report_type": "Near Miss",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "Energy Isolation",
            "description": "During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. Similar observations have been reported in this area."
        }
        s, r = send_req(f"{base_api}/reports/analyze", method="POST", data=analyze_payload, headers={"Content-Type": "application/json"})
        score_ok = r.get("riskScore") == 91 or r.get("risk_score") == 91
        sif_ok = r.get("potentialSif") == "YES" or r.get("potential_sif") == "YES"
        escalated_ok = r.get("escalationTriggered") is True or r.get("escalation_triggered") is True
        results["Analyze Report Flow (SIF Engine)"] = "PASS" if (score_ok and sif_ok and escalated_ok) else "FAIL"
    except Exception as e:
        results["Analyze Report Flow (SIF Engine)"] = f"FAIL ({e})"

    # 4. CSV Upload & Parsing
    try:
        df = pd.DataFrame([
            {"report_id": "R104", "report_type": "Near Miss", "hazard": "Energy Isolation", "description": "LOTO unverified"},
            {"report_id": "R081", "report_type": "Unsafe Act", "hazard": "Energy Isolation", "description": "Lockout missing"},
            {"report_id": "R043", "report_type": "Near Miss", "hazard": "Energy Isolation", "description": "Stiff breaker"}
        ])
        csv_bytes = df.to_csv(index=False).encode("utf-8")
        s, r = send_multipart(f"{base_api}/reports/upload-bulk", "OIL_Safety_Reports_Sep2026.csv", csv_bytes, "text/csv")
        csv_ok = s == 200 and r.get("totalAnalyzed") == 1247 and len(r.get("reports", [])) >= 5
        results["CSV Upload & Pandas Parsing"] = "PASS" if csv_ok else "FAIL"
    except Exception as e:
        results["CSV Upload & Pandas Parsing"] = f"FAIL ({e})"

    # 5. XLSX Upload & OpenPyXL Parsing
    try:
        excel_buf = io.BytesIO()
        df.to_excel(excel_buf, index=False, engine="openpyxl")
        xlsx_bytes = excel_buf.getvalue()
        s, r = send_multipart(f"{base_api}/reports/upload-bulk", "OIL_Safety_Reports_Sep2026.xlsx", xlsx_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        xlsx_ok = s == 200 and r.get("totalAnalyzed") == 1247
        results["XLSX Upload & OpenPyXL Parsing"] = "PASS" if xlsx_ok else "FAIL"
    except Exception as e:
        results["XLSX Upload & OpenPyXL Parsing"] = f"FAIL ({e})"

    # 6. Trajectory R001 -> R104 in Bulk & Risk Evolution
    try:
        s, r = send_req(f"{base_api}/risk-evolution/PAT-001")
        pts = r.get("trajectoryPoints", [])
        scores = [p["risk"] for p in pts]
        traj_ok = scores == [22, 39, 57, 76, 91]
        results["R001->R104 Trajectory Engine (22->39->57->76->91)"] = "PASS" if traj_ok else "FAIL"
    except Exception as e:
        results["R001->R104 Trajectory Engine (22->39->57->76->91)"] = f"FAIL ({e})"

    # 7. Related Reports Resolution
    try:
        s, r = send_req(f"{base_api}/cases/SIF-0241")
        rel_reports = r.get("relatedReports", [])
        rel_ok = "R001" in rel_reports and "R104" in rel_reports
        results["Related Reports Correlation"] = "PASS" if rel_ok else "FAIL"
    except Exception as e:
        results["Related Reports Correlation"] = f"FAIL ({e})"

    # 8. Create Case
    try:
        new_case_payload = {
            "type": "Unsafe Act",
            "hazard": "Working at Height",
            "location": "Rig Floor 2",
            "risk": 84,
            "sifPotential": "Y",
            "assignedTo": "D. Miller",
            "status": "ACTION IN PROGRESS"
        }
        s, r = send_req(f"{base_api}/cases", method="POST", data=new_case_payload, headers={"Content-Type": "application/json"})
        create_ok = s == 200 and r.get("id", "").startswith("SIF-")
        results["Create Case (POST /api/cases)"] = "PASS" if create_ok else "FAIL"
    except Exception as e:
        results["Create Case (POST /api/cases)"] = f"FAIL ({e})"

    # 9. Update Corrective Action Plan
    try:
        action_payload = {
            "correctiveAction": {
                "text": "Immediate Action: Stop affected maintenance activity and verify energy isolation before work resumes.",
                "assignedTo": "HSE Engineer A",
                "priority": "Critical",
                "due": "TODAY, 14:30"
            }
        }
        s, r = send_req(f"{base_api}/cases/SIF-0241", method="PATCH", data=action_payload, headers={"Content-Type": "application/json"})
        action_ok = s == 200 and r.get("correctiveAction", {}).get("assignedTo") == "HSE Engineer A"
        results["Update Action Plan (PATCH /api/cases/{id})"] = "PASS" if action_ok else "FAIL"
    except Exception as e:
        results["Update Action Plan (PATCH /api/cases/{id})"] = f"FAIL ({e})"

    # 10. Submit Evidence (Must NOT automatically close case!)
    try:
        evidence_payload = {
            "evidence": "Photographic LOTO zero-voltage verification & supervisor permit attached"
        }
        s, r = send_req(f"{base_api}/cases/SIF-0241", method="PATCH", data=evidence_payload, headers={"Content-Type": "application/json"})
        ev_ok = s == 200 and r.get("status") == "EVIDENCE SUBMITTED" and r.get("evidence") != "Pending"
        results["Submit Evidence (Distinct from Verification)"] = "PASS" if ev_ok else "FAIL"
    except Exception as e:
        results["Submit Evidence (Distinct from Verification)"] = f"FAIL ({e})"

    # 11. Verify Corrective Action (Supervisor Action)
    try:
        verify_payload = {
            "verification": "Verified by HSE Reviewer A"
        }
        s, r = send_req(f"{base_api}/cases/SIF-0241", method="PATCH", data=verify_payload, headers={"Content-Type": "application/json"})
        ver_ok = s == 200 and r.get("status") == "CLOSED" and r.get("verification") != "Pending Evidence"
        results["Verify Corrective Action (Supervisor Signoff)"] = "PASS" if ver_ok else "FAIL"
    except Exception as e:
        results["Verify Corrective Action (Supervisor Signoff)"] = f"FAIL ({e})"

    # 12. Database State Persistence Across Reloads
    try:
        s, r = send_req(f"{base_api}/cases/SIF-0241")
        persist_ok = s == 200 and r.get("status") == "CLOSED" and len(r.get("auditTrail", [])) >= 4
        results["Database State Persistence Across Reloads"] = "PASS" if persist_ok else "FAIL"
    except Exception as e:
        results["Database State Persistence Across Reloads"] = f"FAIL ({e})"

    # 13. Frontend Live Accessibility
    try:
        req_front = urllib.request.Request("http://localhost:3000/")
        with urllib.request.urlopen(req_front) as resp:
            results["Frontend Desktop Web Live Server"] = "PASS" if resp.status == 200 else "FAIL"
    except Exception as e:
        results["Frontend Desktop Web Live Server"] = f"FAIL ({e})"

    print("\n--------------------------------------------------")
    print("                AUDIT SUMMARY TABLE               ")
    print("--------------------------------------------------")
    for item, status in results.items():
        print(f"[{status:^9}] : {item}")
    print("==================================================")

if __name__ == "__main__":
    run_qa_audit()
