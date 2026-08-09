import React, { useState } from 'react';
import { 
  User, Mail, BookOpen, Award, Clock, Save, 
  LogOut, Shield, CheckCircle2, Sparkles, Loader2 
} from 'lucide-react';

export function UserProfile({ currentUser, onUpdateProfile, onLogout, subjectsCount = 0, completedHours = 0 }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [major, setMajor] = useState(currentUser?.major || 'Computer Science & Engineering');
  const [dailyGoal, setDailyGoal] = useState(currentUser?.dailyGoal || 4);
  const [bio, setBio] = useState(currentUser?.bio || 'Passionate student balancing coursework and study goals.');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await onUpdateProfile({
        name,
        email,
        major,
        dailyGoal: Number(dailyGoal),
        bio
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Profile & Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your personal account details, academic specialization, and study preferences.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid-3">
        
        {/* Left Column: Avatar & Overview Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.25rem 1.5rem' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 800,
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginBottom: '1rem',
            overflow: 'hidden'
          }}>
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (name || 'U').charAt(0).toUpperCase()
            )}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {currentUser?.name || 'Student'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {currentUser?.email}
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#A5B4FC',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            <Shield size={14} color="#34D399" />
            <span>Verified Student Account</span>
          </div>

          {/* Quick Metrics */}
          <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Courses</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{subjectsCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Logged Study Hours</span>
              <span style={{ fontWeight: 700, color: '#34D399' }}>{completedHours} hrs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target Daily Goal</span>
              <span style={{ fontWeight: 700, color: '#F472B6' }}>{dailyGoal} hrs/day</span>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', color: '#FB7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <LogOut size={16} />
            <span>Log Out Account</span>
          </button>
        </div>

        {/* Right Column: Edit Profile Form (2 Spans) */}
        <div style={{ gridColumn: 'span 2' }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Edit Account Information
            </h3>
            {savedSuccess && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34D399', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Profile Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="prof-name">Full Name</label>
                <div className="input-container">
                  <User className="input-icon-left" size={18} />
                  <input
                    id="prof-name"
                    type="text"
                    className="form-input input-with-icon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="prof-email">Email Address</label>
                <div className="input-container">
                  <Mail className="input-icon-left" size={18} />
                  <input
                    id="prof-email"
                    type="email"
                    className="form-input input-with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="prof-major">Academic Major / Specialization</label>
                <div className="input-container">
                  <BookOpen className="input-icon-left" size={18} />
                  <input
                    id="prof-major"
                    type="text"
                    className="form-input input-with-icon"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="prof-goal">Daily Study Goal (Hours)</label>
                <div className="input-container">
                  <Clock className="input-icon-left" size={18} />
                  <input
                    id="prof-goal"
                    type="number"
                    min="1"
                    max="16"
                    className="form-input input-with-icon"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-bio">Bio & Academic Goals</label>
              <textarea
                id="prof-bio"
                rows={4}
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your academic interests or target career path..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaving}
                style={{ padding: '0.75rem 1.75rem' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="spin" size={18} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
