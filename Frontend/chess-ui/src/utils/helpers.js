/**
 * Helper utilities for AI Chess Bot
 */

export const OPENINGS_DATABASE = [
  { moves: ['e4', 'c5'], name: 'Sicilian Defense', eco: 'B20' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], name: "Ruy Lopez (Spanish Opening)", eco: 'C60' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], name: 'Italian Game', eco: 'C50' },
  { moves: ['e4', 'e6'], name: 'French Defense', eco: 'C00' },
  { moves: ['e4', 'c6'], name: 'Caro-Kann Defense', eco: 'B10' },
  { moves: ['d4', 'd5', 'c4'], name: "Queen's Gambit", eco: 'D06' },
  { moves: ['d4', 'Nf6', 'c4', 'g6'], name: 'King\'s Indian Defense', eco: 'E60' },
  { moves: ['d4', 'Nf6', 'c4', 'e6'], name: 'Nimzo / Queen\'s Indian Defense', eco: 'E00' },
  { moves: ['e4', 'e5'], name: "King's Pawn Game", eco: 'C20' },
  { moves: ['d4', 'd5'], name: "Queen's Pawn Game", eco: 'D00' },
  { moves: ['Nf3'], name: 'Réti Opening', eco: 'A04' },
  { moves: ['c4'], name: 'English Opening', eco: 'A10' }
];

export function detectOpening(sanHistory = []) {
  if (!sanHistory || sanHistory.length === 0) return 'Standard Starting Position';
  
  for (const opening of OPENINGS_DATABASE) {
    if (opening.moves.every((m, idx) => sanHistory[idx] === m)) {
      return `${opening.name} (${opening.eco})`;
    }
  }

  if (sanHistory[0] === 'e4') return "King's Pawn Opening";
  if (sanHistory[0] === 'd4') return "Queen's Pawn Opening";
  return 'Custom Opening / Main Line';
}

export function calculateMaterial(board) {
  if (!board) return { white: [], black: [], balance: 0, whiteScore: 39, blackScore: 39 };

  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  const initialCounts = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  
  const currentWhite = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const currentBlack = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

  const boardArray = board.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = boardArray[r][c];
      if (square) {
        if (square.color === 'w') {
          currentWhite[square.type]++;
        } else {
          currentBlack[square.type]++;
        }
      }
    }
  }

  const whiteCaptured = [];
  const blackCaptured = [];

  let whitePoints = 0;
  let blackPoints = 0;

  Object.keys(pieceValues).forEach(type => {
    const missingBlack = initialCounts[type] - currentBlack[type];
    for (let i = 0; i < missingBlack; i++) {
      whiteCaptured.push(type);
    }
    const missingWhite = initialCounts[type] - currentWhite[type];
    for (let i = 0; i < missingWhite; i++) {
      blackCaptured.push(type);
    }

    whitePoints += currentWhite[type] * pieceValues[type];
    blackPoints += currentBlack[type] * pieceValues[type];
  });

  return {
    whiteCaptured, // Pieces taken by White (Black pieces missing)
    blackCaptured, // Pieces taken by Black (White pieces missing)
    whiteScore: whitePoints,
    blackScore: blackPoints,
    balance: whitePoints - blackPoints
  };
}

export function classifyMove(moveScore = 1.0, isBest = false) {
  if (isBest || moveScore >= 0.90) {
    return { type: 'Brilliant', color: '#10b981', badge: '✦ Brilliant' };
  } else if (moveScore >= 0.70) {
    return { type: 'Best', color: '#3b82f6', badge: '★ Best Move' };
  } else if (moveScore >= 0.40) {
    return { type: 'Good', color: '#8b5cf6', badge: '✓ Good' };
  } else if (moveScore >= 0.20) {
    return { type: 'Inaccuracy', color: '#f59e0b', badge: '?! Inaccuracy' };
  } else {
    return { type: 'Mistake / Blunder', color: '#f43f5e', badge: '?? Blunder' };
  }
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const LOCAL_STORAGE_KEY_GAMES = 'ai_chess_bot_saved_games';
export const LOCAL_STORAGE_KEY_STATS = 'ai_chess_bot_player_stats';

export function getLocalSavedGames() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_GAMES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalGame(game) {
  try {
    const games = getLocalSavedGames();
    games.unshift(game);
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMES, JSON.stringify(games.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save game to localStorage', e);
  }
}

export function getLocalStats() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    gamesPlayed: 12,
    wins: 7,
    losses: 4,
    draws: 1,
    avgAccuracy: 88.5,
    favOpening: 'Sicilian Defense',
    rating: 1450
  };
}

export function updateLocalStats(result, accuracy = 85) {
  try {
    const stats = getLocalStats();
    stats.gamesPlayed += 1;
    if (result === 'win') stats.wins += 1;
    else if (result === 'loss') stats.losses += 1;
    else stats.draws += 1;

    stats.avgAccuracy = Math.round((stats.avgAccuracy * (stats.gamesPlayed - 1) + accuracy) / stats.gamesPlayed * 10) / 10;
    localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(stats));
    return stats;
  } catch (e) {
    return getLocalStats();
  }
}
