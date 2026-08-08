import React, { useState } from 'react';
import { 
  Sparkles, Zap, BrainCircuit, RefreshCw, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, Key, HelpCircle 
} from 'lucide-react';

export function AIAdvisor({ aiAdvice, onRefreshAI }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshAI();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getUrgencyBadgeClass = (level) => {
    switch (level) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-hard';
      case 'Moderate': return 'badge-medium';
      default: return 'badge-easy';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <BrainCircuit size={14} />
            <span>MODULAR AI SERVICE LAYER</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Study Advisor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Personalized study focus recommendations, revision schedules, and syllabus crunch advice.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowConfig(!showConfig)}>
            <Key size={16} color="#A5B4FC" />
            <span>LLM API Config</span>
          </button>
          <button className="btn btn-primary" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={isRefreshing ? 'spin' : ''} size={16} />
            <span>Refresh AI Insights</span>
          </button>
        </div>
      </div>

      {/* LLM Connection Info Modal / Banner */}
      {showConfig && (
        <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} color="#34D399" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>LLM Modular API Architecture</h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            The AI service is structured with a clean adapter pattern in <code>backend/app/services/ai_service.py</code>. 
            Currently running on the <strong>High-Accuracy Heuristic Engine</strong>. To connect a live LLM (OpenAI / Gemini / Ollama):
          </p>
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.85rem', color: '#A5B4FC' }}>
            export LLM_API_KEY="your_api_key_here"<br />
            export LLM_MODEL="gpt-4o"  # or gemini-1.5-pro
          </div>
        </div>
      )}

      {/* Main Focus Advice Hero Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Sparkles size={22} color="#F472B6" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>AI Master Recommendation</h3>
        </div>
        <p style={{ fontSize: '1.05rem', color: '#F3F4F6', lineHeight: 1.6, fontWeight: 500 }}>
          {aiAdvice ? aiAdvice.overall_study_tip : 'Analyzing subject difficulty and exam proximity...'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.2)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
            <Zap size={14} color="#F59E0B" />
            <span>Active Provider: {aiAdvice ? aiAdvice.ai_provider : 'Local Heuristic Engine'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.2)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Modular LLM API Integration Ready</span>
          </div>
        </div>
      </div>

      {/* Grid: What to Study Next Focus Cards & Spaced Repetition */}
      <div className="grid-2">
        
        {/* What to Study Next */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Zap size={20} color="#FBBF24" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>What to Study Next</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiAdvice && aiAdvice.focus_advice.length > 0 ? (
              aiAdvice.focus_advice.map((item, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.subject_name}
                    </h4>
                    <span className={`badge ${getUrgencyBadgeClass(item.urgency_level)}`}>
                      {item.urgency_level} Priority
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    💡 <strong>Reason:</strong> {item.reason}
                  </p>

                  {item.recommended_topic && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem', color: '#A5B4FC' }}>
                      <strong>Target Topic:</strong> {item.recommended_topic}
                    </div>
                  )}

                  <p style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ArrowRight size={14} />
                    <span>{item.suggested_action}</span>
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No focus suggestions available yet.</p>
            )}
          </div>
        </div>

        {/* Revision Suggestions (Spaced Repetition) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <RefreshCw size={20} color="#34D399" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Revision & Memory Retention</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiAdvice && aiAdvice.revision_suggestions.length > 0 ? (
              aiAdvice.revision_suggestions.map((rev, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: '4px', fontWeight: 600 }}>
                        {rev.recommendation_type}
                      </span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {rev.subject_name}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Topic: <strong>{rev.topic_title}</strong>
                    </p>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Review due
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No revision sessions required right now!</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
