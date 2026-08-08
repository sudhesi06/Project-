from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=True)
    difficulty = Column(String(20), nullable=False, default="Medium")  # Easy, Medium, Hard
    exam_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    color = Column(String(30), nullable=False, default="#4F46E5")
    progress_pct = Column(Float, default=0.0)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    sessions = relationship("StudySession", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    estimated_hours = Column(Float, default=1.5)
    order = Column(Integer, default=1)

    subject = relationship("Subject", back_populates="topics")
    sessions = relationship("StudySession", back_populates="topic")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(20), nullable=False)  # e.g., "09:00 AM"
    duration_minutes = Column(Integer, default=60)
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    session_type = Column(String(30), default="Learning")  # Learning, Revision, Practice
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    subject = relationship("Subject", back_populates="sessions")
    topic = relationship("Topic", back_populates="sessions")


class PlannerSetting(Base):
    __tablename__ = "planner_settings"

    id = Column(Integer, primary_key=True, index=True)
    daily_study_hours = Column(Float, default=4.0)
    preferred_session_length = Column(Integer, default=60)
    rest_break_minutes = Column(Integer, default=15)
    start_hour = Column(Integer, default=9)
