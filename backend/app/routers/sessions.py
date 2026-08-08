from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from ..database import get_db
from ..models import StudySession, Subject, Topic
from ..schemas import (
    StudySessionCreate, StudySessionUpdate, StudySessionResponse
)

router = APIRouter(prefix="/api/sessions", tags=["Study Sessions"])

def format_session_response(session: StudySession) -> StudySessionResponse:
    return StudySessionResponse(
        id=session.id,
        subject_id=session.subject_id,
        topic_id=session.topic_id,
        date=session.date,
        start_time=session.start_time,
        duration_minutes=session.duration_minutes,
        priority=session.priority,
        session_type=session.session_type,
        is_completed=session.is_completed,
        notes=session.notes,
        subject_name=session.subject.name if session.subject else None,
        subject_color=session.subject.color if session.subject else None,
        topic_title=session.topic.title if session.topic else "General Review"
    )

@router.get("", response_model=List[StudySessionResponse])
def get_study_sessions(
    target_date: Optional[str] = Query(None, alias="date"),
    today_only: bool = False,
    subject_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StudySession)

    if today_only:
        today_str = date.today().strftime("%Y-%m-%d")
        query = query.filter(StudySession.date == today_str)
    elif target_date:
        query = query.filter(StudySession.date == target_date)

    if subject_id:
        query = query.filter(StudySession.subject_id == subject_id)

    sessions = query.order_by(StudySession.date.asc(), StudySession.start_time.asc()).all()
    return [format_session_response(s) for s in sessions]

@router.post("", response_model=StudySessionResponse, status_code=status.HTTP_201_CREATED)
def create_study_session(payload: StudySessionCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == payload.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    new_session = StudySession(
        subject_id=payload.subject_id,
        topic_id=payload.topic_id,
        date=payload.date,
        start_time=payload.start_time,
        duration_minutes=payload.duration_minutes,
        priority=payload.priority,
        session_type=payload.session_type,
        is_completed=payload.is_completed,
        notes=payload.notes
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return format_session_response(new_session)

@router.put("/{session_id}", response_model=StudySessionResponse)
def update_study_session(session_id: int, payload: StudySessionUpdate, db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")

    if payload.is_completed is not None:
        session.is_completed = payload.is_completed
        # If completing session linked to a topic, mark topic completed as well!
        if payload.is_completed and session.topic_id:
            topic = db.query(Topic).filter(Topic.id == session.topic_id).first()
            if topic and not topic.is_completed:
                topic.is_completed = True
                db.commit()

    if payload.notes is not None:
        session.notes = payload.notes
    if payload.start_time is not None:
        session.start_time = payload.start_time
    if payload.date is not None:
        session.date = payload.date

    db.commit()
    db.refresh(session)

    # Recalculate parent subject progress
    if session.subject:
        total_t = len(session.subject.topics)
        if total_t > 0:
            comp_t = sum(1 for t in session.subject.topics if t.is_completed)
            session.subject.progress_pct = round((comp_t / total_t) * 100.0, 1)
            db.commit()

    return format_session_response(session)

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")

    db.delete(session)
    db.commit()
    return None
