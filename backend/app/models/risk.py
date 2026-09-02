from pydantic import BaseModel
from typing import List, Optional

class TrajectoryPoint(BaseModel):
    id: str
    risk: int
    band: str

class ChecklistItem(BaseModel):
    text: str
    checked: bool
    isTrend: Optional[bool] = False

class TimelineItem(BaseModel):
    id: str
    risk: int
    badge: str
    title: str
    isLatest: bool

class RelatedReportItem(BaseModel):
    id: str
    risk: int

class PatternResponse(BaseModel):
    id: str
    hazard: str
    location: str
    equipment: str
    currentRiskScore: int
    maxScore: int = 100
    statusBadges: List[str]
    logicBanner: str
    trajectoryPoints: List[TrajectoryPoint]
    checklist: List[ChecklistItem]
    timeline: List[TimelineItem]
    relatedReports: List[RelatedReportItem]
