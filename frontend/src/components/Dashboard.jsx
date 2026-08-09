import React from 'react';
import { 
  CheckCircle2, Circle, Clock, Calendar, BookOpen, 
  Sparkles, TrendingUp, AlertTriangle, ArrowRight, Zap 
} from 'lucide-react';

export function Dashboard({ 
  subjects, 
  todaySessions, 
  aiAdvice, 
  onToggleSession, 
  onNavigate,
  currentUser
}) {
  const completedTodayCount = todaySessions.filter(s => s.is_completed).length;
  const totalTodayCount = todaySessions.length;
  const todayProgressPct = totalTodayCount > 0 
    ? Math.round((completedTodayCount / totalTodayCount) * 100) 
    : 0;

  // Calculate Average Progress
  const avgSubjectProgress = subjects.length > 0 
    ? Math.round(subjects.reduce((acc, s) => acc + (s.progress_pct || 0), 0) / subjects.length) 
    : 0;

  // Find nearest exam
  const sortedExams = [...subjects].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
  const nearestExam = sortedExams[0];

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return 0;
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Hero Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
      }}>
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', color: '#A5B4FC', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Zap size={14} color="#F59E0B" />
              <span>Smart AI Semester Assistant</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '0.95rem' }}>
              You have <strong style={{ color: '#A5B4FC' }}>{totalTodayCount - completedTodayCount} tasks remaining</strong> for today. 
              {nearestExam && (
                <span> Nearest exam is <strong style={{ color: '#F472B6' }}>{nearestExam.name}</strong> in {getDaysUntil(nearestExam.exam_date)} days!</span>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('planner')}>
              <Calendar size={16} />
              <span>View Study Plan</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('ai-advisor')}>
              <Sparkles size={16} color="#EC4899" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid-4">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Subjects</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{subjects.length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Avg Syllabus Progress</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{avgSubjectProgress}%</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F472B6' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Today's Completion</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{completedTodayCount} / {totalTodayCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Next Exam</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
              {nearestExam ? `${getDaysUntil(nearestExam.exam_date)} days` : 'None'}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Upcoming Exams */}
      <div className="grid-3">
        
        {/* Today's Tasks (2 Columns Span) */}
        <div style={{ gridColumn: 'span 2' }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Today's Study Schedule</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Click to mark session completed</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A5B4FC' }}>{todayProgressPct}% Complete</span>
              <div className="progress-bar-bg" style={{ width: '120px', marginTop: '4px' }}>
                <div className="progress-bar-fill" style={{ width: `${todayProgressPct}%` }} />
              </div>
            </div>
          </div>

          {todaySessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
              <Calendar size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No study sessions scheduled for today!</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => onNavigate('planner')}>
                Generate Today's Plan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onToggleSession(session.id, !session.is_completed)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    background: session.is_completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: session.is_completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: session.is_completed ? '#34D399' : 'var(--text-muted)' }}>
                      {session.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
                          backgroundColor: session.subject_color || '#6366F1'
                        }} />
                        <h4 style={{
                          fontSize: '0.95rem', fontWeight: 600,
                          color: session.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: session.is_completed ? 'line-through' : 'none'
                        }}>
                          {session.subject_name}: {session.topic_title}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {session.start_time} • {session.duration_minutes} mins • {session.session_type}
                      </p>
                    </div>
                  </div>

                  <span className={`badge badge-${session.priority.toLowerCase()}`}>
                    {session.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Exams & AI Spotlight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Focus Spotlight Card */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="#F472B6" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>AI Study Advice</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {aiAdvice ? aiAdvice.overall_study_tip : 'Analyzing your exam schedule and progress...'}
            </p>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => onNavigate('ai-advisor')}>
              <span>View Full AI Analysis</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Upcoming Exams List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Upcoming Exams
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sortedExams.slice(0, 4).map((sub) => {
                const daysLeft = getDaysUntil(sub.exam_date);
                const isUrgent = daysLeft <= 7;
                return (
                  <div key={sub.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '8px', height: '36px', borderRadius: '4px', backgroundColor: sub.color }} />
                      <div>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sub.name}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub.exam_date}</p>
                      </div>
                    </div>
                    <span className={`badge ${isUrgent ? 'badge-critical' : 'badge-easy'}`}>
                      {daysLeft} days left
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
