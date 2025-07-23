import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './GameSummary.module.css';
import { fetchGame } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

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

  if (error) return <div className={styles['game-summary-container']}>{error}</div>;
  if (!gameInfo) return <div className={styles['game-summary-container']}>Loading...</div>;

  const { seasonWeek, id, opponentId, pointsFor, pointsAgainst } = gameInfo;
  const teamName = TEAM_MAP[id.teamId]?.name
  const opponentName = TEAM_MAP[opponentId]?.name

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles['game-info']}>
            <div className={styles['week-info']}>Week {seasonWeek} • Regular Season</div>
            <div className={styles['date-time']}>Sunday, October 22, 2023 • 1:00 PM ET</div>
          </div>
        </div>

        <div className={styles.scoreboard}>
          <div className={styles.team}>
            <div className={styles['team-logo']}>KAN</div>
            <div className={styles['team-name']}>{teamName}</div>
            <div className={styles['team-record']}>(5-2)</div>
            <div className={`${styles.score} ${styles.winner}`}>{pointsFor}</div>
          </div>
          <div className={styles.vs}>vs</div>
          <div className={styles.team}>
            <div className={styles['team-logo']}>LAC</div>
            <div className={styles['team-name']}>{opponentName}</div>
            <div className={styles['team-record']}>(3-4)</div>
            <div className={styles.score}>{pointsAgainst}</div>
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
                <td><strong>KC</strong></td>
                <td>7</td>
                <td>14</td>
                <td>3</td>
                <td>7</td>
                <td><strong>31</strong></td>
              </tr>
              <tr>
                <td><strong>LAC</strong></td>
                <td>3</td>
                <td>7</td>
                <td>7</td>
                <td>0</td>
                <td><strong>17</strong></td>
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
                    <div className={`${styles.bar} ${styles['kc-bar']}`} style={{width: '57.7%'}}>KC: 425</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`} style={{width: '42.3%'}}>LAC: 312</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Passing Yards</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`} style={{width: '55.9%'}}>KC: 298</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`} style={{width: '44.1%'}}>LAC: 235</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Rushing Yards</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`} style={{width: '62.3%'}}>KC: 127</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`} style={{width: '37.7%'}}>LAC: 77</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>First Downs</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`} style={{width: '57.1%'}}>KC: 24</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`} style={{width: '42.9%'}}>LAC: 18</div>
                  </div>
                </div>
              </div>
              <div className={styles['stat-comparison']}>
                <div className={styles['stat-name']}>Touchdowns</div>
                <div className={styles['stat-bars']}>
                  <div className={styles['bar-row']}>
                    <div className={`${styles.bar} ${styles['kc-bar']}`} style={{width: '66.7%'}}>KC: 4</div>
                    <div className={`${styles.bar} ${styles['lac-bar']}`} style={{width: '33.3%'}}>LAC: 2</div>
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
                    <th>KC</th>
                    <th>LAC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Yards</strong></td>
                    <td>425</td>
                    <td>312</td>
                  </tr>
                  <tr>
                    <td><strong>Passing Yards</strong></td>
                    <td>298</td>
                    <td>235</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing Yards</strong></td>
                    <td>127</td>
                    <td>77</td>
                  </tr>
                  <tr>
                    <td><strong>First Downs</strong></td>
                    <td>24</td>
                    <td>18</td>
                  </tr>
                  <tr>
                    <td><strong>Third Down Efficiency</strong></td>
                    <td>8/14</td>
                    <td>5/12</td>
                  </tr>
                  <tr>
                    <td><strong>Red Zone Efficiency</strong></td>
                    <td>4/5</td>
                    <td>2/3</td>
                  </tr>
                  <tr>
                    <td><strong>Time of Possession</strong></td>
                    <td>32:15</td>
                    <td>27:45</td>
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
                    <th>KC</th>
                    <th>LAC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Sacks</strong></td>
                    <td>3</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td><strong>Interceptions</strong></td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td><strong>Fumbles Recovered</strong></td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td><strong>Tackles for Loss</strong></td>
                    <td>6</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td><strong>Pass Deflections</strong></td>
                    <td>8</td>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td><strong>QB Hits</strong></td>
                    <td>7</td>
                    <td>4</td>
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
                    <th>KC</th>
                    <th>LAC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Touchdowns</strong></td>
                    <td>4</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td><strong>Passing TDs</strong></td>
                    <td>3</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing TDs</strong></td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td><strong>Field Goals Made</strong></td>
                    <td>1/1</td>
                    <td>3/3</td>
                  </tr>
                  <tr>
                    <td><strong>Extra Points</strong></td>
                    <td>4/4</td>
                    <td>2/2</td>
                  </tr>
                  <tr>
                    <td><strong>Penalties</strong></td>
                    <td>6-45</td>
                    <td>8-67</td>
                  </tr>
                </tbody>
              </table>
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
                  <th>YPC</th>
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
                  <td>Keenan Allen</td>
                  <td>LAC</td>
                  <td>7</td>
                  <td>89</td>
                  <td>1</td>
                  <td>28</td>
                  <td>12.7</td>
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
    </div>
  );
}

export default GameSummary;
