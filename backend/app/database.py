import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.config import settings

logger = logging.getLogger(__name__)

# In-memory document store as resilient fallback & fast cache
IN_MEMORY_DB: Dict[str, Dict[str, Any]] = {
    "reports": {},
    "cases": {},
    "risk_history": {},
    "patterns": {},
    "metrics": {
        "totalReports": 1247,
        "potentialSif": 86,
        "nonSif": 1161,
        "highRisk": 19,
        "risingRisk": 5,
        "escalated": 7
    },
    "alerts": [
        {
            "id": "ALT-101",
            "caseId": "SIF-0241",
            "level": "CRITICAL",
            "riskScore": 91,
            "title": "Recurring energy-isolation observations in Process Area A",
            "location": "Process Area A",
            "status": "Escalated",
            "borderClass": "border-[#93000a]",
            "levelColorClass": "text-[#93000a]",
            "statusColorClass": "text-[#ba1a1a]"
        },
        {
            "id": "ALT-102",
            "caseId": "SIF-0240",
            "level": "HIGH",
            "riskScore": 78,
            "title": "Increasing review-priority trajectory detected - Tank Farm",
            "location": "Tank Farm",
            "status": "Action Required",
            "borderClass": "border-[#ba1a1a]",
            "levelColorClass": "text-[#ba1a1a]",
            "statusColorClass": "text-[#d97706]"
        }
    ]
}

# Initial seed data matching the 5 approved screenshots
INITIAL_REPORTS = [
    {
        "id": "R104",
        "reportType": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "lifeSavingRule": "Energy Isolation",
        "description": "During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. This is a recurring issue in this zone.",
        "risk": 91,
        "sifPotential": "Potential SIF",
        "patternStatus": "ESCALATED",
        "caseStatus": "ACTION REQUIRED",
        "isLatest": True,
        "timestamp": "12 min ago"
    },
    {
        "id": "R081",
        "reportType": "Unsafe Act",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "lifeSavingRule": "Energy Isolation",
        "description": "Technician observed opening electrical junction box without lockout tag attached.",
        "risk": 76,
        "sifPotential": "High Risk",
        "patternStatus": "PATTERN DETECTED",
        "caseStatus": "—",
        "isLatest": False,
        "timestamp": "4 hr ago"
    },
    {
        "id": "R043",
        "reportType": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "lifeSavingRule": "—",
        "description": "Breaker handle was stiff and did not lock completely into off position.",
        "risk": 57,
        "sifPotential": "Non-SIF",
        "patternStatus": "RISING",
        "caseStatus": "—",
        "isLatest": False,
        "timestamp": "1 day ago"
    },
    {
        "id": "R017",
        "reportType": "Unsafe Condition",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "lifeSavingRule": "—",
        "description": "LOTO station missing standard lockout hasps for multi-worker isolation.",
        "risk": 39,
        "sifPotential": "Non-SIF",
        "patternStatus": "RELATED",
        "caseStatus": "—",
        "isLatest": False,
        "timestamp": "3 days ago"
    },
    {
        "id": "R001",
        "reportType": "Near Miss",
        "location": "Process Area A",
        "equipment": "Pump P-101",
        "hazard": "Energy Isolation",
        "lifeSavingRule": "—",
        "description": "Initial unsafe condition identified during shift turnover walk-through.",
        "risk": 22,
        "sifPotential": "Non-SIF",
        "patternStatus": "MONITORING",
        "caseStatus": "—",
        "isLatest": False,
        "timestamp": "5 days ago"
    }
]

