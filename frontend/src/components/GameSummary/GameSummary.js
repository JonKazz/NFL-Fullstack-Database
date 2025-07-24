import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './GameSummary.module.css';
import { fetchGame } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function GameSummary() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getGameData() {
      try {
        const result = await fetchGame(gameId);
        setGameData(result);
      } catch (err) {
        setError('Failed to fetch game info');
      }
    }
    if (gameId) {
      getGameData();
    }
  }, [gameId]);

  if (error) return <div className={styles['game-summary-container']}>{error}</div>;
  if (!gameData) return <div className={styles['game-summary-container']}>Loading...</div>;

  const { gameInfo, gameStats } = gameData;
  const { homeTeamId, awayTeamId } = gameInfo;
  const homeStats = gameStats.find(gs => gs.id.teamId === homeTeamId);
  const awayStats = gameStats.find(gs => gs.id.teamId === awayTeamId);

  if (!homeStats || !awayStats) return <div className={styles['game-summary-container']}>Stats not found for this game.</div>;

  const homeName = TEAM_MAP[homeStats.id.teamId]?.name;
  const awayName = TEAM_MAP[awayStats.id.teamId]?.name;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles['game-info']}>
            <div className={styles['week-info']}>Week {gameInfo.seasonWeek} • Regular Season</div>
            <div className={styles['date-time']}>{gameInfo.date}</div>
          </div>
        </div>

        <div className={styles.scoreboard}>
          <div className={styles.team}>
            <div className={styles['team-logo']}>{homeStats.id.teamId}</div>
            <div className={styles['team-name']}>{homeName}</div>
            <div className={styles['team-record']}>(record?)</div>
            <div className={`${styles.score} ${styles.winner}`}>{homeStats.pointsTotal}</div>
          </div>
          <div className={styles.vs}>vs</div>
          <div className={styles.team}>
            <div className={styles['team-logo']}>{awayStats.id.teamId}</div>
            <div className={styles['team-name']}>{awayName}</div>
            <div className={styles['team-record']}>(record?)</div>
            <div className={styles.score}>{awayStats.pointsTotal}</div>
          </div>
        </div>

        <div className={styles['quarter-scores']}>
          <h3>Quarter by Quarter</h3>
          <table className={styles['quarter-table']}>
            <thead>
              <tr>
                <th>Team</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Final</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{homeStats.id.teamId}</strong></td>
                <td>{homeStats.pointsQ1}</td>
                <td>{homeStats.pointsQ2}</td>
                <td>{homeStats.pointsQ3}</td>
                <td>{homeStats.pointsQ4}</td>
                <td><strong>{homeStats.pointsTotal}</strong></td>
              </tr>
              <tr>
                <td><strong>{awayStats.id.teamId}</strong></td>
                <td>{awayStats.pointsQ1}</td>
                <td>{awayStats.pointsQ2}</td>
                <td>{awayStats.pointsQ3}</td>
                <td>{awayStats.pointsQ4}</td>
                <td><strong>{awayStats.pointsTotal}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles['stats-section']}>
          <div className={styles['section-title']}>Team Statistics</div>
          <div className={styles['visual-comparison']}>
            <h3>Key Stats Comparison</h3>
            <div className={styles['chart-container']}>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Total Yards</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`}>{homeStats.id.teamId}: {homeStats.totalYards}</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`}>{awayStats.id.teamId}: {awayStats.totalYards}</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Passing Yards</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`}>{homeStats.id.teamId}: {homeStats.passingYards}</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`}>{awayStats.id.teamId}: {awayStats.passingYards}</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Rushing Yards</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`}>{homeStats.id.teamId}: {homeStats.rushingYards}</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`}>{awayStats.id.teamId}: {awayStats.rushingYards}</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>First Downs</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`}>{homeStats.id.teamId}: {homeStats.firstDownsTotal}</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`}>{awayStats.id.teamId}: {awayStats.firstDownsTotal}</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Touchdowns</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}> 
                    <div className={`${styles.bar} ${styles['kc-bar']}`}>{homeStats.id.teamId}: {homeStats.passingTouchdowns + homeStats.rushingTouchdowns}</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`}>{awayStats.id.teamId}: {awayStats.passingTouchdowns + awayStats.rushingTouchdowns}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h3>Offensive Statistics</h3>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{homeStats.id.teamId}</th>
                    <th>{awayStats.id.teamId}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Yards</strong></td>
                    <td>{homeStats.totalYards}</td>
                    <td>{awayStats.totalYards}</td>
                  </tr>
                  <tr>
                    <td><strong>Passing Yards</strong></td>
                    <td>{homeStats.passingYards}</td>
                    <td>{awayStats.passingYards}</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing Yards</strong></td>
                    <td>{homeStats.rushingYards}</td>
                    <td>{awayStats.rushingYards}</td>
                  </tr>
                  <tr>
                    <td><strong>First Downs</strong></td>
                    <td>{homeStats.firstDownsTotal}</td>
                    <td>{awayStats.firstDownsTotal}</td>
                  </tr>
                  <tr>
                    <td><strong>Third Down Efficiency</strong></td>
                    <td>{homeStats.thirdDownConversions}/{homeStats.thirdDownAttempts}</td>
                    <td>{awayStats.thirdDownConversions}/{awayStats.thirdDownAttempts}</td>
                  </tr>
                  <tr>
                    <td><strong>Red Zone Efficiency</strong></td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><strong>Time of Possession</strong></td>
                    <td>{homeStats.timeOfPossession}</td>
                    <td>{awayStats.timeOfPossession}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles['stat-card']}>
              <h3>Defensive Statistics</h3>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{homeStats.id.teamId}</th>
                    <th>{awayStats.id.teamId}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Sacks</strong></td>
                    <td>{homeStats.sacksTotal}</td>
                    <td>{awayStats.sacksTotal}</td>
                  </tr>
                  <tr>
                    <td><strong>Interceptions</strong></td>
                    <td>{homeStats.passingInterceptions}</td>
                    <td>{awayStats.passingInterceptions}</td>
                  </tr>
                  <tr>
                    <td><strong>Fumbles Lost</strong></td>
                    <td>{homeStats.fumblesLost}</td>
                    <td>{awayStats.fumblesLost}</td>
                  </tr>
                  <tr>
                    <td><strong>Penalties</strong></td>
                    <td>{homeStats.penaltiesTotal}-{homeStats.penaltyYards}</td>
                    <td>{awayStats.penaltiesTotal}-{awayStats.penaltyYards}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles['stat-card']}>
              <h3>Scoring & Special Teams</h3>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{homeStats.id.teamId}</th>
                    <th>{awayStats.id.teamId}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Touchdowns</strong></td>
                    <td>{homeStats.passingTouchdowns + homeStats.rushingTouchdowns}</td>
                    <td>{awayStats.passingTouchdowns + awayStats.rushingTouchdowns}</td>
                  </tr>
                  <tr>
                    <td><strong>Passing TDs</strong></td>
                    <td>{homeStats.passingTouchdowns}</td>
                    <td>{awayStats.passingTouchdowns}</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing TDs</strong></td>
                    <td>{homeStats.rushingTouchdowns}</td>
                    <td>{awayStats.rushingTouchdowns}</td>
                  </tr>
                  <tr>
                    <td><strong>Field Goals Made</strong></td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><strong>Extra Points</strong></td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><strong>Penalties</strong></td>
                    <td>{homeStats.penaltiesTotal}-{homeStats.penaltyYards}</td>
                    <td>{awayStats.penaltiesTotal}-{awayStats.penaltyYards}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* You can add player stats and other sections as needed, using homeStats and awayStats */}
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
