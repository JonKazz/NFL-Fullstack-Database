import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GameTable from './GameTable';

function GameResults() {
  const { state } = useLocation();
  const { team, year, games } = state || {};
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/teams/info?team=${team}&year=${year}`);
        const data = await res.json();
        setTeamName(data.name);
      } catch (error) {
        console.error('Failed to fetch team info:', error);
      }
    };

    if (team && year) fetchTeamName();
  }, [team, year]);

  if (!games) return <p>No game data provided.</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{teamName || team.toUpperCase()} - {year}</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <GameTable games={games} />
      </div>
    </div>
  );
}

export default GameResults;
