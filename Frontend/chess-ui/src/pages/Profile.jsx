import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Trophy, Award, Flame, Target, History, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function Profile() {
  const { playerStats, savedGames } = useGame();
  const { gamesPlayed = 0, wins = 0, losses = 0, draws = 0, avgAccuracy = 88.5, favOpening = 'Sicilian Defense', rating = 1500 } = playerStats;

  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 65;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 24px',
      minHeight: 'calc(100vh - 120px)'
    }}>
      {/* Profile Header Banner */}
      <div className="glass-panel" style={{
        padding: '30px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow-blue)'
        }}>
          <User size={36} color="#ffffff" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Grandmaster Player Profile</h1>
            <span className="badge-ai">Rating: {rating} ELO</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Member since 2026 • Player vs Player Competitor
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-blue)', marginBottom: '8px' }}>
            <Trophy size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Games Played</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{gamesPlayed}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
            <Flame size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Win Rate</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{winRate}%</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple)', marginBottom: '8px' }}>
            <Award size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Avg Move Accuracy</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{avgAccuracy}%</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
            <Target size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Favorite Opening</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>{favOpening}</div>
        </div>
      </div>

      {/* Detailed Match History List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <History size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Recent Match Record</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {savedGames.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No matches recorded yet. Play a head-to-head match with TensorFlow move suggestions!
            </p>
          ) : (
            savedGames.map((match, idx) => (
              <div
                key={match.id || idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {match.result === 'win' ? (
                    <CheckCircle2 size={20} color="#34d399" />
                  ) : match.result === 'loss' ? (
                    <XCircle size={20} color="#fb7185" />
                  ) : (
                    <MinusCircle size={20} color="#fbbf24" />
                  )}
                  <div>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                      Player 1 vs Player 2 Match
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                      {match.opening || 'King\'s Pawn Game'} • {new Date(match.date || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: match.result === 'win' ? '#34d399' : match.result === 'loss' ? '#fb7185' : '#fbbf24'
                  }}>
                    {match.result ? match.result.toUpperCase() : 'DRAW'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>
                    {match.moves?.length || 18} moves
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
