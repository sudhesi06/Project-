import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Subjects } from './components/Subjects';
import { Planner } from './components/Planner';
import { AIAdvisor } from './components/AIAdvisor';
import { ProgressTracker } from './components/ProgressTracker';
import { UserProfile } from './components/UserProfile';
import { Login } from './components/Login';
import { Toast } from './components/Toast';
import { api } from './services/api';
import { authService } from './services/auth';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [toast, setToast] = useState(null);
  
  // Data States
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [plannerSettings, setPlannerSettings] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name || user.email}!`, 'success');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  };

  const handleUpdateProfile = async (updatedFields) => {
    try {
      const updatedUser = await authService.updateProfile(updatedFields);
      setCurrentUser(updatedUser);
      showToast('User profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile: ' + err.message, 'error');
    }
  };

  // Load Initial Data from FastAPI Backend (with resilient fallback)
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const subsData = await api.getSubjects();
      const allSessData = await api.getSessions();
      const todaySessData = await api.getSessions({ today_only: true });
      const aiData = await api.getAIRecommendations(subsData);
      const settingsData = await api.getPlannerSettings();

      setSubjects(subsData || []);
      setSessions(allSessData || []);
      setTodaySessions(todaySessData || []);
      setAiAdvice(aiData || null);
      setPlannerSettings(settingsData || null);
    } catch (err) {
      console.error("[App] Data loading notice:", err);
      // Generate fallback local state so UI works smoothly
      const fallbackAi = await api.getAIRecommendations([]);
      setAiAdvice(fallbackAi);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Subject Handlers
  const handleAddSubject = async (subjectData) => {
    try {
      await api.createSubject(subjectData);
      showToast(`Subject "${subjectData.name}" added successfully!`, 'success');
      await loadData();
    } catch (err) {
      showToast("Error adding subject: " + err.message, 'error');
    }
  };

  const handleUpdateSubject = async (id, subjectData) => {
    try {
      await api.updateSubject(id, subjectData);
      showToast("Subject details updated!", 'success');
      await loadData();
    } catch (err) {
      showToast("Error updating subject: " + err.message, 'error');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? All associated chapters and sessions will be deleted.")) return;
    try {
      await api.deleteSubject(id);
      showToast("Subject deleted.", 'info');
      await loadData();
    } catch (err) {
      showToast("Error deleting subject: " + err.message, 'error');
    }
  };

  // Topic Handlers
  const handleAddTopic = async (subjectId, topicData) => {
    try {
      await api.addTopic(subjectId, topicData);
      showToast("Chapter added!", 'success');
      await loadData();
    } catch (err) {
      showToast("Error adding chapter topic: " + err.message, 'error');
    }
  };

  const handleToggleTopic = async (topicId, isCompleted) => {
    try {
      await api.updateTopic(topicId, { is_completed: isCompleted });
      showToast(isCompleted ? "Chapter marked as completed! 🎉" : "Chapter marked incomplete", 'info');
      await loadData();
    } catch (err) {
      showToast("Error updating chapter topic: " + err.message, 'error');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await api.deleteTopic(topicId);
      showToast("Chapter deleted.", 'info');
      await loadData();
    } catch (err) {
      showToast("Error deleting topic: " + err.message, 'error');
    }
  };

  // Session Handlers
  const handleToggleSession = async (sessionId, isCompleted) => {
    try {
      await api.updateSession(sessionId, { is_completed: isCompleted });
      showToast(isCompleted ? "Study session completed! Great job! ⏱️" : "Study session marked pending", 'success');
      await loadData();
    } catch (err) {
      showToast("Error updating session: " + err.message, 'error');
    }
  };

  // Planner Handlers
  const handleUpdateSettings = async (settingsData) => {
    try {
      const updated = await api.updatePlannerSettings(settingsData);
      setPlannerSettings(updated);
      showToast("Planner settings updated!", 'success');
    } catch (err) {
      showToast("Failed to update planner settings: " + err.message, 'error');
    }
  };

  const handleGenerateSchedule = async (params) => {
    try {
      await api.generateSchedule(params);
      showToast("Smart study schedule generated!", 'success');
      await loadData();
    } catch (err) {
      showToast("Error generating schedule: " + err.message, 'error');
    }
  };

  const handleRefreshAI = async () => {
    try {
      const aiData = await api.getAIRecommendations(subjects);
      setAiAdvice(aiData);
      showToast("AI Recommendations refreshed!", 'success');
    } catch (err) {
      showToast("Failed to refresh AI insights.", 'warning');
    }
  };

  if (!currentUser) {
    return (
      <>
        <div className="toast-container">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  const completedHoursSum = (sessions.filter(s => s.is_completed).reduce((sum, s) => sum + (s.duration_minutes || 60), 0) / 60).toFixed(1);

  return (
    <div className="app-container">
      
      {/* Toast Notification Stack */}
      <div className="toast-container">
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>

      <div className="main-content">
        
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          toggleTheme={toggleTheme}
          todayTaskCount={todaySessions.length}
          currentUser={currentUser}
          onLogout={handleLogout}
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
                  currentUser={currentUser}
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

              {activeTab === 'profile' && (
                <UserProfile
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                  subjectsCount={subjects.length}
                  completedHours={completedHoursSum}
                />
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
