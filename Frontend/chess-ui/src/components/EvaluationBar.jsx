import React from 'react';
import { motion } from 'framer-motion';

export default function EvaluationBar({ whiteScore = 50, blackScore = 50, orientation = 'vertical' }) {
  const player1Pct = Math.min(98, Math.max(2, whiteScore));
  const player2Pct = 100 - player1Pct;

  if (orientation === 'horizontal') {
    return (
      <div style={{ width: '100%', marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '6px'
        }}>
          <span style={{ color: '#ffffff' }}>Player 1 : {player1Pct}%</span>
          <span style={{ color: '#94a3b8' }}>Player 2 : {player2Pct}%</span>
        </div>
        <div style={{
          height: '10px',
          width: '100%',
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#1e293b',
          display: 'flex',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <motion.div
            animate={{ width: `${player1Pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: '#ffffff' }}
          />
          <motion.div
            animate={{ width: `${player2Pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: '#0f172a' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      minHeight: '500px',
      width: '28px',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f172a',
      border: '1px solid var(--border-glass-light)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* Player 2 (Black) Evaluation Part (Top) */}
      <motion.div
        animate={{ height: `${player2Pct}%` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          width: '100%',
          background: '#1e293b',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '6px'
        }}
      >
        {player2Pct > 20 && (
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>
            {player2Pct}%
          </span>
        )}
      </motion.div>

      {/* Player 1 (White) Evaluation Part (Bottom) */}
      <motion.div
        animate={{ height: `${player1Pct}%` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          width: '100%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '6px'
        }}
      >
        {player1Pct > 20 && (
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0f172a' }}>
            {player1Pct}%
          </span>
        )}
      </motion.div>
    </div>
  );
}
