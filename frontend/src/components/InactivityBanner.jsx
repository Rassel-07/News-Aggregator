import React, { useContext } from 'react';
import { FiClock, FiX } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function InactivityBanner() {
  const { inactivityAlert, dismissInactivityAlert } = useContext(UserContext);

  if (!inactivityAlert) return null;

  return (
    <aside
      aria-label="Session Inactivity Notification"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        maxWidth: '420px',
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '1rem 1.25rem',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'scaleUp 300ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          width: '2.2rem',
          height: '2.2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-subtle)',
          color: 'var(--accent-primary)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0
        }}
      >
        <FiClock size={18} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
          Session Inactivity Notice
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {inactivityAlert}
        </p>
      </div>

      <button
        type="button"
        onClick={dismissInactivityAlert}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'grid',
          placeItems: 'center'
        }}
        title="Dismiss notice"
      >
        <FiX size={16} />
      </button>
    </aside>
  );
}
