import React from 'react';
import { 
  BarChart2, CheckCircle2, TrendingUp, BookOpen, 
  Award, Clock, Calendar, PieChart 
} from 'lucide-react';

export function ProgressTracker({ subjects, sessions }) {
  const totalSubjects = subjects.length;
  const overallAvgProgress = totalSubjects > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progress_pct || 0), 0) / totalSubjects)
    : 0;

  const totalTopics = subjects.reduce((sum, s) => sum + (s.topics?.length || 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.filter(t => t.is_completed).length : 0), 0);

  const completedSessions = sessions.filter(s => s.is_completed);
  const totalCompletedHours = (completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 60), 0) / 60).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Progress Tracking & Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Track overall course completion, subject-wise progress breakdowns, and study session history.
        </p>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid-4">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Overall Progress</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{overallAvgProgress}%</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Chapters Completed</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{completedTopics} / {totalTopics}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F472B6' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Study Hours</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{totalCompletedHours} hrs</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
            <Award size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Active Courses</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{totalSubjects}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Progress Bars & Completion Log */}
      <div className="grid-2">
        
        {/* Subject-wise Progress Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={20} color="#818CF8" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Subject-wise Progress</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {subjects.map((sub) => {
              const totalT = sub.topics?.length || 0;
              const compT = sub.topics ? sub.topics.filter(t => t.is_completed).length : 0;

              return (
                <div key={sub.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: sub.color || '#6366F1' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</h4>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#A5B4FC' }}>
                      {sub.progress_pct}%
                    </span>
                  </div>

                  <div className="progress-bar-bg" style={{ height: '10px', marginBottom: '0.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${sub.progress_pct}%`, backgroundColor: sub.color }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span>{compT} of {totalT} chapters completed</span>
                    <span>Exam: {sub.exam_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Session History Log */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Calendar size={20} color="#34D399" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Session Completion Log</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {completedSessions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                No completed sessions logged yet. Check off study sessions on the Dashboard or Planner to see history here!
              </p>
            ) : (
              completedSessions.map((sess) => (
                <div key={sess.id} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="#34D399" />
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {sess.subject_name}: {sess.topic_title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Date: {sess.date} • {sess.duration_minutes} mins
                      </p>
                    </div>
                  </div>

                  <span className="badge badge-easy">Completed</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
