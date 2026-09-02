from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal, Any, Dict

class ReportAnalysisRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    report_type: Optional[str] = Field(default="Near Miss", validation_alias="reportType")
    location: str = Field(default="Process Area A")
    equipment: str = Field(default="Pump P-101")
    hazard: str = Field(default="Energy Isolation")
    life_saving_rule: Optional[str] = Field(default=None, validation_alias="lifeSavingRule")
    description: str

class ReportAnalysisResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    potential_sif: str
    potentialSif: str
    risk_score: int
    riskScore: int
    risk_level: str
    riskLevel: str
    identified_hazards: List[str]
    identifiedHazard: str
    identified_life_saving_rules: List[str]
    lifeSavingRulesIdentified: List[str]
    reasons: str
    whyFlagged: str
    pattern_status: str
    patternStatus: str
    pattern_message: str
    patternMessage: str
    escalation_triggered: bool
    escalationTriggered: bool
    pattern_tags: List[str]
    patternTags: List[str]
    related_reports: List[str]
    relatedReports: List[str]

class ReportCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    reportType: str = Field(..., example="Near Miss", validation_alias="report_type")
    location: str = Field(..., example="Process Area A")
    equipment: str = Field(..., example="Pump P-102A")
    hazard: str = Field(..., example="Electrical Energy")
    lifeSavingRule: Optional[str] = Field("Energy Isolation", example="Energy Isolation", validation_alias="life_saving_rule")
    description: str = Field(..., example="During maintenance activity, the equipment was isolated but the isolation point was not verified before work started.")

class ReportResponse(BaseModel):
    id: str
    reportType: str
    location: str
    equipment: str
    hazard: str
    lifeSavingRule: Optional[str] = "—"
    description: Optional[str] = ""
    risk: int
    sifPotential: str
    patternStatus: str
    caseStatus: Optional[str] = "—"
    isLatest: Optional[bool] = False
    timestamp: Optional[str] = "Just now"
