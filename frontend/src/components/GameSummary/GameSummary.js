import React from 'react';
import './GameSummary.css';

function GameSummary({ homeTeam, awayTeam, homeScore, awayScore }) {
  return (
    <div className="game-summary-container">
      <div className="team team-left">
        <div className="team-name">{homeTeam}</div>
        <div className="team-score">{homeScore}</div>
      </div>
      <div className="vs">vs</div>
      <div className="team team-right">
        <div className="team-name">{awayTeam}</div>
        <div className="team-score">{awayScore}</div>
      </div>
    </div>
  );
}

export default GameSummary;
