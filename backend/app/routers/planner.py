from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import List
from ..database import get_db
from ..models import Subject, Topic, StudySession, PlannerSetting
from ..schemas import (
    GenerateScheduleRequest, StudySessionResponse,
    PlannerSettingResponse, PlannerSettingUpdate
)

router = APIRouter(prefix="/api/planner", tags=["Planner"])

@router.get("/settings", response_model=PlannerSettingResponse)
def get_planner_settings(db: Session = Depends(get_db)):
    setting = db.query(PlannerSetting).first()
    if not setting:
        setting = PlannerSetting(daily_study_hours=4.0, preferred_session_length=60, rest_break_minutes=15, start_hour=9)
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.put("/settings", response_model=PlannerSettingResponse)
def update_planner_settings(payload: PlannerSettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(PlannerSetting).first()
    if not setting:
        setting = PlannerSetting()
        db.add(setting)

    setting.daily_study_hours = payload.daily_study_hours
    setting.preferred_session_length = payload.preferred_session_length
    setting.rest_break_minutes = payload.rest_break_minutes
    setting.start_hour = payload.start_hour

    db.commit()
    db.refresh(setting)
    return setting

@router.post("/generate", response_model=List[StudySessionResponse])
def generate_study_schedule(payload: GenerateScheduleRequest, db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    if not subjects:
        raise HTTPException(status_code=400, detail="No subjects found. Please add subjects first before generating a schedule.")

    today = date.today()
    days_to_plan = payload.days_ahead
    daily_mins = int(payload.daily_hours * 60)
    session_mins = payload.session_length_mins
    sessions_per_day = max(1, daily_mins // session_mins)

    # Calculate Priority Weight for each subject
    # Weight = (Difficulty Factor * 20) + (100 - Progress%) + (1.5 * (30 - Days to Exam))
    difficulty_map = {"Hard": 2.0, "Medium": 1.4, "Easy": 1.0}

    subject_scores = []
    for sub in subjects:
        try:
            exam_dt = datetime.strptime(sub.exam_date, "%Y-%m-%d").date()
            days_until_exam = (exam_dt - today).days
        except Exception:
            days_until_exam = 30

        urgency_pts = max(1, 40 - days_until_exam)
        diff_pts = difficulty_map.get(sub.difficulty, 1.4) * 15
        progress_pts = (100.0 - (sub.progress_pct or 0.0)) * 0.5

        total_score = urgency_pts + diff_pts + progress_pts

        subject_scores.append({
            "subject": sub,
            "score": total_score,
            "days_until_exam": days_until_exam,
            "uncompleted_topics": [t for t in sub.topics if not t.is_completed]
        })

    # Sort subjects by priority score descending
    subject_scores.sort(key=lambda x: x["score"], reverse=True)

    generated_sessions = []
    start_date = today

    # Clear existing uncompleted sessions in the plan range to regenerate cleanly
    end_date_str = (start_date + timedelta(days=days_to_plan)).strftime("%Y-%m-%d")
    start_date_str = start_date.strftime("%Y-%m-%d")
    db.query(StudySession).filter(
        StudySession.date >= start_date_str,
        StudySession.date <= end_date_str,
        StudySession.is_completed == False
    ).delete(synchronize_session=False)
    db.commit()

    # Time slot helpers
    base_start_hour = 9  # 9 AM default

    for day_offset in range(days_to_plan):
        current_day = start_date + timedelta(days=day_offset)
        day_str = current_day.strftime("%Y-%m-%d")

        # Pick top prioritized subjects for this day round-robin style
        for slot in range(sessions_per_day):
            target_item = subject_scores[slot % len(subject_scores)]
            sub = target_item["subject"]

            # Topic pick
            topic_obj = None
            if target_item["uncompleted_topics"]:
                topic_obj = target_item["uncompleted_topics"].pop(0)

            # Format start time string
            slot_hour = base_start_hour + (slot * 2)
            if slot_hour > 20:
                slot_hour = 20
            period = "AM" if slot_hour < 12 else "PM"
            display_hour = slot_hour if slot_hour <= 12 else slot_hour - 12
            start_time_str = f"{display_hour:02d}:00 {period}"

            priority_label = "High" if target_item["score"] > 50 else ("Medium" if target_item["score"] > 30 else "Low")
            session_type = "Exam Crunch" if target_item["days_until_exam"] <= 5 else ("Learning" if topic_obj else "Revision")

            new_session = StudySession(
                subject_id=sub.id,
                topic_id=topic_obj.id if topic_obj else None,
                date=day_str,
                start_time=start_time_str,
                duration_minutes=session_mins,
                priority=priority_label,
                session_type=session_type,
                is_completed=False,
                notes=f"Prioritized focus session for {sub.name}."
            )
            db.add(new_session)
            db.commit()
            db.refresh(new_session)

            # Build response item
            resp = StudySessionResponse(
                id=new_session.id,
                subject_id=sub.id,
                topic_id=topic_obj.id if topic_obj else None,
                date=new_session.date,
                start_time=new_session.start_time,
                duration_minutes=new_session.duration_minutes,
                priority=new_session.priority,
                session_type=new_session.session_type,
                is_completed=new_session.is_completed,
                notes=new_session.notes,
                subject_name=sub.name,
                subject_color=sub.color,
                topic_title=topic_obj.title if topic_obj else "Comprehensive Subject Review"
            )
            generated_sessions.append(resp)

    return generated_sessions
