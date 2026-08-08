import React from 'react';
import { 
  LayoutDashboard, BookOpen, CalendarCheck, Sparkles, BarChart2 
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subject Manager', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles },
    { id: 'progress', label: 'Progress Tracking', icon: BarChart2 },
  ];

  return (
    <aside className="mobile-sidebar" style={{
      width: '240px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Navigation Menu
        </p>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isActive ? '#A5B4FC' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            <Icon size={18} color={isActive ? '#818CF8' : 'var(--text-secondary)'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
