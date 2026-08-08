import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Sliders, Play, CheckCircle2, 
  Circle, AlertCircle, Sparkles, RefreshCw, Layers 
} from 'lucide-react';

export function Planner({ 
  settings, 
  onUpdateSettings, 
  onGenerateSchedule, 
  sessions, 
  onToggleSession 
}) {
  const [dailyHours, setDailyHours] = useState(settings?.daily_study_hours || 4.0);
  const [sessionMins, setSessionMins] = useState(settings?.preferred_session_length || 60);
  const [daysAhead, setDaysAhead] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  useEffect(() => {
    if (settings) {
      setDailyHours(settings.daily_study_hours);
      setSessionMins(settings.preferred_session_length);
    }
  }, [settings]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onUpdateSettings({ daily_study_hours: dailyHours, preferred_session_length: sessionMins });
      await onGenerateSchedule({
        daily_hours: dailyHours,
        session_length_mins: sessionMins,
        days_ahead: daysAhead
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Group sessions by Date
  const groupedSessions = sessions.reduce((acc, sess) => {
    if (!acc[sess.date]) acc[sess.date] = [];
    acc[sess.date].push(sess);
    return acc;
  }, {});

  const datesList = Object.keys(groupedSessions).sort();

  const filteredDates = selectedDayFilter === 'all' 
    ? datesList 
    : datesList.filter(d => d === selectedDayFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Bar */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Study Planner & Schedule Generator</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Input your daily available study hours. Our algorithm prioritizes hard subjects, upcoming exam dates, and uncompleted topics.
        </p>
      </div>

      {/* Control Panel: Generator Parameters */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(30, 27, 75, 0.6) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sliders size={18} color="#818CF8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Schedule Generation Controls</h3>
        </div>

        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          
          {/* Daily Study Hours Slider */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Daily Available Hours
              </label>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A5B4FC' }}>
                {dailyHours} Hours/day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1 hr</span>
              <span>6 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Session Length Preference */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Block Length
            </label>
            <select
              className="form-select"
              value={sessionMins}
              onChange={(e) => setSessionMins(parseInt(e.target.value))}
            >
              <option value={45}>45 Minutes (Focus Sprint)</option>
              <option value={60}>60 Minutes (Standard Block)</option>
              <option value={90}>90 Minutes (Deep Work)</option>
            </select>
          </div>

          {/* Planning Horizon */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Planning Horizon
            </label>
            <select
              className="form-select"
              value={daysAhead}
              onChange={(e) => setDaysAhead(parseInt(e.target.value))}
            >
              <option value={3}>Next 3 Days</option>
              <option value={7}>Next 7 Days (1 Week)</option>
              <option value={14}>Next 14 Days (2 Weeks)</option>
            </select>
          </div>

        </div>

        {/* Generate Trigger Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="#EC4899" />
            <span>Algorithm: Exam Proximity (50%) + Topic Gap (30%) + Subject Difficulty (20%)</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            {isGenerating ? <RefreshCw className="spin" size={18} /> : <Play size={18} />}
            <span>{isGenerating ? 'Calculating Optimal Plan...' : 'Generate Smart Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs */}
      {datesList.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setSelectedDayFilter('all')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: selectedDayFilter === 'all' ? '1px solid #6366F1' : '1px solid var(--border-color)',
              background: selectedDayFilter === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedDayFilter === 'all' ? '#A5B4FC' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            All Scheduled Days ({datesList.length})
          </button>
          {datesList.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDayFilter(d)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: selectedDayFilter === d ? '1px solid #6366F1' : '1px solid var(--border-color)',
                background: selectedDayFilter === d ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedDayFilter === d ? '#A5B4FC' : 'var(--text-secondary)',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Generated Sessions Timeline Grid */}
      {filteredDates.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={42} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Study Schedule Generated Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
            Click "Generate Smart Schedule" above to let AI automatically prioritize your topics and build a balanced daily schedule.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredDates.map((dateStr) => {
            const daySessions = groupedSessions[dateStr];
            const compCount = daySessions.filter(s => s.is_completed).length;

            return (
              <div key={dateStr} className="glass-card">
                
                {/* Date Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} color="#818CF8" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{dateStr}</h3>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {compCount} of {daySessions.length} sessions completed
                  </span>
                </div>

                {/* Sessions Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {daySessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => onToggleSession(sess.id, !sess.is_completed)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        background: sess.is_completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: sess.is_completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: sess.is_completed ? '#34D399' : 'var(--text-muted)' }}>
                          {sess.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: sess.subject_color || '#6366F1' }} />
                            <h4 style={{
                              fontSize: '0.98rem', fontWeight: 600,
                              color: sess.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: sess.is_completed ? 'line-through' : 'none'
                            }}>
                              {sess.subject_name}: {sess.topic_title}
                            </h4>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                            <Clock size={12} inline style={{ marginRight: '4px' }} />
                            {sess.start_time} ({sess.duration_minutes} mins) • {sess.session_type}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge badge-${sess.priority.toLowerCase()}`}>
                          {sess.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
