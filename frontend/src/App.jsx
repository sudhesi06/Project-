import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Subjects } from './components/Subjects';
import { Planner } from './components/Planner';
import { AIAdvisor } from './components/AIAdvisor';
import { ProgressTracker } from './components/ProgressTracker';
import { api } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  
  // Data States
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [plannerSettings, setPlannerSettings] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load Initial Data from FastAPI Backend
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [subsData, allSessData, todaySessData, aiData, settingsData] = await Promise.all([
        api.getSubjects(),
        api.getSessions(),
        api.getSessions({ today_only: true }),
        api.getAIRecommendations(),
        api.getPlannerSettings()
      ]);

      setSubjects(subsData || []);
      setSessions(allSessData || []);
      setTodaySessions(todaySessData || []);
      setAiAdvice(aiData || null);
      setPlannerSettings(settingsData || null);
    } catch (err) {
      console.error("[App] Failed to load data from backend:", err);
      setErrorMsg("Failed to connect to AI Study Planner API server. Please make sure the FastAPI backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Subject Handlers
  const handleAddSubject = async (subjectData) => {
    try {
      await api.createSubject(subjectData);
      await loadData();
    } catch (err) {
      alert("Error adding subject: " + err.message);
    }
  };

  const handleUpdateSubject = async (id, subjectData) => {
    try {
      await api.updateSubject(id, subjectData);
      await loadData();
    } catch (err) {
      alert("Error updating subject: " + err.message);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? All associated chapters and sessions will be deleted.")) return;
    try {
      await api.deleteSubject(id);
      await loadData();
    } catch (err) {
      alert("Error deleting subject: " + err.message);
    }
  };

  // Topic Handlers
  const handleAddTopic = async (subjectId, topicData) => {
    try {
      await api.addTopic(subjectId, topicData);
      await loadData();
    } catch (err) {
      alert("Error adding chapter topic: " + err.message);
    }
  };

  const handleToggleTopic = async (topicId, isCompleted) => {
    try {
      await api.updateTopic(topicId, { is_completed: isCompleted });
      await loadData();
    } catch (err) {
      alert("Error updating chapter topic: " + err.message);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await api.deleteTopic(topicId);
      await loadData();
    } catch (err) {
      alert("Error deleting topic: " + err.message);
    }
  };

  // Session Handlers
  const handleToggleSession = async (sessionId, isCompleted) => {
    try {
      await api.updateSession(sessionId, { is_completed: isCompleted });
      await loadData();
    } catch (err) {
      alert("Error updating session: " + err.message);
    }
  };

  // Planner Handlers
  const handleUpdateSettings = async (settingsData) => {
    try {
      const updated = await api.updatePlannerSettings(settingsData);
      setPlannerSettings(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSchedule = async (params) => {
    try {
      await api.generateSchedule(params);
      await loadData();
    } catch (err) {
      alert("Error generating schedule: " + err.message);
    }
  };

  const handleRefreshAI = async () => {
    try {
      const aiData = await api.getAIRecommendations();
      setAiAdvice(aiData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          toggleTheme={toggleTheme}
          todayTaskCount={todaySessions.length}
        />

        <div className="page-body">
          
          {errorMsg && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#FB7185', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{errorMsg}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={loadData}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
              <RefreshCw className="spin" size={36} color="#818CF8" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Loading your AI Study Planner...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  subjects={subjects} 
                  todaySessions={todaySessions} 
                  aiAdvice={aiAdvice} 
                  onToggleSession={handleToggleSession} 
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'subjects' && (
                <Subjects 
                  subjects={subjects}
                  onAddSubject={handleAddSubject}
                  onUpdateSubject={handleUpdateSubject}
                  onDeleteSubject={handleDeleteSubject}
                  onAddTopic={handleAddTopic}
                  onToggleTopic={handleToggleTopic}
                  onDeleteTopic={handleDeleteTopic}
                />
              )}

              {activeTab === 'planner' && (
                <Planner 
                  settings={plannerSettings}
                  onUpdateSettings={handleUpdateSettings}
                  onGenerateSchedule={handleGenerateSchedule}
                  sessions={sessions}
                  onToggleSession={handleToggleSession}
                />
              )}

              {activeTab === 'ai-advisor' && (
                <AIAdvisor 
                  aiAdvice={aiAdvice}
                  onRefreshAI={handleRefreshAI}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressTracker 
                  subjects={subjects}
                  sessions={sessions}
                />
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
