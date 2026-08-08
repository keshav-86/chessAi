# ♚ AI Chess Bot - Master ML Chess Platform
♟️ Chess AI

## ✨ Features

- ♟️ Play chess against an AI opponent
- 🤖 AI-powered move prediction
- 📊 Chess position analysis
- ⚡ Fast and responsive gameplay
- 🎨 Clean and interactive chess board UI
- 🔌 React frontend connected with Flask API

## 🛠️ Tech Stack

**Frontend:** React, Vite, Chess.js
**Backend:** Flask, Python
**AI/ML:** TensorFlow / Keras
**Database:** MongoDB

A production-ready SaaS AI Chess application built with **React 19**, **Vite**, **Chess.js**, **Framer Motion**, and a **TensorFlow/Keras Machine Learning model** hosted on a **Flask REST API** with optional **MongoDB** storage.

---

## 🚀 Key Features

- **TensorFlow ML Intelligence**: Position evaluation & move recommendations calculated strictly by a trained Convolutional Neural Network model (`my_chess_model_2_75.keras`).
- **Chess.com & Lichess SaaS UI**: Glassmorphism dark design system with dynamic evaluation bar, move arrows, sound effects, checkmate confetti, and interactive legal move indicators.
- **Strict Architectural Boundary**: Frontend never predicts moves or calculates AI scores locally; it consumes Flask API predictions via Axios.
- **Post-Game Analysis Engine**: Classifies every move into **Brilliant**, **Best**, **Good**, or **Blunder** metrics and identifies opening repertoire.
- **MongoDB & Local Storage Fallback**: Game history and player ELO ratings persist to MongoDB when online, with seamless fallback to client-side `localStorage`.

---

## 🏗️ Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  REACT 19 FRONTEND                                |
|  [Home Page]       [Play Arena Page]       [Analysis Page]       [Profile Page]   |
|         |                  |                      |                     |         |
|         +------------------+----------+-----------+---------------------+         |
|                                       |                                           |
|                            [GameContext API Provider]                             |
|                                       |                                           |
|                     +-----------------+-----------------+                         |
|                     |                                   |                         |
|             [useChess Hook]                     [Axios API Client]                |
|       (Chess.js Legal Engine)                           |                         |
+---------------------------------------------------------|-------------------------+
                                                          | HTTP POST /suggest
                                                          | HTTP GET /health
                                                          v
+-----------------------------------------------------------------------------------+
|                                   FLASK BACKEND                                   |
|                                   (backend.py)                                    |
|                                         |                                         |
|                  +----------------------+----------------------+                  |
|                  |                                             |                  |
|          [python-chess]                              [TensorFlow Engine]          |
|      (Board Matrix Conversion)                 (my_chess_model_2_75.keras)       |
|                                                         |                         |
|                                                   [move_to_int.pkl]               |
+-----------------------------------------------------------------------------------+
                                                          |
                                                          v (Optional Sync)
                                                 [MongoDB Database]
                                                 (db: chess_bot_db)
