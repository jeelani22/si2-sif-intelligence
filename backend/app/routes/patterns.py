from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from app.models.risk import PatternResponse
from app.database import IN_MEMORY_DB

router = APIRouter(tags=["Patterns & Risk Evolution"])

PATTERNS_DB = {
    "PAT-001": {
        "id": "PAT-001",
        "hazard": "ENERGY ISOLATION",
        "location": "Process Area A • Pump P-101",
        "equipment": "Pump P-101",
        "currentRiskScore": 91,
        "maxScore": 100,
        "statusBadges": ["CRITICAL", "ESCALATED"],
        "logicBanner": "Non-SIF reports remain in the intelligence pipeline. Recurring related observations + increasing risk trajectory = emerging Potential SIF risk.",
        "escalationMessage": "Potential SIF risk increased due to recurring related observations.",
        "trajectoryPoints": [
            { "id": "R001", "risk": 22, "band": "NON-SIF", "classification": "Non-SIF", "status": "MONITORING", "title": "Initial unsafe condition identified during shift turnover" },
            { "id": "R017", "risk": 39, "band": "NON-SIF", "classification": "Non-SIF", "status": "RELATED", "title": "Related LOTO station observation reported" },
            { "id": "R043", "risk": 57, "band": "NON-SIF", "classification": "Rising Risk", "status": "RISING", "title": "Breaker handle stiff / risk escalating due to proximity" },
            { "id": "R081", "risk": 76, "band": "RISING RISK", "classification": "High Risk", "status": "PATTERN DETECTED", "title": "Recurring hazard pattern confirmed in junction box" },
            { "id": "R104", "risk": 91, "band": "POTENTIAL SIF", "classification": "Potential SIF", "status": "ESCALATED", "title": "Critical threshold reached - Potential SIF designated" }
        ],
        "checklist": [
            { "text": "Same location (Process Area A)", "checked": True },
            { "text": "Same equipment (Pump P-101)", "checked": True },
            { "text": "Same hazard", "checked": True },
            { "text": "Repeated related observations", "checked": True },
            { "text": "Increasing frequency", "checked": True },
            { "text": "Increasing risk scores", "checked": True, "isTrend": True },
            { "text": "Life-Saving Rule concern (Energy Isolation)", "checked": True, "isAlert": True }
        ],
        "timeline": [
            { "id": "R001", "risk": 22, "badge": "MONITORING", "title": "Initial unsafe condition identified", "isLatest": False },
            { "id": "R017", "risk": 39, "badge": "RELATED", "title": "Related observation reported", "isLatest": False },
            { "id": "R043", "risk": 57, "badge": "RISING", "title": "Risk escalating due to proximity", "isLatest": False },
            { "id": "R081", "risk": 76, "badge": "PATTERN DETECTED", "title": "Recurring hazard pattern confirmed", "isLatest": False },
            { "id": "R104", "risk": 91, "badge": "ESCALATED", "title": "Critical threshold reached - Potential SIF designated", "isLatest": True }
        ],
        "relatedReports": [
            { "id": "R081", "risk": 76, "title": "Unsafe Act - Lockout tag missing" },
            { "id": "R043", "risk": 57, "title": "Near Miss - Breaker handle stiff" },
            { "id": "R017", "risk": 39, "title": "Unsafe Condition - Hasps missing" },
            { "id": "R001", "risk": 22, "title": "Near Miss - Shift turnover observation" }
        ]
    }
}

@router.get("/patterns")
def get_patterns():
    return list(PATTERNS_DB.values())

@router.get("/risk-evolution/{id}")
def get_risk_evolution(id: str):
    pattern = PATTERNS_DB.get(id) or PATTERNS_DB.get("PAT-001")
    if not pattern:
        raise HTTPException(status_code=404, detail="Risk pattern not found")
    return pattern
