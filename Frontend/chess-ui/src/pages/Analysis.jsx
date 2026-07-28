import React from 'react';
import { useGame } from '../context/GameContext';
import AnalysisPanel from '../components/AnalysisPanel';
import MoveHistory from '../components/MoveHistory';
import { LineChart, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Analysis() {
  const { historyStack, openingName, savedGames } = useGame();

  return (
    <div style={{
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '30px 24px',
      minHeight: 'calc(100vh - 120px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '4px' }}>
            Deep Match Analysis
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review move quality, opening performance, and tactical inaccuracies.
          </p>
        </div>

        <Link to="/game" style={{ textDecoration: 'none' }}>
          <button className="btn-emerald">
            <Sparkles size={16} /> New Game Analysis
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnalysisPanel historyStack={historyStack} openingName={openingName} />

          {/* Recent Games History Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px' }}>
              Saved Game Archives (MongoDB / Local)
            </h3>

            {savedGames.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No completed games recorded yet. Play a game in the arena to populate analysis logs!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedGames.slice(0, 5).map((game, idx) => (
                  <div
                    key={game.id || idx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>
                        {game.opening || 'Chess Match'}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(game.date || Date.now()).toLocaleDateString()} • {game.moves?.length || 0} moves
                      </div>
                    </div>

                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      background: game.result === 'win' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: game.result === 'win' ? '#34d399' : '#fb7185'
                    }}>
                      {game.result ? game.result.toUpperCase() : 'COMPLETED'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <MoveHistory />
        </div>
      </div>
    </div>
  );
}
