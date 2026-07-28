import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useChess } from '../hooks/useChess';
import { getAISuggestions, checkBackendHealth } from '../services/api';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const chess = useChess();

  // ML Suggestions & Positional Evaluation State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [whiteScore, setWhiteScore] = useState(50);
  const [blackScore, setBlackScore] = useState(50);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  // Backend Connectivity State
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Check Backend Health on Mount
  useEffect(() => {
    async function verifyHealth() {
      const health = await checkBackendHealth();
      setIsBackendOnline(health.online);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch ML Move Recommendations from Flask Backend
  const fetchSuggestions = useCallback(async (currentFen) => {
    const targetFen = currentFen || chess.fen;
    setIsLoadingAI(true);
    try {
      const result = await getAISuggestions(targetFen);
      if (result.success) {
        setAiSuggestions(result.suggestions);
        setWhiteScore(result.white);
        setBlackScore(result.black);
        setIsBackendOnline(true);
      } else {
        setIsBackendOnline(false);
        setAiSuggestions([]);
      }
    } catch (e) {
      setIsBackendOnline(false);
      setAiSuggestions([]);
    } finally {
      setIsLoadingAI(false);
    }
  }, [chess.fen]);

  const value = {
    ...chess,
    aiSuggestions,
    whiteScore,
    blackScore,
    isLoadingAI,
    selectedSuggestion,
    setSelectedSuggestion,
    isBackendOnline,
    fetchSuggestions,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
