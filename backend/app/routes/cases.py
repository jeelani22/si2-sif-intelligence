from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.case import CaseCreate, CaseUpdate, CaseResponse
from app.database import IN_MEMORY_DB

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("", response_model=List[CaseResponse])
def list_cases(status: Optional[str] = None, hazard: Optional[str] = None):
    cases = list(IN_MEMORY_DB["cases"].values())
    if status and status != "ALL":
        cases = [c for c in cases if c.get("status") == status]
    if hazard and hazard != "ALL":
        cases = [c for c in cases if c.get("hazard") == hazard]
    return cases

@router.get("/{id}", response_model=CaseResponse)
def get_case(id: str):
    case = IN_MEMORY_DB["cases"].get(id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {id} not found")
    return case

@router.post("", response_model=CaseResponse)
def create_case(payload: CaseCreate):
    new_num = len(IN_MEMORY_DB["cases"]) + 242
    new_id = f"SIF-0{new_num}"

    new_case = {
        "id": new_id,
        "type": payload.type,
        "hazard": payload.hazard,
        "location": payload.location,
        "risk": payload.risk,
        "sifPotential": payload.sifPotential,
        "assignedTo": payload.assignedTo,
        "status": payload.status,
        "riskOrigin": "Direct SIF Case Creation",
        "relatedReports": [],
        "riskTrajectory": str(payload.risk),
        "whyEscalated": ["Direct submission flagged for mandatory supervisory review."],
        "correctiveAction": {
            "text": "Review incident conditions and verify life-saving barrier restoration.",
            "assignedTo": payload.assignedTo,
            "priority": "High" if payload.risk >= 70 else "Medium",
            "due": "TODAY, 17:00"
        },
        "lifecycle": [
            { "name": "DETECTED", "completed": True, "active": False },
            { "name": "ALERTED", "completed": True, "active": False },
            { "name": "ASSIGNED", "completed": True, "active": False },
            { "name": "ACTION IN PROGRESS", "completed": False, "active": True },
            { "name": "EVIDENCE SUBMITTED", "completed": False, "active": False },
            { "name": "VERIFIED", "completed": False, "active": False },
            { "name": "CLOSED", "completed": False, "active": False }
        ],
        "evidence": "Pending",
        "verification": "Pending Evidence",
        "auditTrail": [
            { "time": datetime.now().strftime("%H:%M"), "text": "Case registered in SIF Command Center" }
        ]
    }

    IN_MEMORY_DB["cases"][new_id] = new_case
    return new_case

@router.patch("/{id}", response_model=CaseResponse)
def update_case(id: str, payload: CaseUpdate):
    case = IN_MEMORY_DB["cases"].get(id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {id} not found")

    time_now = datetime.now().strftime("%H:%M")
    if not case.get("auditTrail"):
        case["auditTrail"] = []

    # Update assigned owner
    if payload.assignedTo is not None:
        case["assignedTo"] = payload.assignedTo

    # Update corrective action
    if payload.correctiveAction is not None:
        case["correctiveAction"] = payload.correctiveAction.model_dump()
        case["auditTrail"].append({
            "time": time_now,
            "text": f"Corrective action plan updated for {case.get('assignedTo', 'supervisor')}"
        })

    # Evidence submission (Separate from verification!)
    if payload.evidence is not None:
        case["evidence"] = payload.evidence
        # Update lifecycle: mark EVIDENCE SUBMITTED as completed
        if "lifecycle" in case:
            for step in case["lifecycle"]:
                if step["name"] in ["DETECTED", "ALERTED", "ASSIGNED", "ACTION IN PROGRESS", "EVIDENCE SUBMITTED"]:
                    step["completed"] = True
                    step["active"] = False
                elif step["name"] == "VERIFIED":
                    step["active"] = True
        case["status"] = "EVIDENCE SUBMITTED"
        case["verification"] = "Pending Supervisor Signoff"
        case["auditTrail"].append({
            "time": time_now,
            "text": f"Evidence submitted: {payload.evidence}"
        })

    # Verification (Independent supervisor action)
    if payload.verification is not None and payload.verification != case.get("verification"):
        case["verification"] = payload.verification
        if "lifecycle" in case:
            for step in case["lifecycle"]:
                step["completed"] = True
                step["active"] = False
        case["status"] = "CLOSED"
        case["auditTrail"].append({
            "time": time_now,
            "text": f"Supervisor verification complete: {payload.verification}. Case closed."
        })

    # Direct status override if requested
    if payload.status is not None and payload.evidence is None and payload.verification is None:
        case["status"] = payload.status
        case["auditTrail"].append({
            "time": time_now,
            "text": f"Status changed to {payload.status}"
        })

    return case
