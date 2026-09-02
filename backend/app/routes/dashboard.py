from fastapi import APIRouter
from app.database import IN_MEMORY_DB, get_database

router = APIRouter(tags=["Dashboard"])

@router.get("/health")
def get_health():
    db = get_database()
    return {
        "status": "online",
        "service": "SIF Intelligence API",
        "database": "mongodb" if db is not None else "in-memory-store",
        "version": "1.0.0"
    }

@router.get("/dashboard")
def get_dashboard_summary():
    metrics = IN_MEMORY_DB["metrics"]
    alerts = IN_MEMORY_DB["alerts"]
    recent_cases = list(IN_MEMORY_DB["cases"].values())[:4]

    return {
        "metrics": metrics,
        "emergingRiskSummary": {
            "recurringPatterns": 3,
            "risingRiskTrajectories": 5,
            "escalatedFromNonSif": 2
        },
        "riskOverviewDistribution": {
            "nonSif": 1161,
            "potentialSif": 86,
            "highRisk": 19,
            "risingRisk": 5
        },
        "alerts": alerts,
        "recentCases": recent_cases
    }
