// REST API Service Client for AI Study Planner

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

export const api = {
  // Subjects
  async getSubjects() {
    const res = await fetch(`${API_BASE}/subjects`);
    return handleResponse(res);
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
    const query = new URLSearchParams();
    if (params.today_only) query.append('today_only', 'true');
    if (params.date) query.append('date', params.date);
    if (params.subject_id) query.append('subject_id', params.subject_id);

    const res = await fetch(`${API_BASE}/sessions?${query.toString()}`);
    return handleResponse(res);
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
    const res = await fetch(`${API_BASE}/planner/settings`);
    return handleResponse(res);
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

  // AI Recommendations
  async getAIRecommendations() {
    const res = await fetch(`${API_BASE}/ai/recommendations`);
    return handleResponse(res);
  }
};
