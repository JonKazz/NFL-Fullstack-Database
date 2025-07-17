import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SeasonSummary.css';
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
          setError('Failed to fetch team infooo');
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

  const { name, logo, wins, losses, division, coach, pointsFor, pointsAgainst } = teamInfo;

  return (
    <div className="container">
      <div className="header">
        <div className="team-info">
          <div className="team-logo">{logo ? <img src={logo} alt={name} style={{width: '80px', height: '80px', borderRadius: '50%'}} /> : name?.slice(0,2)}</div>
          <div className="team-details">
            <h1>{name}</h1>
            <div className="season-year">{year} Season</div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{wins}-{losses}</div>
            <div className="stat-label">Record</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{teamInfo.divisionRank || '-'}</div>
            <div className="stat-label">{division || 'Division'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value playoffs-value">{teamInfo.playoffs || '-'}</div>
            <div className="stat-label">Playoffs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pointsFor}</div>
            <div className="stat-label">Points For</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pointsAgainst}</div>
            <div className="stat-label">Points Against</div>
          </div>
        </div>
      </div>

      <div class="section">
            <div class="coach-info">
                <div class="coaching-staff">
                    <div class="coach-card">
                        <div class="coach-name">{coach}</div>
                        <div class="coach-title">Head Coach</div>
                    </div>
                    <div class="coach-card">
                        <div class="coach-name">{teamInfo.offCoordinator}</div>
                        <div class="coach-title">Offensive Coordinator</div>
                    </div>
                    <div class="coach-card">
                        <div class="coach-name">{teamInfo.defCoordinator}</div>
                        <div class="coach-title">Defensive Coordinator</div>
                    </div>
                </div>
            </div>
        </div>

      <div className="section">
        <h2 className="section-title">Season Schedule & Results</h2>
        <div className="games-grid">
          {games.map((game, idx) => (
            <div className="game-card" key={game.gameId || idx}>
              <div className="game-header">
                <div className="week">Week {game.seasonWeek}</div>
                <div className="game-date">{game.date}</div>
              </div>
              <div className="matchup">
                <div className="team">
                  <div className="team-name">{game.team}</div>
                  <div className="score">{game.pointsFor}</div>
                </div>
                <div className="vs">{game.homeOrAway === 'AWAY' ? '@' : 'vs'}</div>
                <div className="team">
                  <div className="score">{game.pointsAgainst}</div>
                  <div className="team-name">{game.opponent}</div>
                </div>
              </div>
              <div className={`game-result ${game.result === 'W' ? 'win' : 'loss'}`}>
                {game.result} {game.pointsFor}-{game.pointsAgainst}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {/*
      <div className="section">
        <h2 className="section-title">Team Roster</h2>
        <div className="players-section">
          {roster && Object.entries(roster).map(([position, players]) => (
            <div className="position-group" key={position}>
              <h3 className="position-title">{position}</h3>
              <div className="player-list">
                {players.map((player) => (
                  <div className="player" key={player.name}>
                    <div className="player-number">{player.number}</div>
                    <div className="player-name">{player.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      */}


    </div>
  );
}

export default GameResults;
