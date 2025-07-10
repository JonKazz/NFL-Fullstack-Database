import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GameTable from './GameTable';
import { fetchGameInfo, fetchTeamInfo } from '../api';

function GameResults() {
  const [searchParams] = useSearchParams();
  const team = searchParams.get('team');
  const year = searchParams.get('year');
  const [teamName, setTeamName] = useState('');
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamInfo, gameResults] = await Promise.allSettled([
          fetchTeamInfo(team, year),
          fetchGameInfo(team, year)
        ]);

        if (teamInfo.status === 'fulfilled') {
          setTeamName(teamInfo.value.name);
        } else {
          setError('Failed to fetch team info');
        }

        if (gameResults.status === 'fulfilled') {
          setGames(gameResults.value);
        } else {
          setError(prev => (prev ? prev + ' and game info' : 'Failed to fetch game info'));
        }

      } finally {
        setLoading(false);
      }
    };
    if (team && year) fetchData();
  }, [team, year]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!games || games.length === 0) return <p>No game data found.</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{teamName} - {year}</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <GameTable games={games} />
      </div>
    </div>
  );
}

export default GameResults;
