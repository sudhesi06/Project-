# 🎓 AI Study Planner

An intelligent, full-stack web application designed for students and college project teams to build personalized, prioritized study schedules. The application dynamically balances exam dates, subject difficulty ratings, and chapter completion rates, supported by a **Modular AI Recommendation Engine**.

---

## ✨ Core Features

1. **📊 Comprehensive Dashboard**
   - Interactive welcome hero with real-time study progress indicators.
   - **Today's Study Tasks**: One-click completion toggling with instant syllabus progress sync.
   - **Upcoming Exams Timeline**: Visual urgency countdown badges.
   - Quick stat widgets (Active Subjects, Syllabus Progress %, Tasks Done, Exam Deadlines).

2. **📚 Subject Management**
   - Add, edit, and delete course subjects.
   - Assign **Difficulty Level** (`Easy`, `Medium`, `Hard`) and target **Exam Dates**.
   - Interactive chapter/topic checklists with real-time syllabus completion % calculation.

3. **📅 Smart Study Planner**
   - Custom daily available study hours (1 to 12 hrs/day) and block lengths (45, 60, 90 mins).
   - **Prioritization Algorithm**: Automatically scores subjects based on:
     $$\text{Priority Score} = (\text{Exam Urgency} \times 1.5) + ((100 - \text{Progress}\%) \times 0.8) + (\text{Difficulty Weight} \times 10)$$
   - Generates daily and weekly study session blocks with priority color tags.

4. **🤖 Modular AI Advisor**
   - **What to Study Next**: Recommends high-impact chapters based on upcoming deadlines and progress gaps.
   - **Revision & Memory Retention**: Recommends spaced repetition review blocks.
   - **LLM Integration Ready**: Built with a clean interface layer (`backend/app/services/ai_service.py`) that uses a high-accuracy local heuristic engine by default and seamlessly connects to external LLM APIs (OpenAI, Gemini, Ollama) when an API key is provided.

5. **📈 Progress Tracking & Analytics**
   - Overall course completion analytics.
   - Comparative subject-by-subject progress bars.
   - Complete log of completed study sessions.

---

## 📁 Project Structure

```text
ai-study-planner/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application & startup triggers
│   │   ├── database.py          # SQLite engine & SQLAlchemy session
│   │   ├── models.py            # Database tables (Subject, Topic, StudySession, PlannerSetting)
│   │   ├── schemas.py           # Pydantic request/response validation
│   │   ├── seed_data.py         # Sample demo data seeder (CS courses, topics, sessions)
│   │   ├── routers/
│   │   │   ├── subjects.py      # CRUD REST endpoints for Subjects & Topics
│   │   │   ├── planner.py       # Schedule generation algorithm endpoint
│   │   │   ├── sessions.py      # Study session completion & log endpoints
│   │   │   └── ai.py            # AI Study Advisor endpoint
│   │   └── services/
│   │       └── ai_service.py    # Modular AI Service (Heuristic Engine + LLM Hooks)
│   ├── requirements.txt         # Python dependencies
│   └── ai_study_planner.db      # Persistent SQLite Database (auto-created)
│
└── frontend/
    ├── index.html               # Entry HTML with Google Fonts
    ├── package.json             # React 18, Vite, Lucide React dependencies
    ├── vite.config.js           # Vite dev server configuration with API proxy
    └── src/
        ├── App.jsx              # Core React App state management & tab navigation
        ├── index.css            # Glassmorphism & responsive CSS design system
        ├── services/
        │   └── api.js           # REST API client wrapper
        └── components/
            ├── Navbar.jsx       # Header bar with theme toggle & date display
            ├── Sidebar.jsx      # Navigation drawer component
            ├── Dashboard.jsx    # Dashboard cards, today tasks, and exam countdowns
            ├── Subjects.jsx     # Subject management & chapter checklist modal
            ├── Planner.jsx      # Available hours slider & smart schedule generator
            ├── AIAdvisor.jsx    # AI Recommendations & LLM status panel
            └── ProgressTracker.jsx # Subject progress bars & study log history
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and **npm** installed

---

### 1️⃣ Backend Setup (FastAPI + SQLite)

Open a terminal window and navigate to the `backend` folder:

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```

> 💡 **Note**: On startup, the backend automatically initializes `ai_study_planner.db` and populates sample computer science courses, topics, and study sessions so you can test the application immediately!
> 
> Backend API documentation is available at: **`http://127.0.0.1:8000/docs`**

---

### 2️⃣ Frontend Setup (React + Vite)

Open a second terminal window and navigate to the `frontend` folder:

```bash
cd frontend

# Install Node packages
npm install

# Start Vite development server
npm run dev
```

> 🌐 Open your browser at **`http://localhost:3000`** (or the port displayed by Vite).

---

## 🔌 Connecting a Live LLM API (Optional)

The AI Advisor uses a **Modular AI Service** (`backend/app/services/ai_service.py`). By default, it operates using an intelligent, rule-based heuristic engine.

To connect an OpenAI or Gemini LLM model, set the following environment variables before starting the backend:

```bash
# Windows PowerShell
$env:LLM_API_KEY="your-openai-or-gemini-api-key"
$env:LLM_MODEL="gpt-4o"  # Optional, default: gpt-3.5-turbo

# Linux / macOS
export LLM_API_KEY="your-openai-or-gemini-api-key"
export LLM_MODEL="gpt-4o"
```

---

## 🌐 REST API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/subjects` | Fetch all subjects with chapter lists and progress % |
| `POST` | `/api/subjects` | Create a new subject with optional topics |
| `PUT` | `/api/subjects/{id}` | Update subject details (exam date, difficulty) |
| `DELETE` | `/api/subjects/{id}` | Delete a subject and associated data |
| `POST` | `/api/subjects/{id}/topics` | Add a chapter/topic to a subject |
| `PUT` | `/api/subjects/topics/{id}`| Toggle topic completion / update details |
| `GET` | `/api/sessions` | Fetch study sessions (supports `?today_only=true`) |
| `PUT` | `/api/sessions/{id}` | Mark session completed or update notes |
| `POST` | `/api/planner/generate` | Run schedule prioritization algorithm |
| `GET` | `/api/ai/recommendations` | Get AI focus advice & revision suggestions |
