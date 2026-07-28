import React from 'react';
import { Sparkles, ArrowRight, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuggestionCard({
  index = 1,
  suggestion = {},
  isSelected = false,
  onSelect,
}) {
  const { san, uci, percent = 100, score = 0.95 } = suggestion;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect && onSelect(suggestion)}
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25))'
          : 'rgba(255, 255, 255, 0.04)',
        border: isSelected
          ? '1.5px solid var(--accent-blue)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: index === 1
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'rgba(255, 255, 255, 0.08)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: index === 1 ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
        }}>
          {index}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
              {san}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ({uci})
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            ML Confidence Score: {(score * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '0.88rem',
          fontWeight: 800,
          color: index === 1 ? '#34d399' : 'var(--accent-blue)',
          background: index === 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          {percent}%
        </span>
        <Target size={16} color={isSelected ? 'var(--accent-blue)' : 'var(--text-dim)'} />
      </div>
    </motion.div>
  );
}
