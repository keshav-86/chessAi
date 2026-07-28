import { Link } from "react-router-dom";
import React, { useState, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Game() {

  const [game, setGame] = useState(new Chess());
  const [suggestions, setSuggestions] = useState([]);
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [whiteCaptured, setWhiteCaptured] = useState([]);
  const [blackCaptured, setBlackCaptured] = useState([]);

  const pieceSymbols = {
    p: "♙", r: "♖", n: "♘",
    b: "♗", q: "♕", k: "♔"
  };

  // Reset game
  function resetBoard() {
    const fresh = new Chess();
    setGame(fresh);
    setSuggestions([]);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setWhiteScore(0);
    setBlackScore(0);
  }

  // Fetch AI suggestions
  async function getSuggestions() {
    try {
      const fen = game.fen();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen })
      });

      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setWhiteScore(data.white ?? 0);
      setBlackScore(data.black ?? 0);

    } catch (err) {
      console.log(err);
    }
  }

  // Piece drop handler
  const onPieceDrop = (source, target) => {
    const before = new Chess(game.fen());
    const captured = before.get(target);

    const next = new Chess(game.fen());
    const move = next.move({ from: source, to: target, promotion: "q" });

    if (!move) return false;

    if (captured) {
      if (captured.color === "w") setWhiteCaptured(prev => [...prev, captured.type]);
      else setBlackCaptured(prev => [...prev, captured.type]);
    }

    setGame(next);
    setSuggestions([]);
    return true;
  };

  // AI Arrow lines
  const customArrows = useMemo(() => {
    return suggestions
      .map(s => s.uci ? [s.uci.slice(0, 2), s.uci.slice(2, 4)] : null)
      .filter(Boolean);
  }, [suggestions]);

  // UI layout
  return (
    <div
      style={{
        display: "flex",
        padding: "40px",
        backgroundImage: "url('/image3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0,0,0,0.7)",
        backgroundBlendMode: "overlay",
        minHeight: "90vh",
        width: "100vw",
        maxWidth: "1830px",
        margin: "0 auto",
        justifyContent: "center",
        gap: "20px",
        color: "white",
        fontFamily: "Inter, sans-serif"
      }}
    >

      {/* LEFT – Chessboard */}
      <div
        style={{
          padding: "25px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)"
        }}
      >
        <Chessboard
          position={game.fen()}
          boardWidth={650}
          onPieceDrop={onPieceDrop}
          customArrows={customArrows}
        />

        <button
          onClick={getSuggestions}
          style={{
            marginTop: "25px",
            width: "100%",
            padding: "16px",
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            border: "none",
            fontSize: "20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white"
          }}
        >
          🔍 Get AI Suggestions
        </button>
      </div>


      {/* MIDDLE – Scoreboard + Captured */}
      <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "25px" }}>

        <div
          style={{
            padding: "20px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <h3>📊 Score Board</h3>
          <p>White: {whiteScore.toFixed(2)}</p>
          <p>Black: {blackScore.toFixed(2)}</p>
        </div>

        <div
          style={{
            padding: "20px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <h3>⚔️ Captured</h3>

          <b>White:</b>
          <div style={{ fontSize: "26px" }}>
            {whiteCaptured.map((p, i) => <span key={i}>{pieceSymbols[p]}</span>)}
          </div>

          <b style={{ display: "block", marginTop: "10px" }}>Black:</b>
          <div style={{ fontSize: "26px" }}>
            {blackCaptured.map((p, i) => <span key={i}>{pieceSymbols[p]}</span>)}
          </div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}>
  <button
    style={{
      marginBottom: "15px",
      padding: "10px 20px",
      background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
      border: "none",
      color: "white",
      borderRadius: "10px",
      fontSize: "18px",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%"
    }}
  >
    ⬅ Back to Home
  </button>
</Link>

      </div>
      

      {/* RIGHT – AI Best Moves */}
      <div style={{ width: "300px" }}>
        <div
          style={{
            padding: "20px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          
          <h3>🧠 Best AI Moves</h3>

          {suggestions.map((m, i) => (
            <div
  key={i}
  style={{
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <b style={{ fontSize: "18px" }}>
    {i + 1}. {m.san}
  </b>

  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#22c55e" }}>
    {m.percent.toFixed(1)}%
  </span>
</div>

          ))}

          <button
            onClick={resetBoard}
            style={{
              marginTop: "20px",
              padding: "14px",
              width: "100%",
              background: "linear-gradient(90deg, #ef4444, #dc2626)",
              border: "none",
              color: "white",
              borderRadius: "10px",
              fontSize: "18px",
              cursor: "pointer"
            }}
          >
            🔄 Reset Game
          </button>
        </div>
      </div>

    </div>
  );
}
