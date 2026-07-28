import React from "react";
import { Link } from "react-router-dom";

export default function CoverPage() {
  return (
    <div
      style={{
        height: "95vh",
        width: "97.5vw",
       backgroundImage: "url('/image.png')",
       backgroundSize: "cover",
       backgroundPosition: "center",
       backgroundRepeat: "no-repeat",

backgroundColor: "rgba(0,0,0,0.7)",
backgroundBlendMode: "overlay",
// add premium dark overlay
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "overlay",

        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "70px", fontWeight: "900", marginBottom: "20px" }}>
        ♟️MoveMaster AI: Chess Intelligence
      </h1>

      <p style={{ fontSize: "22px", opacity: 0.8, maxWidth: "700px" }}>
        Play intelligent chess powered by real-time machine learning suggestions.
      </p>

      <Link to="/game">
        <button
          style={{
            marginTop: "40px",
            padding: "18px 40px",
            fontSize: "26px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 6px 20px rgba(34,197,94,0.4)",
          }}
        >
          ▶ Play Game
        </button>
      </Link>
    </div>
  );
}
