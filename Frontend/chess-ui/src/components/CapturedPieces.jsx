import React from 'react';
import { Swords } from 'lucide-react';

export default function CapturedPieces({ whiteCaptured = [], blackCaptured = [], balance = 0 }) {
  const pieceSymbols = {
    p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 24px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Swords size={18} color="var(--accent-amber)" />
        <h4 style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 700 }}>Captured Material</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* White Captured */}
        <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.06)', paddingRight: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            White Captured
          </span>
          <div style={{
            fontSize: '1.3rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '28px'
          }}>
            {whiteCaptured.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>None yet</span>
            ) : (
              whiteCaptured.map((p, i) => <span key={i}>{pieceSymbols[p] || p}</span>)
            )}
          </div>
        </div>

        {/* Black Captured */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Black Captured
          </span>
          <div style={{
            fontSize: '1.3rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '28px'
          }}>
            {blackCaptured.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>None yet</span>
            ) : (
              blackCaptured.map((p, i) => <span key={i}>{pieceSymbols[p] || p}</span>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
