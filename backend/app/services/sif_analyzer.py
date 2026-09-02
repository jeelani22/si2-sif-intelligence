from typing import Dict, Any, List

def analyze_sif_precursor(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Rule-based Explainable NLP & Heuristic SIF Precursor Detection Engine.
    Maps energy sources, barrier integrity, and Life-Saving Rules.
    """
    hazard_input = report_data.get("hazard") or ""
    equipment_input = report_data.get("equipment") or ""
    location_input = report_data.get("location") or ""
    rule_input = report_data.get("life_saving_rule") or report_data.get("lifeSavingRule") or ""
    desc_input = report_data.get("description") or ""

    text = f"{desc_input} {hazard_input} {rule_input} {equipment_input} {location_input}".lower()

    risk_score = 25
    life_saving_rules = []
    why_flagged_reasons = []
    is_high_energy = False
    identified_hazards = [hazard_input] if hazard_input else ["Electrical Energy"]
    related_reports = []

    # 1. Energy Isolation (LOTO)
    if any(k in text for k in ["isolation", "isolated", "loto", "lockout", "breaker", "electrical", "480v", "voltage", "capacitor"]):
        risk_score += 45
        is_high_energy = True
        identified_hazards = ["Energy Isolation", "Electrical Energy"]
        life_saving_rules.append("Energy Isolation")
        if any(k in text for k in ["not verified", "omitted", "without", "failed", "forgot", "unverified"]):
            why_flagged_reasons.append("Analysis detected a failure in verification protocols for energy isolation, a high-frequency SIF precursor.")
        else:
            why_flagged_reasons.append("Energy isolation hazard identified in maintenance perimeter.")
        related_reports = ["R001", "R017", "R043", "R081", "R104"]

    # 2. Confined Space Entry
    elif any(k in text for k in ["confined", "tank", "manhole", "vessel", "h2s", "oxygen", "o2", "asphyxiation"]):
        risk_score += 42
        is_high_energy = True
        identified_hazards = ["Atmospheric Hazard", "Confined Space"]
        life_saving_rules.append("Confined Space Entry")
        if any(k in text for k in ["alarm", "low o2", "ventilation", "crimped", "untested"]):
            why_flagged_reasons.append("Atmospheric oxygen depletion and ventilation barrier degradation detected.")
        else:
            why_flagged_reasons.append("Confined space entry preparation identified.")
        related_reports = ["R022", "R055", "R094"]

    # 3. Working at Height
    elif any(k in text for k in ["height", "fall", "scaffold", "lanyard", "tie-off", "ladder", "elevated", "7.5m", "platform"]):
        risk_score += 40
        is_high_energy = True
        identified_hazards = ["Working at Height", "Gravity / Fall"]
        life_saving_rules.append("Working at Height")
        if any(k in text for k in ["unclipped", "disconnected", "missing", "without"]):
            why_flagged_reasons.append("Discontinuous 100% tie-off observed above 1.8m threshold.")
        else:
            why_flagged_reasons.append("Elevated platform work trajectory active.")
        related_reports = ["R011", "R038", "R089"]

    # 4. Heavy Lifting & Rigging
    elif any(k in text for k in ["crane", "sling", "rigging", "suspended", "load", "hoist"]):
        risk_score += 40
        is_high_energy = True
        identified_hazards = ["Suspended Load", "Mechanical Energy"]
        life_saving_rules.append("Suspended Load / Rigging Safety")
        if any(k in text for k in ["frayed", "walkway", "under load", "overdue"]):
            why_flagged_reasons.append("Suspended load line-of-fire corridor breach detected.")
        else:
            why_flagged_reasons.append("Heavy lifting operation recorded.")
        related_reports = ["R015", "R049"]

    # Default fallback
    if not life_saving_rules:
        life_saving_rules.append("General Safe Work Practice")
        why_flagged_reasons.append("Routine observation logged; no immediate critical barrier compromise.")
        related_reports = ["R005"]

    # Recurrence & Escalation check
    if any(k in text for k in ["recurring", "repeated", "again", "multiple", "previous", "similar observations", "area a", "zone"]):
        risk_score += 21
        escalation_triggered = True
    else:
        escalation_triggered = (risk_score >= 85)

    # Clamp score
    final_score = min(max(risk_score, 15), 98)
    potential_sif = "YES" if (is_high_energy and final_score >= 70) else "NO"
    risk_level = "HIGH" if final_score >= 70 else ("MEDIUM" if final_score >= 40 else "LOW")
    reasons_text = " ".join(why_flagged_reasons)
    pattern_status = "ESCALATED" if escalation_triggered else "STABLE"
    pattern_message = "Potential SIF risk increased due to recurring related observations." if escalation_triggered else "Observation recorded in baseline monitoring."

    pattern_tags = [
        "Same location",
        "Same hazard",
        "Repeated related observations",
        "Increasing risk trajectory"
    ] if escalation_triggered else ["Isolated observation", "Standard baseline monitoring"]

    return {
        "potential_sif": potential_sif,
        "potentialSif": potential_sif,
        "risk_score": final_score,
        "riskScore": final_score,
        "risk_level": risk_level,
        "riskLevel": risk_level,
        "identified_hazards": identified_hazards,
        "identifiedHazard": identified_hazards[0] if identified_hazards else "Energy Isolation",
        "identified_life_saving_rules": life_saving_rules,
        "lifeSavingRulesIdentified": life_saving_rules,
        "reasons": reasons_text,
        "whyFlagged": reasons_text,
        "pattern_status": pattern_status,
        "patternStatus": pattern_status,
        "pattern_message": pattern_message,
        "patternMessage": pattern_message,
        "escalation_triggered": escalation_triggered,
        "escalationTriggered": escalation_triggered,
        "pattern_tags": pattern_tags,
        "patternTags": pattern_tags,
        "related_reports": related_reports,
        "relatedReports": related_reports
    }
