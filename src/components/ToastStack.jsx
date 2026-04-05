import React from 'react';
import useStore from '../store/useStore';

export default function ToastStack() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismissToast(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 16px',
            background: t.type === 'error' ? 'var(--red-bg)' : 'var(--bg4)',
            border: `1px solid ${t.type === 'error' ? 'var(--red2)' : 'var(--border2)'}`,
            borderLeft: `3px solid ${t.type === 'error' ? 'var(--red)' : 'var(--green)'}`,
            borderRadius: 10,
            color: 'var(--text)',
            fontSize: 13,
            fontWeight: 500,
            pointerEvents: 'all',
            cursor: 'pointer',
            minWidth: 220,
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            animation: 'slideInRight 0.2s ease',
          }}
        >
          <span style={{ fontSize: 15 }}>{t.type === 'error' ? '✕' : '✓'}</span>
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
