import React from 'react';
import { User, Crown } from 'lucide-react';

export default function PlayerCard({
  name = 'Player',
  rating = 1500,
  color = 'w',
  isTurn = false,
  capturedPieces = [],
  materialAdvantage = 0,
}) {
  const pieceSymbols = {
    p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
  };

  return (
    <div className="glass-panel" style={{
      padding: '16px 20px',
      border: isTurn ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-glass)',
      boxShadow: isTurn ? '0 0 15px rgba(59, 130, 246, 0.25)' : 'none',
      transition: 'all 0.25s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: color === 'w'
              ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
              : 'linear-gradient(135deg, #475569, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: color === 'w' ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'
          }}>
            <User size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
                👤 {name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ({rating})
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Playing as {color === 'w' ? 'White Pieces ♔' : 'Black Pieces ♚'}
            </span>
          </div>
        </div>

        {isTurn && (
          <span className="badge-green" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            Current Turn
          </span>
        )}
      </div>

      {/* Captured Pieces & Material Differential */}
      <div style={{
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '28px'
      }}>
        <div style={{ fontSize: '1.25rem', letterSpacing: '2px', color: 'var(--text-main)', opacity: 0.9 }}>
          {capturedPieces.map((p, idx) => (
            <span key={idx} style={{ marginRight: '3px' }}>{pieceSymbols[p] || p}</span>
          ))}
        </div>

        {materialAdvantage > 0 && (
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--accent-emerald)',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            +{materialAdvantage}
          </span>
        )}
      </div>
    </div>
  );
}
