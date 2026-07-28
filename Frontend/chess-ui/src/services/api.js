import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request ML move suggestions from Flask backend
 * @param {string} fen - Current chess FEN string
 */
export async function getAISuggestions(fen) {
  try {
    const response = await apiClient.post('/suggest', { fen });
    return {
      success: true,
      suggestions: response.data.suggestions || [],
      white: response.data.white ?? 50,
      black: response.data.black ?? 50,
    };
  } catch (error) {
    console.warn('Backend API request failed, returning graceful fallback:', error.message);
    return {
      success: false,
      suggestions: [],
      white: 50,
      black: 50,
      error: error.message,
    };
  }
}

/**
 * Health check endpoint to test Flask backend connectivity
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/health');
    return {
      online: response.data.status === 'healthy',
      details: response.data,
    };
  } catch (error) {
    return {
      online: false,
      error: error.message,
    };
  }
}

/**
 * Save game record to MongoDB (or local fallback)
 */
export async function saveGameRecord(gameData) {
  try {
    const response = await apiClient.post('/api/games', gameData);
    return response.data;
  } catch (error) {
    return { status: 'fallback_local' };
  }
}

/**
 * Retrieve saved game records
 */
export async function getSavedGames() {
  try {
    const response = await apiClient.get('/api/games');
    return response.data.games || [];
  } catch (error) {
    return [];
  }
}
