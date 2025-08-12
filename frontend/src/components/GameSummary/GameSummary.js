import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './GameSummary.module.css';
import { fetchGame } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function GameSummary() {
  const { gameId } = useParams();
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

  const hasOvertime = !!gameInfo.overtime;

  // Proportional bar calculations
  const statBarData = [
    {
      label: 'Total Yards',
      home: homeStats.totalYards,
      away: awayStats.totalYards,
    },
    {
      label: 'Passing Yards',
      home: homeStats.passingYards,
      away: awayStats.passingYards,
    },
    {
      label: 'Rushing Yards',
      home: homeStats.rushingYards,
      away: awayStats.rushingYards,
    },
    {
      label: 'First Downs',
      home: homeStats.firstDownsTotal,
      away: awayStats.firstDownsTotal,
    },
    {
      label: 'Touchdowns',
      home: (homeStats.passingTouchdowns || 0) + (homeStats.rushingTouchdowns || 0),
      away: (awayStats.passingTouchdowns || 0) + (awayStats.rushingTouchdowns || 0),
    },
  ];

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
                {hasOvertime && <th>OT</th>}
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
                {hasOvertime && <td>{homeStats.pointsOvertime}</td>}
                <td><strong>{homeStats.pointsTotal}</strong></td>
              </tr>
              <tr>
                <td><strong>{awayStats.id.teamId}</strong></td>
                <td>{awayStats.pointsQ1}</td>
                <td>{awayStats.pointsQ2}</td>
                <td>{awayStats.pointsQ3}</td>
                <td>{awayStats.pointsQ4}</td>
                {hasOvertime && <td>{awayStats.pointsOvertime}</td>}
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
              {statBarData.map(({ label, home, away }, idx) => {
                const total = (home || 0) + (away || 0);
                const homePct = total ? (home / total) * 100 : 50;
                const awayPct = total ? (away / total) * 100 : 50;
                return (
                  <div className={styles['stat-comparison']} key={label}>
                    <div className={styles['stat-name']}>{label}</div>
                    <div className={styles['stat-bars']}>
                      <div className={styles['bar-row']}>
                        <div
                          className={`${styles.bar} ${styles['kc-bar']}`}
                          style={{ width: `${homePct}%` }}
                        >
                          {homeStats.id.teamId}: {home}
                        </div>
                        <div
                          className={`${styles.bar} ${styles['lac-bar']}`}
                          style={{ width: `${awayPct}%` }}
                        >
                          {awayStats.id.teamId}: {away}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        </div>
          <div className={styles['player-stats']}>
            <div className={styles['section-title']}>Individual Player Stats</div>
            
            <h3>Passing</h3>
            <table className={styles['player-table']}>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Comp/Att</th>
                        <th>Yards</th>
                        <th>TD</th>
                        <th>INT</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Patrick Mahomes</td>
                        <td>KC</td>
                        <td>24/35</td>
                        <td>298</td>
                        <td>3</td>
                        <td>0</td>
                        <td>118.4</td>
                    </tr>
                    <tr>
                        <td>Justin Herbert</td>
                        <td>LAC</td>
                        <td>21/32</td>
                        <td>235</td>
                        <td>2</td>
                        <td>1</td>
                        <td>89.2</td>
                    </tr>
                </tbody>
            </table>

            <h3>Rushing</h3>
            <table className={styles['player-table']}>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Carries</th>
                        <th>Yards</th>
                        <th>TD</th>
                        <th>Long</th>
                        <th>YPC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Isiah Pacheco</td>
                        <td>KC</td>
                        <td>18</td>
                        <td>89</td>
                        <td>1</td>
                        <td>24</td>
                        <td>4.9</td>
                    </tr>
                    <tr>
                        <td>Austin Ekeler</td>
                        <td>LAC</td>
                        <td>15</td>
                        <td>52</td>
                        <td>0</td>
                        <td>12</td>
                        <td>3.5</td>
                    </tr>
                    <tr>
                        <td>Clyde Edwards-Helaire</td>
                        <td>KC</td>
                        <td>8</td>
                        <td>38</td>
                        <td>0</td>
                        <td>15</td>
                        <td>4.8</td>
                    </tr>
                </tbody>
            </table>

            <h3>Receiving</h3>
            <table className={styles['player-table']}>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Rec</th>
                        <th>Yards</th>
                        <th>TD</th>
                        <th>Long</th>
                        <th>YPR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Travis Kelce</td>
                        <td>KC</td>
                        <td>8</td>
                        <td>108</td>
                        <td>2</td>
                        <td>32</td>
                        <td>13.5</td>
                    </tr>
                    <tr>
                        <td>Tyreek Hill</td>
                        <td>KC</td>
                        <td>6</td>
                        <td>102</td>
                        <td>1</td>
                        <td>45</td>
                        <td>17.0</td>
                    </tr>
                    <tr>
                        <td>Keenan Allen</td>
                        <td>LAC</td>
                        <td>7</td>
                        <td>89</td>
                        <td>1</td>
                        <td>28</td>
                        <td>12.7</td>
                    </tr>
                </tbody>
            </table>

            <h3>Defense</h3>
            <table className={styles['player-table']}>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Tackles</th>
                        <th>Sacks</th>
                        <th>INT</th>
                        <th>PD</th>
                        <th>FF</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Chris Jones</td>
                        <td>KC</td>
                        <td>6</td>
                        <td>2.0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Nick Bolton</td>
                        <td>KC</td>
                        <td>8</td>
                        <td>0</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>Khalil Mack</td>
                        <td>LAC</td>
                        <td>5</td>
                        <td>1.5</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Derwin James</td>
                        <td>LAC</td>
                        <td>9</td>
                        <td>0</td>
                        <td>0</td>
                        <td>3</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
