import React from 'react';
import { useGame } from '../context/GameContext';
import GameHeader from '../components/GameHeader';
import ChessBoardComponent from '../components/ChessBoard';
import PlayerCard from '../components/PlayerCard';
import CapturedPieces from '../components/CapturedPieces';
import ScoreBoard from '../components/ScoreBoard';
import SuggestionPanel from '../components/SuggestionPanel';
import MoveHistory from '../components/MoveHistory';

export default function Game() {
  const {
    turn,
    material,
    whiteScore,
    blackScore,
  } = useGame();

  return (
    <div style={{
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '24px 20px 40px',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* 1. TOP PLAYER HEADER BAR (Side-by-Side Player 1 & Player 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <PlayerCard
          name="Player 1 (White)"
          rating={1500}
          color="w"
          isTurn={turn === 'w'}
          capturedPieces={material.whiteCaptured}
          materialAdvantage={material.balance > 0 ? material.balance : 0}
        />

        <PlayerCard
          name="Player 2 (Black)"
          rating={1500}
          color="b"
          isTurn={turn === 'b'}
          capturedPieces={material.blackCaptured}
          materialAdvantage={material.balance < 0 ? Math.abs(material.balance) : 0}
        />
      </div>

      {/* 2. MIDDLE MAIN ARENA (3 Columns: Score Board | Chessboard | Suggested Moves) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '310px 1fr 340px',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Score Board */}
        <ScoreBoard whiteScore={whiteScore} blackScore={blackScore} />

        {/* Center Column: Centered Chessboard */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <ChessBoardComponent />
        </div>

        {/* Right Column: Suggested Moves */}
        <SuggestionPanel />
      </div>

      {/* 3. BOTTOM SECTION (Captured Material -> Move History -> Action Controls) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CapturedPieces
          whiteCaptured={material.whiteCaptured}
          blackCaptured={material.blackCaptured}
          balance={material.balance}
        />

        <MoveHistory />

        <GameHeader />
      </div>
    </div>
  );
}
