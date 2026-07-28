import React, { useMemo, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChessBoardComponent() {
  const {
    fen,
    makeMove,
    optionSquares,
    selectedSquare,
    setSelectedSquare,
    getMoveOptions,
    setOptionSquares,
    lastMove,
    boardOrientation,
    selectedSuggestion,
    aiSuggestions,
    isCheckmate,
    isStalemate,
    isDraw,
    turn,
    resetGame
  } = useGame();

  // Confetti effect on victory
  useEffect(() => {
    if (isCheckmate) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isCheckmate]);

  // Compute AI Arrow overlays for react-chessboard
  const customArrows = useMemo(() => {
    const arrows = [];
    if (selectedSuggestion?.uci?.length >= 4) {
      const startSquare = selectedSuggestion.uci.slice(0, 2);
      const endSquare = selectedSuggestion.uci.slice(2, 4);
      arrows.push({ startSquare, endSquare, color: 'rgba(59, 130, 246, 0.95)' });
    } else if (aiSuggestions?.length > 0) {
      const topMove = aiSuggestions[0];
      if (topMove?.uci?.length >= 4) {
        const startSquare = topMove.uci.slice(0, 2);
        const endSquare = topMove.uci.slice(2, 4);
        arrows.push({ startSquare, endSquare, color: 'rgba(16, 185, 129, 0.9)' });
      }
    }
    return arrows;
  }, [selectedSuggestion, aiSuggestions]);

  // Custom square styles for last move & legal move dots
  const customSquareStyles = useMemo(() => {
    const styles = { ...optionSquares };

    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: 'rgba(255, 255, 0, 0.35)' };
      styles[lastMove.to] = { backgroundColor: 'rgba(255, 255, 0, 0.35)' };
    }

    return styles;
  }, [optionSquares, lastMove]);

  // Piece drop handler supporting both object ({ sourceSquare, targetSquare }) and positional arguments
  const onPieceDrop = (arg1, arg2) => {
    let source = '';
    let target = '';

    if (typeof arg1 === 'object' && arg1 !== null) {
      source = arg1.sourceSquare;
      target = arg1.targetSquare;
    } else {
      source = arg1;
      target = arg2;
    }

    if (!source || !target) return false;

    const success = makeMove({
      from: source,
      to: target,
      promotion: 'q'
    });
    return Boolean(success);
  };

  // Square click handler supporting both object ({ square }) and positional arguments
  const onSquareClick = (arg1) => {
    const square = typeof arg1 === 'object' && arg1 !== null ? arg1.square : arg1;
    if (!square) return;

    if (!selectedSquare) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setSelectedSquare(square);
    } else {
      const move = makeMove({
        from: selectedSquare,
        to: square,
        promotion: 'q'
      });

      if (!move) {
        const hasMoves = getMoveOptions(square);
        if (hasMoves) setSelectedSquare(square);
        else {
          setSelectedSquare(null);
          setOptionSquares({});
        }
      }
    }
  };

  const boardOptions = {
    position: fen,
    onPieceDrop,
    onSquareClick,
    squareStyles: customSquareStyles,
    arrows: customArrows,
    boardOrientation,
    boardStyle: {
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
    },
    darkSquareStyle: { backgroundColor: '#475569' },
    lightSquareStyle: { backgroundColor: '#cbd5e1' },
    animationDurationInMs: 250,
    allowDragging: !isCheckmate && !isStalemate
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '620px', margin: '0 auto' }}>
      <div className="glass-panel" style={{
        padding: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <Chessboard options={boardOptions} {...boardOptions} />
      </div>

      {/* Checkmate / Stalemate Game Over Modal */}
      <AnimatePresence>
        {(isCheckmate || isStalemate || isDraw) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="modal-overlay"
          >
            <div className="glass-panel" style={{
              padding: '36px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              border: '1px solid var(--accent-blue)',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: isCheckmate
                  ? 'linear-gradient(135deg, var(--accent-emerald), #059669)'
                  : 'linear-gradient(135deg, var(--accent-amber), #d97706)',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
              }}>
                <Trophy size={32} color="#ffffff" />
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '8px' }}>
                {isCheckmate
                  ? turn === 'w' ? 'Black Wins by Checkmate!' : 'White Wins by Checkmate!'
                  : 'Game Draw'}
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                {isCheckmate
                  ? 'Outstanding tactical victory! Review move analysis or challenge the AI again.'
                  : 'The game ended in a draw (Stalemate / Insufficient Material).'}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={resetGame} className="btn-primary">
                  <RefreshCw size={18} /> Play Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