INITIAL_CASES = [
    {
        "id": "SIF-0241",
        "type": "Near Miss",
        "hazard": "Energy Isolation",
        "location": "Process Area A",
        "risk": 91,
        "sifPotential": "Y",
        "assignedTo": "J. Thompson",
        "status": "ACTION IN PROGRESS",
        "riskOrigin": "Recurring Pattern Escalation",
        "relatedReports": ["R001", "R017", "R043", "R081", "R104"],
        "riskTrajectory": "22 → 39 → 57 → 76 → 91",
        "whyEscalated": [
            "Repeated energy isolation observations",
            "Same process area",
            "Same equipment",
            "Increasing risk trajectory",
            "Related Life-Saving Rule concern"
        ],
        "correctiveAction": {
            "text": "Immediate Action: Stop affected maintenance activity and verify energy isolation before work resumes.",
            "assignedTo": "R. Sharma",
            "priority": "Critical",
            "due": "TODAY, 14:30"
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
            { "time": "12:42", "text": "Potential SIF precursor detected" },
            { "time": "12:43", "text": "Recurring pattern escalation generated" },
            { "time": "12:47", "text": "Case assigned to R. Sharma" },
            { "time": "13:05", "text": "Corrective action started" }
        ]
    },
    {
        "id": "SIF-0240",
        "type": "Unsafe Condition",
        "hazard": "Confined Space",
        "location": "Tank Farm",
        "risk": 78,
        "sifPotential": "Y",
        "assignedTo": "R. Miller",
        "status": "ASSIGNED",
        "riskOrigin": "Atmospheric Sensor Anomaly",
        "relatedReports": ["R022", "R055", "R094"],
        "riskTrajectory": "30 → 55 → 78",
        "whyEscalated": [
            "Continuous 4-gas monitor low O2 alarm",
            "Compromised ventilation ducting",
            "Entry permit pre-signed"
        ],
        "correctiveAction": {
            "text": "Lockout access manway and re-route positive ventilation air ducts.",
            "assignedTo": "R. Miller",
            "priority": "High",
            "due": "TODAY, 16:00"
        },
        "lifecycle": [
            { "name": "DETECTED", "completed": True, "active": False },
            { "name": "ALERTED", "completed": True, "active": False },
            { "name": "ASSIGNED", "completed": False, "active": True },
            { "name": "ACTION IN PROGRESS", "completed": False, "active": False },
            { "name": "EVIDENCE SUBMITTED", "completed": False, "active": False },
            { "name": "VERIFIED", "completed": False, "active": False },
            { "name": "CLOSED", "completed": False, "active": False }
        ],
        "evidence": "Pending",
        "verification": "Pending Evidence",
        "auditTrail": [
            { "time": "11:15", "text": "Precursor event detected" },
            { "time": "11:20", "text": "Assigned to R. Miller" }
        ]
    },
    {
        "id": "SIF-0239",
        "type": "Unsafe Act",
        "hazard": "Working at Height",
        "location": "Maintenance Zone",
        "risk": 72,
        "sifPotential": "Y",
        "assignedTo": "S. Garcia",
        "status": "ALERTED",
        "riskOrigin": "100% Tie-Off Rule Non-Compliance",
        "relatedReports": ["R011", "R038", "R089"],
        "riskTrajectory": "25 → 48 → 72",
        "whyEscalated": [
            "Unclipped lanyard during 7.5m pipe rack traverse",
            "Static lifeline discontinuous"
        ],
        "correctiveAction": {
            "text": "Install static horizontal lifeline cable along PR-2.",
            "assignedTo": "S. Garcia",
            "priority": "High",
            "due": "TOMORROW, 10:00"
        },
        "lifecycle": [
            { "name": "DETECTED", "completed": True, "active": False },
            { "name": "ALERTED", "completed": False, "active": True },
            { "name": "ASSIGNED", "completed": False, "active": False },
            { "name": "ACTION IN PROGRESS", "completed": False, "active": False },
            { "name": "EVIDENCE SUBMITTED", "completed": False, "active": False },
            { "name": "VERIFIED", "completed": False, "active": False },
            { "name": "CLOSED", "completed": False, "active": False }
        ],
        "evidence": "Pending",
        "verification": "Pending Evidence",
        "auditTrail": [
            { "time": "10:30", "text": "Height precursor observation submitted" }
        ]
    },
    {
        "id": "SIF-0238",
        "type": "Near Miss",
        "hazard": "PPE",
        "location": "Utilities",
        "risk": 24,
        "sifPotential": "N",
        "assignedTo": "T. Lee",
        "status": "CLOSED",
        "riskOrigin": "Routine Housekeeping",
        "relatedReports": ["R005"],
        "riskTrajectory": "24",
        "whyEscalated": ["Standard low-energy particle deflection."],
        "correctiveAction": {
            "text": "Replaced spark face shield at bay 3.",
            "assignedTo": "T. Lee",
            "priority": "Low",
            "due": "COMPLETED"
        },
        "lifecycle": [
            { "name": "DETECTED", "completed": True, "active": False },
            { "name": "ALERTED", "completed": True, "active": False },
            { "name": "ASSIGNED", "completed": True, "active": False },
            { "name": "ACTION IN PROGRESS", "completed": True, "active": False },
            { "name": "EVIDENCE SUBMITTED", "completed": True, "active": False },
            { "name": "VERIFIED", "completed": True, "active": False },
            { "name": "CLOSED", "completed": True, "active": False }
        ],
        "evidence": "Verified",
        "verification": "Supervisor Signoff",
        "auditTrail": [
            { "time": "09:00", "text": "Observation logged" },
            { "time": "09:30", "text": "Resolved and closed" }
        ]
    }
]

