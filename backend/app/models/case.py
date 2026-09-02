from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CorrectiveActionModel(BaseModel):
    text: str
    assignedTo: str
    priority: str
    due: str

class LifecycleStep(BaseModel):
    name: str
    completed: bool
    active: bool

class AuditTrailItem(BaseModel):
    time: str
    text: str

class CaseCreate(BaseModel):
    type: str
    hazard: str
    location: str
    risk: int
    sifPotential: str = "Y"
    assignedTo: str
    status: str = "ACTION IN PROGRESS"
    description: Optional[str] = ""

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assignedTo: Optional[str] = None
    correctiveAction: Optional[CorrectiveActionModel] = None
    evidence: Optional[str] = None
    verification: Optional[str] = None

class CaseResponse(BaseModel):
    id: str
    type: str
    hazard: str
    location: str
    risk: int
    sifPotential: str
    assignedTo: str
    status: str
    riskOrigin: Optional[str] = "Observation Intake"
    relatedReports: Optional[List[str]] = []
    riskTrajectory: Optional[str] = ""
    whyEscalated: Optional[List[str]] = []
    correctiveAction: Optional[CorrectiveActionModel] = None
    lifecycle: Optional[List[LifecycleStep]] = []
    evidence: Optional[str] = "Pending"
    verification: Optional[str] = "Pending Evidence"
    auditTrail: Optional[List[AuditTrailItem]] = []
