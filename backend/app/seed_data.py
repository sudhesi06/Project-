from datetime import date, timedelta
from sqlalchemy.orm import Session
from .models import Subject, Topic, StudySession, PlannerSetting

def seed_initial_data(db: Session):
    # Check if data already exists
    if db.query(Subject).first():
        return  # Data already seeded

    today = date.today()

    # Create Sample Subjects
    sub_net = Subject(
        name="Computer Networks",
        code="CS301",
        difficulty="Hard",
        exam_date=(today + timedelta(days=5)).strftime("%Y-%m-%d"),
        color="#6366F1",  # Indigo
        progress_pct=40.0
    )
    
    sub_dsa = Subject(
        name="Data Structures & Algorithms",
        code="CS201",
        difficulty="Hard",
        exam_date=(today + timedelta(days=12)).strftime("%Y-%m-%d"),
        color="#EC4899",  # Pink
        progress_pct=60.0
    )

    sub_db = Subject(
        name="Database Management Systems",
        code="CS302",
        difficulty="Medium",
        exam_date=(today + timedelta(days=18)).strftime("%Y-%m-%d"),
        color="#10B981",  # Emerald
        progress_pct=75.0
    )

    sub_ml = Subject(
        name="Machine Learning Fundamentals",
        code="CS405",
        difficulty="Medium",
        exam_date=(today + timedelta(days=25)).strftime("%Y-%m-%d"),
        color="#F59E0B",  # Amber
        progress_pct=25.0
    )

    db.add_all([sub_net, sub_dsa, sub_db, sub_ml])
    db.commit()

    # Refresh objects to get IDs
    db.refresh(sub_net)
    db.refresh(sub_dsa)
    db.refresh(sub_db)
    db.refresh(sub_ml)

    # Add Topics for Computer Networks
    topics_net = [
        Topic(subject_id=sub_net.id, title="OSI & TCP/IP Model Layers", is_completed=True, estimated_hours=2.0, order=1),
        Topic(subject_id=sub_net.id, title="IP Addressing & Subnetting", is_completed=True, estimated_hours=2.5, order=2),
        Topic(subject_id=sub_net.id, title="Routing Algorithms (OSPF, BGP)", is_completed=False, estimated_hours=3.0, order=3),
        Topic(subject_id=sub_net.id, title="Transport Layer (TCP, UDP Flow Control)", is_completed=False, estimated_hours=2.0, order=4),
        Topic(subject_id=sub_net.id, title="Application Protocols (HTTP/3, DNS)", is_completed=False, estimated_hours=1.5, order=5),
    ]

    # Add Topics for DSA
    topics_dsa = [
        Topic(subject_id=sub_dsa.id, title="Arrays & Linked Lists Optimization", is_completed=True, estimated_hours=2.0, order=1),
        Topic(subject_id=sub_dsa.id, title="Binary Trees & BST Traversal", is_completed=True, estimated_hours=2.5, order=2),
        Topic(subject_id=sub_dsa.id, title="Graph Algorithms (DFS, BFS, Dijkstra)", is_completed=True, estimated_hours=3.0, order=3),
        Topic(subject_id=sub_dsa.id, title="Dynamic Programming Core Patterns", is_completed=False, estimated_hours=4.0, order=4),
        Topic(subject_id=sub_dsa.id, title="Heap Data Structures & Priority Queues", is_completed=False, estimated_hours=2.0, order=5),
    ]

    # Add Topics for Database Systems
    topics_db = [
        Topic(subject_id=sub_db.id, title="ER Diagrams & Relational Schema", is_completed=True, estimated_hours=1.5, order=1),
        Topic(subject_id=sub_db.id, title="Advanced SQL Queries & Joins", is_completed=True, estimated_hours=2.5, order=2),
        Topic(subject_id=sub_db.id, title="Database Normalization (1NF to BCNF)", is_completed=True, estimated_hours=2.0, order=3),
        Topic(subject_id=sub_db.id, title="Transactions & ACID Properties", is_completed=False, estimated_hours=2.0, order=4),
    ]

    # Add Topics for Machine Learning
    topics_ml = [
        Topic(subject_id=sub_ml.id, title="Linear & Logistic Regression", is_completed=True, estimated_hours=2.0, order=1),
        Topic(subject_id=sub_ml.id, title="Decision Trees & Random Forests", is_completed=False, estimated_hours=2.5, order=2),
        Topic(subject_id=sub_ml.id, title="Gradient Descent & Neural Net Backprop", is_completed=False, estimated_hours=3.5, order=3),
        Topic(subject_id=sub_ml.id, title="Model Evaluation Metrics & Cross Validation", is_completed=False, estimated_hours=2.0, order=4),
    ]

    all_topics = topics_net + topics_dsa + topics_db + topics_ml
    db.add_all(all_topics)
    db.commit()

    # Add Initial Study Sessions for Today
    today_str = today.strftime("%Y-%m-%d")
    tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")

    session_1 = StudySession(
        subject_id=sub_net.id,
        topic_id=topics_net[2].id,
        date=today_str,
        start_time="09:00 AM",
        duration_minutes=90,
        priority="High",
        session_type="Learning",
        is_completed=False,
        notes="Focus on understanding link-state routing vs distance vector algorithms."
    )

    session_2 = StudySession(
        subject_id=sub_dsa.id,
        topic_id=topics_dsa[3].id,
        date=today_str,
        start_time="11:30 AM",
        duration_minutes=90,
        priority="High",
        session_type="Learning",
        is_completed=False,
        notes="Solve 3 Dynamic Programming problems on LeetCode."
    )

    session_3 = StudySession(
        subject_id=sub_db.id,
        topic_id=topics_db[3].id,
        date=today_str,
        start_time="02:30 PM",
        duration_minutes=60,
        priority="Medium",
        session_type="Revision",
        is_completed=True,
        notes="Reviewed isolation levels and concurrency anomalies."
    )

    session_4 = StudySession(
        subject_id=sub_ml.id,
        topic_id=topics_ml[1].id,
        date=tomorrow_str,
        start_time="10:00 AM",
        duration_minutes=90,
        priority="Medium",
        session_type="Learning",
        is_completed=False,
        notes="Understand Gini impurity vs Entropy formulas."
    )

    db.add_all([session_1, session_2, session_3, session_4])

    # Planner default setting
    setting = PlannerSetting(
        daily_study_hours=4.0,
        preferred_session_length=60,
        rest_break_minutes=15,
        start_hour=9
    )
    db.add(setting)

    db.commit()
    print("[SeedData] Database initialized with rich CS demo subjects, chapters, and sessions.")
