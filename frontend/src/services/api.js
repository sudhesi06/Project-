// REST API Service Client for AI Study Planner with Resilient Client Fallbacks

const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = 'An unexpected API error occurred';
    try {
      const errData = await res.json();
      errorMsg = errData.detail || JSON.stringify(errData);
    } catch (e) {
      errorMsg = res.statusText;
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) return null;
  return await res.json();
}

/**
 * Client-Side Local Heuristic AI Recommendation Fallback
 */
function generateLocalHeuristicAI(subjects = []) {
  if (!subjects || subjects.length === 0) {
    return {
      focus_advice: [],
      revision_suggestions: [],
      overall_study_tip: "Add your course subjects and upcoming exam dates to receive personalized AI study recommendations.",
      is_llm_connected: false,
      ai_provider: "Local Smart Heuristic Engine"
    };
  }

  const focusList = [];
  const revisionList = [];

  subjects.forEach(sub => {
    const progress = sub.progress_pct || 0;
    let urgency = 'Low';
    let action = `Maintain a steady revision pace for ${sub.name}.`;
    let reason = `Current progress is at ${Math.round(progress)}%.`;

    if (progress < 40) {
      urgency = 'High';
      action = `Schedule dedicated focus blocks for ${sub.name} to cover remaining chapters.`;
      reason = `Progress is under 40% (${Math.round(progress)}%).`;
    } else if (progress < 75) {
      urgency = 'Moderate';
      action = `Focus on key uncompleted topics for ${sub.name}.`;
      reason = `Course progress is at ${Math.round(progress)}%.`;
    }

    const uncompleted = (sub.topics || []).filter(t => !t.is_completed);
    const targetTopic = uncompleted.length > 0 ? uncompleted[0].title : 'Practice problem sets & exam review';

    focusList.push({
      subject_id: sub.id,
      subject_name: sub.name,
      urgency_level: urgency,
      reason: reason,
      recommended_topic: targetTopic,
      suggested_action: action
    });

    const completedTopics = (sub.topics || []).filter(t => t.is_completed);
    completedTopics.slice(0, 2).forEach(top => {
      revisionList.push({
        subject_name: sub.name,
        topic_title: top.title,
        last_studied_days_ago: 3,
        recommendation_type: 'Spaced Repetition Review'
      });
    });
  });

  const topSubject = subjects[0];
  const tip = `🎯 Immediate Priority: Focus on ${topSubject.name} today. Allocate 45-minute study sessions with 15-minute breaks for optimal retention.`;

  return {
    focus_advice: focusList.slice(0, 3),
    revision_suggestions: revisionList.slice(0, 4),
    overall_study_tip: tip,
    is_llm_connected: false,
    ai_provider: "Local Smart Heuristic Engine"
  };
}

export const api = {
  // Subjects
  async getSubjects() {
    try {
      const res = await fetch(`${API_BASE}/subjects`);
      return await handleResponse(res);
    } catch (err) {
      console.warn("[API] getSubjects failed, returning local storage fallback:", err.message);
      const cached = localStorage.getItem('app_subjects');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async createSubject(subjectData) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subjectData),
    });
    return handleResponse(res);
  },

  async updateSubject(id, subjectData) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subjectData),
    });
    return handleResponse(res);
  },

  async deleteSubject(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Topics
  async addTopic(subjectId, topicData) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });
    return handleResponse(res);
  },

  async updateTopic(topicId, topicData) {
    const res = await fetch(`${API_BASE}/subjects/topics/${topicId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });
    return handleResponse(res);
  },

  async deleteTopic(topicId) {
    const res = await fetch(`${API_BASE}/subjects/topics/${topicId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Study Sessions & Progress
  async getSessions(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.today_only) query.append('today_only', 'true');
      if (params.date) query.append('date', params.date);
      if (params.subject_id) query.append('subject_id', params.subject_id);

      const res = await fetch(`${API_BASE}/sessions?${query.toString()}`);
      return await handleResponse(res);
    } catch (err) {
      console.warn("[API] getSessions failed:", err.message);
      return [];
    }
  },

  async updateSession(sessionId, sessionData) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
    return handleResponse(res);
  },

  // Study Planner
  async getPlannerSettings() {
    try {
      const res = await fetch(`${API_BASE}/planner/settings`);
      return await handleResponse(res);
    } catch (err) {
      return { daily_hours: 4, session_length_minutes: 60, preferred_study_time: "Afternoon" };
    }
  },

  async updatePlannerSettings(settingsData) {
    const res = await fetch(`${API_BASE}/planner/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    });
    return handleResponse(res);
  },

  async generateSchedule(params) {
    const res = await fetch(`${API_BASE}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(res);
  },

  // AI Recommendations with Resilient Local Fallback
  async getAIRecommendations(existingSubjects = []) {
    try {
      const res = await fetch(`${API_BASE}/ai/recommendations`);
      const data = await handleResponse(res);
      if (data && (data.focus_advice || data.overall_study_tip)) {
        return data;
      }
      return generateLocalHeuristicAI(existingSubjects);
    } catch (err) {
      console.info("[API] AI Recommendations endpoint unavailable, generating local client heuristics.");
      return generateLocalHeuristicAI(existingSubjects);
    }
  }
};
