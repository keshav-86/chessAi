import React from 'react';
import { Undo2, Redo2, RotateCw, RefreshCw, Lightbulb } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function GameHeader() {
  const {
    undoMove,
    redoMove,
    resetGame,
    toggleBoardOrientation,
    historyStack,
    redoStack,
    fetchSuggestions,
    fen,
    isLoadingAI
  } = useGame();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '12px',
      width: '100%',
      marginTop: '12px'
    }}>
      <button
        onClick={undoMove}
        disabled={historyStack.length === 0}
        className="btn-secondary"
        style={{ padding: '12px', opacity: historyStack.length === 0 ? 0.5 : 1 }}
      >
        <Undo2 size={16} /> Undo
      </button>

      <button
        onClick={redoMove}
        disabled={redoStack.length === 0}
        className="btn-secondary"
        style={{ padding: '12px', opacity: redoStack.length === 0 ? 0.5 : 1 }}
      >
        <Redo2 size={16} /> Redo
      </button>

      <button
        onClick={toggleBoardOrientation}
        className="btn-secondary"
        style={{ padding: '12px' }}
      >
        <RotateCw size={16} /> Flip Board
      </button>

      <button
        onClick={resetGame}
        className="btn-danger"
        style={{ padding: '12px' }}
      >
        <RefreshCw size={16} /> Reset Game
      </button>

      <button
        onClick={() => fetchSuggestions(fen)}
        disabled={isLoadingAI}
        className="btn-primary"
        style={{ padding: '12px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
      >
        <Lightbulb size={16} /> Get Suggestions
      </button>
    </div>
  );
}
