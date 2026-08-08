from pydantic import BaseModel, Field
from typing import List, Optional

# --- Topic Schemas ---
class TopicBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    estimated_hours: Optional[float] = 1.5
    is_completed: Optional[bool] = False
    order: Optional[int] = 1

class TopicCreate(TopicBase):
    pass

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    estimated_hours: Optional[float] = None
    is_completed: Optional[bool] = None
    order: Optional[int] = None

class TopicResponse(TopicBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True

# --- Subject Schemas ---
class SubjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    code: Optional[str] = ""
    difficulty: str = Field(..., description="Easy, Medium, or Hard")
    exam_date: str = Field(..., description="Format: YYYY-MM-DD")
    color: Optional[str] = "#4F46E5"

class SubjectCreate(SubjectBase):
    topics: Optional[List[TopicCreate]] = []

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    difficulty: Optional[str] = None
    exam_date: Optional[str] = None
    color: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: int
    progress_pct: float
    topics: List[TopicResponse] = []

    class Config:
        from_attributes = True

# --- Study Session Schemas ---
class StudySessionBase(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    date: str
    start_time: str
    duration_minutes: int = 60
    priority: str = "Medium"
    session_type: str = "Learning"
    is_completed: bool = False
    notes: Optional[str] = ""

class StudySessionCreate(StudySessionBase):
    pass

class StudySessionUpdate(BaseModel):
    is_completed: Optional[bool] = None
    notes: Optional[str] = None
    start_time: Optional[str] = None
    date: Optional[str] = None

class StudySessionResponse(StudySessionBase):
    id: int
    subject_name: Optional[str] = None
    subject_color: Optional[str] = None
    topic_title: Optional[str] = None

    class Config:
        from_attributes = True

# --- Planner Settings Schemas ---
class PlannerSettingBase(BaseModel):
    daily_study_hours: float = Field(default=4.0, ge=0.5, le=16.0)
    preferred_session_length: int = Field(default=60, ge=15, le=180)
    rest_break_minutes: int = Field(default=15, ge=5, le=60)
    start_hour: int = Field(default=9, ge=5, le=22)

class PlannerSettingUpdate(PlannerSettingBase):
    pass

class PlannerSettingResponse(PlannerSettingBase):
    id: int

    class Config:
        from_attributes = True

# --- Generate Schedule Request ---
class GenerateScheduleRequest(BaseModel):
    daily_hours: float = Field(default=4.0, ge=0.5, le=16.0)
    session_length_mins: int = Field(default=60, ge=15, le=180)
    days_ahead: int = Field(default=7, ge=1, le=30)
    prioritize_hard_subjects: bool = True

# --- AI Recommendation Schemas ---
class FocusSubjectAdvice(BaseModel):
    subject_id: int
    subject_name: str
    urgency_level: str  # Critical, High, Moderate, Low
    reason: str
    recommended_topic: Optional[str] = None
    suggested_action: str

class RevisionSuggestion(BaseModel):
    subject_name: str
    topic_title: str
    last_studied_days_ago: int
    recommendation_type: str  # Spaced Repetition, Active Recall, Exam Crunch

class AIRecommendationResponse(BaseModel):
    focus_advice: List[FocusSubjectAdvice]
    revision_suggestions: List[RevisionSuggestion]
    overall_study_tip: str
    is_llm_connected: bool = False
    ai_provider: str = "Heuristic Engine (LLM Ready)"
