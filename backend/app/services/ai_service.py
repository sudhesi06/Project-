import os
import json
from datetime import datetime, date
from typing import List, Dict, Any
import httpx
from ..schemas import FocusSubjectAdvice, RevisionSuggestion, AIRecommendationResponse

class AIService:
    """
    Modular AI Service.
    Contains:
    1. Heuristic Recommendation Engine based on exam proximity, difficulty weight, and progress gap.
    2. Modular LLM Client interface ready for OpenAI / Gemini / Ollama integration via environment variables.
    """
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
        self.api_url = os.getenv("LLM_API_URL", "https://api.openai.com/v1/chat/completions")

    async def get_study_recommendations(
        self,
        subjects: List[Any],
        sessions: List[Any]
    ) -> AIRecommendationResponse:
        """
        Generate recommendations using LLM API if key is configured,
        otherwise fall back to high-accuracy local heuristic engine.
        """
        if self.api_key:
            try:
                return await self._call_llm_api(subjects, sessions)
            except Exception as e:
                # Log error and gracefully fall back to heuristic recommendations
                print(f"[AIService] LLM API Call failed ({e}). Falling back to local heuristic engine.")

        return self._generate_heuristic_recommendations(subjects, sessions)

    def _generate_heuristic_recommendations(
        self,
        subjects: List[Any],
        sessions: List[Any]
    ) -> AIRecommendationResponse:
        today = date.today()
        focus_list: List[FocusSubjectAdvice] = []
        revision_list: List[RevisionSuggestion] = []

        if not subjects:
            return AIRecommendationResponse(
                focus_advice=[],
                revision_suggestions=[],
                overall_study_tip="Add subjects and exam dates to receive personalized AI study recommendations.",
                is_llm_connected=False,
                ai_provider="Local Heuristic Engine (LLM Ready)"
            )

        scored_subjects = []

        for sub in subjects:
            # Parse exam date
            try:
                exam_dt = datetime.strptime(sub.exam_date, "%Y-%m-%d").date()
                days_left = (exam_dt - today).days
            except Exception:
                days_left = 30

            # Difficulty weights
            diff_weights = {"Hard": 2.0, "Medium": 1.4, "Easy": 1.0}
            weight = diff_weights.get(sub.difficulty, 1.4)

            # Incomplete percentage
            incomplete_pct = max(0.0, 100.0 - (sub.progress_pct or 0.0))

            # Priority Score calculation
            # Closer exam dates + lower progress + higher difficulty = higher priority score
            urgency_factor = max(1, 40 - days_left) if days_left > 0 else 50
            priority_score = (urgency_factor * 1.5) + (incomplete_pct * 0.8) + (weight * 10)

            # Find uncompleted topic
            uncompleted_topics = [t for t in sub.topics if not t.is_completed]
            next_topic = uncompleted_topics[0].title if uncompleted_topics else "Review and practice problem sets"

            completed_topics = [t for t in sub.topics if t.is_completed]

            scored_subjects.append({
                "subject": sub,
                "days_left": days_left,
                "priority_score": priority_score,
                "next_topic": next_topic,
                "completed_topics": completed_topics,
                "uncompleted_topics": uncompleted_topics
            })

        # Sort by priority score descending
        scored_subjects.sort(key=lambda x: x["priority_score"], reverse=True)

        # Generate focus advice for top subjects
        for item in scored_subjects[:3]:
            sub = item["subject"]
            days_left = item["days_left"]
            
            if days_left <= 3:
                urgency = "Critical"
                action = f"Focus exclusively on final exam prep and weak spots for {sub.name}."
                reason = f"Exam is in {days_left} day(s)! Current progress is {int(sub.progress_pct)}%."
            elif days_left <= 10:
                urgency = "High"
                action = f"Allocate 2+ hours daily to complete upcoming chapters."
                reason = f"Exam is approaching in {days_left} days. Subject difficulty: {sub.difficulty}."
            elif sub.progress_pct < 40:
                urgency = "Moderate"
                action = f"Start early to avoid crunching later."
                reason = f"Progress is below 40% ({int(sub.progress_pct)}%). Exam in {days_left} days."
            else:
                urgency = "Low"
                action = "Maintain regular study pace and weekly reviews."
                reason = f"Steady progress at {int(sub.progress_pct)}%. Exam in {days_left} days."

            focus_list.append(FocusSubjectAdvice(
                subject_id=sub.id,
                subject_name=sub.name,
                urgency_level=urgency,
                reason=reason,
                recommended_topic=item["next_topic"],
                suggested_action=action
            ))

        # Generate revision suggestions
        for item in scored_subjects:
            sub = item["subject"]
            for top in item["completed_topics"][:2]:
                revision_list.append(RevisionSuggestion(
                    subject_name=sub.name,
                    topic_title=top.title,
                    last_studied_days_ago=4,  # Heuristic estimation
                    recommendation_type="Active Recall & Flashcards" if sub.difficulty == "Hard" else "Spaced Repetition Review"
                ))

        # Overall study tip synthesizer
        top_sub = scored_subjects[0]["subject"]
        overall_tip = (
            f"🎯 Immediate Priority: Focus on {top_sub.name} today. "
            f"Prioritize difficult topics first when your energy level is highest. "
            f"Use 45-minute focus blocks with 15-minute rest breaks."
        )

        return AIRecommendationResponse(
            focus_advice=focus_list,
            revision_suggestions=revision_list[:4],
            overall_study_tip=overall_tip,
            is_llm_connected=False,
            ai_provider="Local Smart Heuristic Engine (LLM Ready)"
        )

    async def _call_llm_api(self, subjects: List[Any], sessions: List[Any]) -> AIRecommendationResponse:
        """
        Integration hook for actual LLM API (e.g. OpenAI / Gemini / Ollama).
        Constructs context prompt and requests JSON structured output.
        """
        context_payload = {
            "subjects": [
                {
                    "id": s.id,
                    "name": s.name,
                    "difficulty": s.difficulty,
                    "exam_date": s.exam_date,
                    "progress_pct": s.progress_pct,
                    "topics": [{"title": t.title, "completed": t.is_completed} for t in s.topics]
                }
                for s in subjects
            ]
        }

        prompt = (
            "You are an expert academic advisor. Analyze the student's subjects, exam dates, difficulty ratings, "
            "and progress percentages, and output JSON with keys 'focus_advice', 'revision_suggestions', and 'overall_study_tip'.\n"
            f"Student context:\n{json.dumps(context_payload, indent=2)}"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        body = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": "You are a JSON-only response AI study advisor."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(self.api_url, headers=headers, json=body)
            res.raise_for_status()
            data = res.json()
            content = json.loads(data["choices"][0]["message"]["content"])

            return AIRecommendationResponse(
                focus_advice=content.get("focus_advice", []),
                revision_suggestions=content.get("revision_suggestions", []),
                overall_study_tip=content.get("overall_study_tip", "Keep up the great study routine!"),
                is_llm_connected=True,
                ai_provider=f"Live LLM API ({self.model_name})"
            )

ai_service = AIService()
