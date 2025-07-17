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
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teamInfoResult, gamesResult] = await Promise.allSettled([
          fetchTeamInfo(team, year),
          fetchGames(team, year)
        ]);

        if (teamInfoResult.status === 'fulfilled') {
          setTeamInfo(teamInfoResult.value);
        } else {
          setError('Failed to fetch team info');
        }

        if (gamesResult.status === 'fulfilled') {
          setGames(gamesResult.value);
        } else {
          setError(('Failed to fetch game info'));
        }

      } finally {
        setLoading(false);
      }
    };
    
    if (team && year) {
      fetchData();
    }
  }, [team, year]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="season-summary-error">{error}</p>;

  return (
    <div className="season-summary-root">
      <div className="season-summary-content">
        <h2>{teamInfo.name}</h2>
        {teamInfo && (
          <div className="season-summary-record">
            Record: {teamInfo.wins} - {teamInfo.losses}
          </div>
        )}
        <GameTable games={games} />
      </div>
    </div>
  );
}

export default GameResults;