```

---

## 📁 Project Directory Structure

```
Chess_Bot/
├── Backend/
│   ├── backend.py                  # Flask REST Server (Port 8000)
│   ├── my_chess_model_2_75.keras   # Trained TensorFlow/Keras CNN Model
│   ├── move_to_int.pkl             # Move Index Mapping Dictionary
│   ├── requirement.txt             # Python Dependencies
│   └── app.py                      # Backup Flask API Server
├── Frontend/
│   └── chess-ui/
│       ├── public/                 # Static Assets
│       ├── src/
│       │   ├── components/
│       │   │   ├── ChessBoard.jsx       # Interactive Board & Arrow Renderer
│       │   │   ├── SuggestionPanel.jsx  # AI Move Recommendation List
│       │   │   ├── SuggestionCard.jsx   # Interactive Move Preview Card
│       │   │   ├── ScoreBoard.jsx       # Win Probability & Positional Control
│       │   │   ├── CapturedPieces.jsx   # Material Advantage Counter
│       │   │   ├── MoveHistory.jsx      # Move Replay History Table
│       │   │   ├── GameHeader.jsx       # Control Bar (Flip, Undo, Redo, Reset)
│       │   │   ├── EvaluationBar.jsx    # Dynamic White vs Black Win Rate Gauge
│       │   │   ├── PlayerCard.jsx       # Player/Bot Avatars & Status Badges
│       │   │   ├── AnalysisPanel.jsx    # Move Accuracy & Blunder Classifier
│       │   │   ├── LoadingSpinner.jsx   # Glass Inference Spinner
│       │   │   ├── Navbar.jsx           # SaaS Top Navigation & Status Pill
│       │   │   └── Footer.jsx           # Platform Footer & Tech Badges
│       │   ├── pages/
│       │   │   ├── Home.jsx             # Dark SaaS Landing Hero Page
│       │   │   ├── Game.jsx             # Main Arena Play Page
│       │   │   ├── Analysis.jsx         # Post-Game Review Page
│       │   │   └── Profile.jsx          # Player Profile & Match Logs
│       │   ├── services/
│       │   │   └── api.js               # Axios Client & Backend API Methods
│       │   ├── hooks/
│       │   │   └── useChess.js          # Custom Chess Hook with Web Audio
│       │   ├── context/
│       │   │   └── GameContext.jsx      # Global React Context Provider
│       │   ├── utils/
│       │   │   └── helpers.js           # Opening Detector & Formatters
│       │   ├── App.jsx                  # Main Router Setup
│       │   ├── index.css                # Glassmorphism SaaS Styling
│       │   └── main.jsx                 # React 19 Root Entrypoint
│       ├── index.html                   # HTML Shell with Google Fonts
│       ├── package.json                 # Frontend Dependencies
│       └── vite.config.js               # Rollup Chunk Optimization
└── README.md                            # Comprehensive Platform Documentation
```

---

## ⚡ Tech Stack

- **Frontend**: React 19, Vite 7, React Router DOM 7, Framer Motion, Chess.js, React Chessboard, Axios, Lucide React, Canvas Confetti.
- **Backend**: Python 3.x, Flask, Flask-CORS, TensorFlow 2.x, NumPy, Pickle, python-chess.
- **Database**: MongoDB (optional with client-side localStorage fallback).

---

## 🔧 Installation & Setup Guide

### 1. Backend Setup (Flask REST Server)

Ensure Python 3.9+ is installed, then launch the Flask server:

```bash
cd Backend
pip install flask flask-cors tensorflow numpy python-chess pymongo
python backend.py
```

The Flask server will start at:
- **API Endpoint**: `http://127.0.0.1:8000/suggest`
- **Health Check**: `http://127.0.0.1:8000/health`

### 2. Frontend Setup (React SaaS Client)

Navigate to `Frontend/chess-ui` and start Vite:

```bash
cd Frontend/chess-ui
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 API Documentation

### `POST /suggest`
Sends the current board FEN string to receive top TensorFlow model move predictions.

**Request Payload:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
}
```

**Response Payload:**
```json
{
  "suggestions": [
    {
      "uci": "c7c5",
      "san": "c5",
      "score": 0.9412,
      "percent": 100
    },
    {
      "uci": "e7e5",
      "san": "e5",
      "score": 0.8850,
      "percent": 94
    }
  ],
  "white": 48,
  "black": 52
}
```

### `GET /health`
Returns backend service operational status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "mappings_count": 1828,
  "mongo_available": false
}
```

---

## 🎓 Presentation Notes for Demonstrations & Placement Interviews

1. **Machine Learning Board Representation**:
   - The board is encoded into an `(8, 8, 12)` 3D binary matrix representing 6 piece types × 2 colors.
   - The TensorFlow Convolutional Neural Network returns logit probabilities across 1,828 distinct encoded UCI moves.
2. **Architectural Separation**:
   - Frontend relies on `chess.js` exclusively for legal rule validation and FEN generation.
   - Positional evaluations and move recommendations originate strictly from the backend ML model.
3. **Resilience & Fallback Architecture**:
   - Includes graceful fallbacks for MongoDB database connections and backend offline states.

---

## 🔮 Future Improvements

- Add Stockfish depth comparison mode alongside TensorFlow ML predictions.
- Support real-time WebSocket multiplayer match rooms.
- Integrate PGN file upload for batch game analysis.
