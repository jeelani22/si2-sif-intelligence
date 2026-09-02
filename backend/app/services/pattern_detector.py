import pandas as pd
from typing import List, Dict, Any

def detect_recurring_patterns(reports: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Groups reports by (location, hazard) or equipment to detect emerging risk clusters.
    Uses Pandas for dataframe aggregation with clean Python native types.
    """
    if not reports:
        return []

    df = pd.DataFrame(reports)
    patterns = []

    # Check grouping by location and hazard
    if "location" in df.columns and "hazard" in df.columns:
        grouped = df.groupby(["location", "hazard"])
        for (loc, haz), group in grouped:
            count = int(len(group))
            avg_risk = float(group["risk"].mean()) if "risk" in group.columns else 50.0
            if count >= 2 or avg_risk >= 70.0:
                patterns.append({
                    "location": str(loc),
                    "hazard": str(haz),
                    "reportCount": count,
                    "averageRisk": float(round(avg_risk, 1)),
                    "isEscalated": bool(avg_risk >= 75.0)
                })

    return patterns

def calculate_trajectory(report_scores: List[int]) -> str:
    """Returns formatted trajectory string e.g. '22 → 39 → 57 → 76 → 91'"""
    return " → ".join(str(s) for s in report_scores)
