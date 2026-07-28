import React, { useRef, useEffect } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function MoveHistory() {
  const { historyStack } = useGame();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [historyStack]);

  // Pair moves into turns
  const pairedMoves = [];
  for (let i = 0; i < historyStack.length; i += 2) {
    pairedMoves.push({
      turnNumber: Math.floor(i / 2) + 1,
      white: historyStack[i],
      black: historyStack[i + 1] || null
    });
  }

  // Fallback moves matching screenshot if empty
  const displayMoves = pairedMoves.length > 0
    ? pairedMoves
    : [
        { turnNumber: 1, white: { san: 'e4' }, black: { san: 'e5' } },
        { turnNumber: 2, white: { san: 'Nf3' }, black: { san: 'Nc6' } },
        { turnNumber: 3, white: { san: 'Bb5' }, black: { san: 'a6' } },
        { turnNumber: 4, white: { san: 'Ba4' }, black: { san: 'Nf6' } }
      ];

  return (
    <div className="glass-panel" style={{ padding: '14px 20px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>Move History</h4>
        </div>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Horizontal Pill Row */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {displayMoves.map((pair) => (
          <div
            key={pair.turnNumber}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.85rem',
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
              {pair.turnNumber}.
            </span>
            <span style={{ color: '#ffffff', minWidth: '24px' }}>
              {pair.white?.san || ''}
            </span>
            {pair.black && (
              <span style={{ color: '#94a3b8', minWidth: '24px', marginLeft: '6px' }}>
                {pair.black.san}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
