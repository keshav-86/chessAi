import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ScoreBoard({ whiteScore = 54, blackScore = 46 }) {
  const p1Score = Math.min(98, Math.max(2, Math.round(whiteScore)));
  const p2Score = 100 - p1Score;

  // SVG Donut calculation
  const strokeDasharray = 283; // 2 * pi * 45
  const p1Dash = (p1Score / 100) * strokeDasharray;
  const p2Dash = strokeDasharray - p1Dash;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <BarChart3 size={20} color="var(--accent-blue)" />
        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', fontWeight: 700 }}>Score Board</h3>
      </div>

      {/* Circular Radial Donut Chart */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0 24px'
      }}>
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            {/* Player 2 (Purple) Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="12"
              strokeDasharray={`${strokeDasharray}`}
              strokeDashoffset="0"
            />
            {/* Player 1 (Blue) Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={`${p1Dash} ${p2Dash}`}
              strokeDashoffset="0"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>

          {/* Inner Center Text */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>VS</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '16px', padding: '0 10px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{p1Score}%</span>
            <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>Player 1</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>(White)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{p2Score}%</span>
            <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>Player 2</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>(Black)</div>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          Win Percentage (AI Evaluation)
        </span>
      </div>

      {/* Linear Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
              Player 1 (White)
            </span>
            <span style={{ color: '#60a5fa' }}>{p1Score}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${p1Score}%`, height: '100%', background: '#3b82f6', borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
              Player 2 (Black)
            </span>
            <span style={{ color: '#c084fc' }}>{p2Score}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${p2Score}%`, height: '100%', background: '#8b5cf6', borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
