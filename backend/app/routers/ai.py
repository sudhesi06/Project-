from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subject, StudySession
from ..schemas import AIRecommendationResponse
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI Recommendations"])

@router.get("/recommendations", response_model=AIRecommendationResponse)
async def get_ai_recommendations(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    sessions = db.query(StudySession).all()
    
    recommendations = await ai_service.get_study_recommendations(subjects, sessions)
    return recommendations
