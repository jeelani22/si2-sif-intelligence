# SIF Intelligence Safety Command Center (SIH 2026 MVP)

Early detection and continuous monitoring of Severe Injury & Fatality (SIF) precursors in industrial operations.

---

## 📌 Problem Statement
In high-hazard industrial environments (such as oil & gas, petrochemical, and heavy manufacturing), the vast majority of safety observations (near-misses, unsafe acts, unsafe conditions) are individually cataloged as **Non-SIF** and closed without further analysis. However, catastrophic incidents often occur not from isolated catastrophic failures, but from **recurring low-energy precursor signals** occurring across the same process areas, equipment, and Life-Saving Rule domains.

Standard safety dashboards suffer from:
1. **Isolated Analysis**: Evaluating reports in silos rather than recognizing cumulative pattern escalation.
2. **Permanent Discarding**: Treating low-severity observations as resolved, ignoring repeat occurrences.
3. **Delayed Action**: Failing to escalate emerging risk trajectories before an actual barrier failure happens.

---

## 💡 Solution Overview
**SIF Intelligence** is an enterprise safety command center providing continuous precursor intelligence across 5 core workflows:

1. **Command Center**: High-level operational awareness, real-time KPI metrics, emerging risk alerts, risk overview distribution bars, and active SIF cases.
2. **Analyze Report**: Single-report SIF precursor evaluation using an explainable rule-based intelligence engine cross-referenced against historical observations.
3. **Bulk Intelligence**: Batch ingestion of CSV/Excel safety observations via Pandas with dynamic clustering, distribution modeling, and prioritized triage.
4. **Cases**: End-to-end master-detail SIF case lifecycle tracking (`DETECTED` ➔ `ALERTED` ➔ `ASSIGNED` ➔ `ACTION IN PROGRESS` ➔ `EVIDENCE SUBMITTED` ➔ `VERIFIED` ➔ `CLOSED`), enforcing separation of evidence submission and supervisor verification.
5. **Risk Evolution**: Visualizing how low-severity observations (e.g., `R001` at risk 22) remain in the pipeline and dynamically escalate to critical SIF precursors (e.g., `R104` at risk 91) across recurring patterns.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS (Curated industrial enterprise design system)
- **Visuals & Charts**: Vector SVG Trajectory Curves & Native Interactive Canvases
- **Icons & Typography**: Google Fonts (Inter + Material Symbols Outlined)

### Backend
- **Framework**: Python 3.11+ / FastAPI
- **Server**: Uvicorn (ASGI)
- **Data Processing**: Pandas + OpenPyXL
- **Database / Store**: MongoDB connection with zero-dependency in-memory document cache & audit store
- **Validation**: Pydantic v2

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **MongoDB** *(Optional)*: If MongoDB is not running locally, the backend automatically utilizes its fast in-memory document store.

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The FastAPI backend will be live at `http://127.0.0.1:8000` (Interactive API documentation at `http://127.0.0.1:8000/docs`).*

---

### 3. Frontend Setup
```bash
# In the root project directory
npm install

# Start the Vite development server
npm run dev
```
*The React desktop application will be live at `http://localhost:3000`.*

---

### 4. Production Build
```bash
# Verify production bundle compilation
npm run build
```

---

## 🔐 Environment Variables

Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | FastAPI backend server port | `8000` |
| `HOST` | Backend binding host | `127.0.0.1` |
| `MONGODB_URL` | MongoDB connection URI | `mongodb://localhost:27017` |
| `DATABASE_NAME` | MongoDB database identifier | `sif_intelligence_db` |
| `VITE_API_BASE_URL` | Frontend REST API endpoint prefix | `http://127.0.0.1:8000/api` |

---

## 🎯 Verified Demo Scenario: Energy Isolation

- **Entity**: `Pump P-101` in `Process Area A`
- **Hazard**: `Energy Isolation`
- **Demonstrated Trajectory**:
  $$\mathbf{R001} \ (22, \text{Non-SIF}) \longrightarrow \mathbf{R017} \ (39, \text{Non-SIF}) \longrightarrow \mathbf{R043} \ (57, \text{Rising Risk}) \longrightarrow \mathbf{R081} \ (76, \text{High Risk}) \longrightarrow \mathbf{R104} \ (91, \text{Potential SIF})$$
- **Result**: `SIF-0241` auto-escalated to Critical priority requiring mandatory supervisory LOTO verification before case closure.

---

## ⚠️ MVP Limitations
- **NLP / ML Scope**: Precursor scoring utilizes explainable rule-based and frequency clustering engines calibrated for SIH demonstration rather than heavyweight ML models (BERT/LLMs).
- **Authentication**: Role-based access control and enterprise Single Sign-On (SSO) are intentionally omitted in this MVP build.
- **Data Adapters**: Designed for CSV/Excel batch intake and REST APIs; direct live SAP/Maximo integration is simulated.
