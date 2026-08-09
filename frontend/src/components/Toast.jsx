import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#34D399" />;
      case 'error':
        return <AlertCircle size={20} color="#FB7185" />;
      case 'warning':
        return <AlertTriangle size={20} color="#FBBF24" />;
      default:
        return <Info size={20} color="#818CF8" />;
    }
  };

  return (
    <div className={`toast-item toast-${toast.type || 'info'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {getIcon()}
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {toast.message}
        </span>
      </div>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
