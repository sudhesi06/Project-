import React from 'react';
import { 
  GraduationCap, LayoutDashboard, BookOpen, CalendarCheck, 
  Sparkles, BarChart2, Moon, Sun, Clock 
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme, todayTaskCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'AI' },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
  ];

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFFFFF 0%, #A5B4FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Study Planner
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>College Team Edition</p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={17} color={isActive ? '#FFFFFF' : (item.id === 'ai-advisor' ? '#F472B6' : 'var(--text-secondary)')} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
                  color: 'white',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <Clock size={14} color="#A5B4FC" />
          <span>{todayFormatted}</span>
        </div>

        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
        </button>
      </div>
    </header>
  );
}
