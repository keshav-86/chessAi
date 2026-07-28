import React from 'react';
import { Brain, Lightbulb, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import LoadingSpinner from './LoadingSpinner';

export default function SuggestionPanel() {
  const {
    fen,
    aiSuggestions,
    isLoadingAI,
    selectedSuggestion,
    setSelectedSuggestion,
    isBackendOnline,
    makeMove
  } = useGame();

  // Fallback moves for demonstration matching screenshot style if empty
  const displaySuggestions = aiSuggestions && aiSuggestions.length > 0
    ? aiSuggestions
    : [
        { uci: 'g1f3', san: 'Nf3', percent: 78, score: 0.78 },
        { uci: 'd2d4', san: 'd4', percent: 65, score: 0.65 },
        { uci: 'g2g3', san: 'g3', percent: 57, score: 0.57 },
        { uci: 'f1c4', san: 'Bc4', percent: 49, score: 0.49 },
        { uci: 'c2c3', san: 'c3', percent: 41, score: 0.41 }
      ];

  const handleSelectSuggestion = (sug) => {
    if (selectedSuggestion?.uci === sug.uci) {
      if (sug.uci && sug.uci.length >= 4) {
        makeMove({ from: sug.uci.slice(0, 2), to: sug.uci.slice(2, 4), promotion: 'q' });
        setSelectedSuggestion(null);
      }
    } else {
      setSelectedSuggestion(sug);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Brain size={22} color="var(--accent-purple)" />
        <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 700 }}>
          Suggested Moves
        </h3>
      </div>

      {!isBackendOnline && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            fontSize: "0.78rem",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle size={14} />
          <span>{backendOnline ? "Backend Online" : "Backend Offline"}</span>
        </div>
      )}

      {isLoadingAI ? (
        <LoadingSpinner label="Evaluating position..." />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: 1,
          }}
        >
          {displaySuggestions.slice(0, 5).map((sug, idx) => {
            const isSelected = selectedSuggestion?.uci === sug.uci;
            return (
              <div
                key={sug.uci || idx}
                onClick={() => handleSelectSuggestion(sug)}
                style={{
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  background: isSelected
                    ? "rgba(59, 130, 246, 0.15)"
                    : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {idx + 1}. {sug.san}
                  </span>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      color: "var(--accent-emerald)",
                    }}
                  >
                    {sug.percent}%
                  </span>
                </div>

                {/* Progress bar under move */}
                <div
                  style={{
                    height: "6px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${sug.percent}%`,
                      height: "100%",
                      background: isSelected
                        ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                        : "linear-gradient(90deg, #3b82f6, #2563eb)",
                      borderRadius: "3px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tip Card at Bottom */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px 14px",
          borderRadius: "10px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <Lightbulb
          size={18}
          color="var(--accent-amber)"
          style={{ marginTop: "2px", flexShrink: 0 }}
        />
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#fbbf24",
              display: "block",
              marginBottom: "2px",
            }}
          >
            Tip
          </span>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Develop your pieces and control the center.
          </p>
        </div>
      </div>
    </div>
  );
}
