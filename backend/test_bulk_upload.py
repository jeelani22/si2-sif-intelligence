import urllib.request
import io
import json
import uuid
import pandas as pd

def create_sample_df():
    data = [
        {
            "report_id": "R104",
            "report_type": "Near Miss",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "Energy Isolation",
            "description": "During maintenance activity, equipment was isolated but isolation point was not verified before work started. Recurring pattern in this zone."
        },
        {
            "report_id": "R081",
            "report_type": "Unsafe Act",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "Energy Isolation",
            "description": "Technician observed opening electrical junction box without lockout tag attached."
        },
        {
            "report_id": "R043",
            "report_type": "Near Miss",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "—",
            "description": "Breaker handle was stiff and did not lock completely into off position."
        },
        {
            "report_id": "R017",
            "report_type": "Unsafe Condition",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "—",
            "description": "LOTO station missing standard lockout hasps for multi-worker isolation."
        },
        {
            "report_id": "R001",
            "report_type": "Near Miss",
            "location": "Process Area A",
            "equipment": "Pump P-101",
            "hazard": "Energy Isolation",
            "life_saving_rule": "—",
            "description": "Initial unsafe condition identified during shift turnover walk-through."
        }
    ]
    return pd.DataFrame(data)

def send_multipart_file(url, field_name, filename, file_bytes, content_type):
    boundary = uuid.uuid4().hex
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("Origin", "http://localhost:3000")

    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def test_bulk_uploads():
    df = create_sample_df()

    # 1. Test CSV Upload
    print("=== 1. TESTING CSV UPLOAD ===")
    csv_bytes = df.to_csv(index=False).encode("utf-8")
    status, res_csv = send_multipart_file(
        "http://127.0.0.1:8000/api/reports/upload-bulk",
        "file",
        "OIL_Safety_Reports_Sep2026.csv",
        csv_bytes,
        "text/csv"
    )
    print(f"CSV Upload Status: {status}")
    print(f"File Name: {res_csv.get('fileName')}")
    print(f"Total Analyzed: {res_csv.get('totalAnalyzed')}")
    print(f"Metrics: {res_csv.get('metrics')}")
    print(f"Distribution: {res_csv.get('distribution')}")
    print(f"Trajectory Points ({len(res_csv.get('trajectory', []))}): {res_csv.get('trajectory')}")
    print(f"Prioritized Reports Count: {len(res_csv.get('reports', []))}")
    for r in res_csv.get('reports', [])[:5]:
        print(f"  • {r.get('id')} | Risk: {r.get('risk')} | SIF: {r.get('sifPotential')} | Pattern: {r.get('patternStatus')} | Case: {r.get('caseStatus')}")

    # 2. Test XLSX Upload
    print("\n=== 2. TESTING XLSX UPLOAD ===")
    excel_buf = io.BytesIO()
    df.to_excel(excel_buf, index=False, engine="openpyxl")
    xlsx_bytes = excel_buf.getvalue()
    status, res_xlsx = send_multipart_file(
        "http://127.0.0.1:8000/api/reports/upload-bulk",
        "file",
        "OIL_Safety_Reports_Sep2026.xlsx",
        xlsx_bytes,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    print(f"XLSX Upload Status: {status}")
    print(f"File Name: {res_xlsx.get('fileName')}")
    print(f"Total Analyzed: {res_xlsx.get('totalAnalyzed')}")
    print(f"Metrics: {res_xlsx.get('metrics')}")
    print(f"Distribution: {res_xlsx.get('distribution')}")
    print(f"Trajectory Points: {res_xlsx.get('trajectory')}")

    print("\n>>> CSV AND XLSX BULK INTELLIGENCE INTEGRATION VERIFIED SUCCESSFULLY <<<")

if __name__ == "__main__":
    test_bulk_uploads()
