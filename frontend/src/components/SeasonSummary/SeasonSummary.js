import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './SeasonSummary.module.css';
import { fetchFullSeason, fetchTeamInfo } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function GameResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamId = searchParams.get('teamId');
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
          fetchTeamInfo(teamId, year),
          fetchFullSeason(teamId, year)
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

    if (teamId && year) {
      fetchData();
    }
  }, [teamId, year]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles['season-summary-error']}>{error}</p>;

  const { logo, wins, losses, division, divisionRank, playoffs, coach, offCoordinator,
          defCoordinator, pointsFor, pointsAgainst } = teamInfo;
  const teamName = TEAM_MAP[teamId]?.name
  
  return (
    <div className={styles.pageBackground}>
      <div className={styles['container']}>
        <div className={styles['header']}>
          <div className={styles['team-info']}>
            <div className={styles['team-logo']}>{logo ? <img src={logo} alt={teamName} style={{width: '80px', height: '80px', borderRadius: '50%'}} /> : teamName?.slice(0,2)}</div>
            <div className={styles['team-details']}>
              <h1>{year} {teamName}</h1>
            </div>
          </div>
          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <div className={styles['stat-value']}>{wins}-{losses}</div>
              <div className={styles['stat-label']}>Record</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-value']}>{divisionRank || '-'}</div>
              <div className={styles['stat-label']}>{division || 'Division'}</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={`${styles['stat-value']} ${styles['playoffs-value']}`}>{playoffs || '-'}</div>
              <div className={styles['stat-label']}>Playoffs</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-value']}>{pointsFor}</div>
              <div className={styles['stat-label']}>Points For</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-value']}>{pointsAgainst}</div>
              <div className={styles['stat-label']}>Points Against</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
              <div className={styles['coach-info']}>
                  <div className={styles['coaching-staff']}>
                      <div className={styles['coach-card']}>
                          <div className={styles['coach-name']}>{coach}</div>
                          <div className={styles['coach-title']}>Head Coach</div>
                      </div>
                      <div className={styles['coach-card']}>
                          <div className={styles['coach-name']}>{offCoordinator}</div>
                          <div className={styles['coach-title']}>Offensive Coordinator</div>
                      </div>
                      <div className={styles['coach-card']}>
                          <div className={styles['coach-name']}>{defCoordinator}</div>
                          <div className={styles['coach-title']}>Defensive Coordinator</div>
                      </div>
                  </div>
              </div>
          </div>

        <div className={styles.section}>
          <h2 className={styles['section-title']}>Season Schedule & Results</h2>
          <div className={styles['games-grid']}>
            
            {games.map((game, idx) => {
              console.log(game);
              const { gameInfo, gameStats } = game;
              const myStats = gameStats.find(gs => gs.id.teamId === teamId);
              const oppStats = gameStats.find(gs => gs.id.teamId !== teamId);
              const isHome = gameInfo.homeTeamId === teamId;
              return (
                <div
                  className={styles['game-card']}
                  onClick={() => navigate(`/game?gameId=${gameInfo.gameId}`)}
                  key={gameInfo.gameId || idx}
                >
                  <div className={styles['game-header']}>
                    <div className={styles.week}>Week {gameInfo.seasonWeek}</div>
                    <div className={styles['game-date']}>{gameInfo.date}</div>
                  </div>
                  <div className={styles.matchup}>
                    <div className={styles['team-ss']}>
                      <div className={styles['team-name-city']}>{TEAM_MAP[myStats.id.teamId]?.city}</div>
                      <div className={styles.score}>{myStats.pointsTotal}</div>
                    </div>
                    <div className={styles['vs-ss']}>{isHome ? 'vs' : '@'}</div>
                    <div className={styles['team-ss']}>
                      <div className={styles.score}>{oppStats.pointsTotal}</div>
                      <div className={styles['team-name-city']}>{TEAM_MAP[oppStats.id.teamId]?.city}</div>
                    </div>
                  </div>
                  {/* ...other info... */}
                </div>
              );
            })}
          </div>
        </div>

        {/*
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Team Roster</h2>
          <div className={styles['players-section']}>
            {roster && Object.entries(roster).map(([position, players]) => (
              <div className={styles['position-group']} key={position}>
                <h3 className={styles['position-title']}>{position}</h3>
                <div className={styles['player-list']}>
                  {players.map((player) => (
                    <div className={styles.player} key={player.name}>
                      <div className={styles['player-number']}>{player.number}</div>
                      <div className={styles['player-name']}>{player.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

      </div>
    </div>
  );
}

export default GameResults;
