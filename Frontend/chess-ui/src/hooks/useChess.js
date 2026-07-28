import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { calculateMaterial, detectOpening } from '../utils/helpers';

// Synthesize pleasant sound effects using Web Audio API (no external MP3 downloads required)
function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'move') {
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'capture') {
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'check') {
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'gameover') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Ignore audio context autoplay errors
  }
}

export function useChess() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(() => game.fen());
  const [historyStack, setHistoryStack] = useState([]); // [{ fen, move, san }]
  const [redoStack, setRedoStack] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [lastMove, setLastMove] = useState(null);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Derived Game Status Flags
  const turn = game.turn(); // 'w' or 'b'
  const isCheck = game.inCheck();
  const isCheckmate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw() || game.isThreefoldRepetition() || game.isInsufficientMaterial();
  const isGameOver = game.isGameOver();

  // Material calculation
  const material = useMemo(() => calculateMaterial(game), [fen]);
  const openingName = useMemo(() => detectOpening(game.history()), [fen]);

  // Compute legal square dot highlights for a selected square
  const getMoveOptions = useCallback((square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.forEach((m) => {
      newSquares[m.to] = {
        background:
          game.get(m.to) && game.get(m.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(244,63,94,0.8) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.7) 30%, transparent 30%)',
        borderRadius: '50%',
      };
    });
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
    setOptionSquares(newSquares);
    return true;
  }, [game]);

  // Execute Move
  const makeMove = useCallback((moveInput) => {
    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move(moveInput);
      if (!move) return false;

      setGame(gameCopy);
      const newFen = gameCopy.fen();
      setFen(newFen);
      setLastMove({ from: move.from, to: move.to });
      setRedoStack([]);
      setSelectedSquare(null);
      setOptionSquares({});

      setHistoryStack((prev) => [
        ...prev,
        { fen: newFen, move, san: move.san, uci: `${move.from}${move.to}` }
      ]);

      if (soundEnabled) {
        if (gameCopy.isGameOver()) playSound('gameover');
        else if (gameCopy.inCheck()) playSound('check');
        else if (move.captured) playSound('capture');
        else playSound('move');
      }

      return true;
    } catch (e) {
      return false;
    }
  }, [game, soundEnabled]);

  // Reset Game
  const resetGame = useCallback(() => {
    const fresh = new Chess();
    setGame(fresh);
    setFen(fresh.fen());
    setHistoryStack([]);
    setRedoStack([]);
    setLastMove(null);
    setSelectedSquare(null);
    setOptionSquares({});
    if (soundEnabled) playSound('move');
  }, [soundEnabled]);

  // Undo Move
  const undoMove = useCallback(() => {
    if (historyStack.length === 0) return;
    const historyCopy = [...historyStack];
    const undone = historyCopy.pop();

    const previousFen = historyCopy.length > 0 ? historyCopy[historyCopy.length - 1].fen : new Chess().fen();
    const gameCopy = new Chess(previousFen);

    setGame(gameCopy);
    setFen(previousFen);
    setHistoryStack(historyCopy);
    setRedoStack((prev) => [undone, ...prev]);
    setLastMove(historyCopy.length > 0 ? { from: historyCopy[historyCopy.length - 1].move.from, to: historyCopy[historyCopy.length - 1].move.to } : null);
    setSelectedSquare(null);
    setOptionSquares({});
  }, [historyStack]);

  // Redo Move
  const redoMove = useCallback(() => {
    if (redoStack.length === 0) return;
    const redoCopy = [...redoStack];
    const redone = redoCopy.shift();

    const gameCopy = new Chess(redone.fen);
    setGame(gameCopy);
    setFen(redone.fen);
    setHistoryStack((prev) => [...prev, redone]);
    setRedoStack(redoCopy);
    setLastMove({ from: redone.move.from, to: redone.move.to });
  }, [redoStack]);

  // Flip Board
  const toggleBoardOrientation = useCallback(() => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  return {
    game,
    fen,
    turn,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    isGameOver,
    historyStack,
    redoStack,
    lastMove,
    selectedSquare,
    optionSquares,
    boardOrientation,
    material,
    openingName,
    soundEnabled,
    setSoundEnabled,
    setSelectedSquare,
    setOptionSquares,
    getMoveOptions,
    makeMove,
    resetGame,
    undoMove,
    redoMove,
    toggleBoardOrientation,
  };
}