INITIAL_PATTERNS = [
    {
        "id": "PAT-001",
        "hazard": "ENERGY ISOLATION",
        "location": "Process Area A • Pump P-101",
        "equipment": "Pump P-101",
        "currentRiskScore": 91,
        "maxScore": 100,
        "statusBadges": ["CRITICAL", "ESCALATED"],
        "logicBanner": "Non-SIF reports remain in the intelligence pipeline. Recurring related observations + increasing risk trajectory = emerging Potential SIF risk.",
        "trajectoryPoints": [
            { "id": "R001", "risk": 22, "band": "NON-SIF" },
            { "id": "R017", "risk": 39, "band": "NON-SIF" },
            { "id": "R043", "risk": 57, "band": "NON-SIF" },
            { "id": "R081", "risk": 76, "band": "RISING RISK" },
            { "id": "R104", "risk": 91, "band": "POTENTIAL SIF" }
        ],
        "checklist": [
            { "text": "Same location (Process Area A)", "checked": True },
            { "text": "Same equipment (Pump P-101)", "checked": True },
            { "text": "Same hazard", "checked": True },
            { "text": "Related safety observations", "checked": True },
            { "text": "Increasing frequency", "checked": True },
            { "text": "Increasing risk scores", "checked": True, "isTrend": True }
        ],
        "timeline": [
            { "id": "R001", "risk": 22, "badge": "INITIAL", "title": "Initial unsafe condition identified", "isLatest": False },
            { "id": "R017", "risk": 39, "badge": "RELATED", "title": "Related observation reported", "isLatest": False },
            { "id": "R043", "risk": 57, "badge": "RISING", "title": "Risk escalating due to proximity", "isLatest": False },
            { "id": "R081", "risk": 76, "badge": "PATTERN DETECTED", "title": "Recurring hazard pattern confirmed", "isLatest": False },
            { "id": "R104", "risk": 91, "badge": "ESCALATED", "title": "Critical threshold reached - Potential SIF designated", "isLatest": True }
        ],
        "relatedReports": [
            { "id": "R081", "risk": 76 },
            { "id": "R043", "risk": 57 },
            { "id": "R017", "risk": 39 }
        ]
    }
]

# Initialize In-Memory Stores
def init_db():
    for r in INITIAL_REPORTS:
        IN_MEMORY_DB["reports"][r["id"]] = r
    for c in INITIAL_CASES:
        IN_MEMORY_DB["cases"][c["id"]] = c
    for p in INITIAL_PATTERNS:
        IN_MEMORY_DB["patterns"][p["id"]] = p

init_db()

# MongoDB Client Integration (with graceful fallback)
mongo_client = None
mongo_db = None

try:
    from pymongo import MongoClient
    mongo_client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1000)
    mongo_client.server_info()
    mongo_db = mongo_client[settings.DATABASE_NAME]
    logger.info("Successfully connected to MongoDB.")
except Exception as e:
    logger.warning(f"MongoDB not available ({e}). Using in-memory database store.")
    mongo_db = None

def get_database():
    return mongo_db
