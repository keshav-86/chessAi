import React from 'react';

export default function LoadingSpinner({ label = 'Computing AI Evaluation...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
      gap: '14px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(59, 130, 246, 0.15)',
        borderTop: '3px solid var(--accent-blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
