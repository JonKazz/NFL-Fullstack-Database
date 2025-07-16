import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GameTable from '../GamesTable/GameTable';
import { fetchGames, fetchTeamInfo } from '../../api/fetches';

function GameResults() {
  const [searchParams] = useSearchParams();
  const team = searchParams.get('team');
  const year = searchParams.get('year');
  const [teamInfo, setTeamInfo] = useState(null);
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamInfoResult, gameResults] = await Promise.allSettled([
          fetchTeamInfo(team, year),
          fetchGames(team, year)
        ]);

        if (teamInfoResult.status === 'fulfilled') {
          setTeamInfo(teamInfoResult.value);
        } else {
          setError('Failed to fetch team info');
        }

        console.log(gameResults.status);

        if (gameResults.status === 'fulfilled') {
          setGames(gameResults.value);
        } else {
          setError(prev => (prev ? prev + ' and game infi' : 'Failed to fetch game infooo'));
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
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: '100vh' }}>
      <div style={{ width: '800px', marginLeft: '40px', textAlign: 'left' }}>
        <h2>{teamInfo ? `${teamInfo.name} - ${year}` : `${team} - ${year}`}</h2>
        {teamInfo && (
          <div style={{ fontWeight: 'bold', marginBottom: '1em' }}>
            Record: {teamInfo.wins} - {teamInfo.losses}
          </div>
        )}
        <GameTable games={games} />
      </div>
    </div>
  );
}

export default GameResults;
