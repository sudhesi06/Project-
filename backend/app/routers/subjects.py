from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Subject, Topic
from ..schemas import (
    SubjectCreate, SubjectUpdate, SubjectResponse,
    TopicCreate, TopicUpdate, TopicResponse
)

router = APIRouter(prefix="/api/subjects", tags=["Subjects"])

def recalculate_subject_progress(subject: Subject, db: Session):
    total_topics = len(subject.topics)
    if total_topics == 0:
        subject.progress_pct = 0.0
    else:
        completed = sum(1 for t in subject.topics if t.is_completed)
        subject.progress_pct = round((completed / total_topics) * 100.0, 1)
    db.commit()
    db.refresh(subject)

@router.get("", response_model=List[SubjectResponse])
def get_all_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    for s in subjects:
        recalculate_subject_progress(s, db)
    return subjects

@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(payload: SubjectCreate, db: Session = Depends(get_db)):
    new_subject = Subject(
        name=payload.name,
        code=payload.code,
        difficulty=payload.difficulty,
        exam_date=payload.exam_date,
        color=payload.color or "#4F46E5",
        progress_pct=0.0
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    if payload.topics:
        for idx, t in enumerate(payload.topics):
            topic_obj = Topic(
                subject_id=new_subject.id,
                title=t.title,
                estimated_hours=t.estimated_hours or 1.5,
                is_completed=t.is_completed or False,
                order=idx + 1
            )
            db.add(topic_obj)
        db.commit()
        recalculate_subject_progress(new_subject, db)

    return new_subject

@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject_by_id(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    recalculate_subject_progress(subject, db)
    return subject

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id: int, payload: SubjectUpdate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    if payload.name is not None:
        subject.name = payload.name
    if payload.code is not None:
        subject.code = payload.code
    if payload.difficulty is not None:
        subject.difficulty = payload.difficulty
    if payload.exam_date is not None:
        subject.exam_date = payload.exam_date
    if payload.color is not None:
        subject.color = payload.color

    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return None

# --- Topic Sub-routes ---

@router.post("/{subject_id}/topics", response_model=TopicResponse)
def add_topic_to_subject(subject_id: int, payload: TopicCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    new_topic = Topic(
        subject_id=subject_id,
        title=payload.title,
        estimated_hours=payload.estimated_hours or 1.5,
        is_completed=payload.is_completed or False,
        order=len(subject.topics) + 1
    )
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    recalculate_subject_progress(subject, db)
    return new_topic

@router.put("/topics/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: int, payload: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    if payload.title is not None:
        topic.title = payload.title
    if payload.estimated_hours is not None:
        topic.estimated_hours = payload.estimated_hours
    if payload.is_completed is not None:
        topic.is_completed = payload.is_completed
    if payload.order is not None:
        topic.order = payload.order

    db.commit()
    db.refresh(topic)

    # Recalculate parent subject progress
    subject = db.query(Subject).filter(Subject.id == topic.subject_id).first()
    if subject:
        recalculate_subject_progress(subject, db)

    return topic

@router.delete("/topics/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    subject_id = topic.subject_id
    db.delete(topic)
    db.commit()

    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if subject:
        recalculate_subject_progress(subject, db)

    return None
