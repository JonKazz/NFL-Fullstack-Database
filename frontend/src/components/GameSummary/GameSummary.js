import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './GameSummary.css';
import { fetchGame } from '../../api/fetches';

function GameSummary() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const teamId = searchParams.get('teamId');
  const [gameInfo, setGameInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getGameInfo() {
      try {
        const result = await fetchGame(gameId, teamId);
        setGameInfo(result);
      } catch (err) {
        setError('Failed to fetch game info');
      }
    }
    
    if (gameId && teamId) {
      getGameInfo();
    }
  }, [gameId, teamId]);

  if (error) return <div className="game-summary-container">{error}</div>;
  if (!gameInfo) return <div className="game-summary-container">Loading...</div>;

  return (
    <div className="game-summary-container">
      <div>Game ID: {gameId}</div>
      <div>Team ID: {teamId}</div>
      <div className="team team-left">
        <div className="team-name">{teamId}</div>
        <div className="team-score">{gameInfo.pointsFor}</div>
      </div>
      <div className="vs">vs</div>
      <div className="team team-right">
        <div className="team-name">{gameInfo.opponent}</div>
        <div className="team-score">{gameInfo.pointsAgainst}</div>
      </div>
    </div>
  );
}

export default GameSummary;
