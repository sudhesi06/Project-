from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_initial_data
from .routers import subjects, planner, sessions, ai

# Initialize SQLite Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Study Planner API",
    description="Backend API for AI-assisted study planning, schedule prioritization, and progress tracking.",
    version="1.0.0"
)

# Enable CORS for Frontend React Vite app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Populate seed data if database is empty
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()

# Include Routers
app.include_router(subjects.router)
app.include_router(planner.router)
app.include_router(sessions.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "AI Study Planner API",
        "docs_url": "/docs"
    }
