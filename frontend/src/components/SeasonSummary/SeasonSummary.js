import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './SeasonSummary.module.css';
import { fetchFullSeason, fetchTeamInfo } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function SeasonSummaryVisualization() {
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
          setError('Failed to fetch team info');
        }

        if (gamesResult.status === 'fulfilled') {
          setGames(gamesResult.value);
        } else {
          setError('Failed to fetch game info');
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
  if (!teamInfo || !games) return <p>No data available</p>;

  const { logo, wins, losses, division, divisionRank, playoffs, coach, offCoordinator,
          defCoordinator, pointsFor, pointsAgainst } = teamInfo;
  const teamName = TEAM_MAP[teamId]?.name;

  const handleGameClick = (gameId) => {
    navigate(`/game?gameId=${gameId}`);
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles['team-info']}>
            <div className={styles['team-logo']}>
              {logo ? (
                <img src={logo} alt={teamName} style={{width: '80px', height: '80px', borderRadius: '50%'}} />
              ) : (
                teamName?.slice(0,2)
              )}
            </div>
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

        {/* Coaching Staff Section */}
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

        {/* Games Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Season Schedule & Results</h2>
          <div className={styles['games-grid']}>
            {games.map((game, idx) => {
              const { gameInfo, gameStats } = game;
              const myStats = gameStats.find(gs => gs.id.teamId === teamId);
              const oppStats = gameStats.find(gs => gs.id.teamId !== teamId);
              const isHome = gameInfo.homeTeamId === teamId;
              const isWin = myStats.pointsTotal > oppStats.pointsTotal;
              const isPlayoff = gameInfo.seasonWeek === 'WC' || gameInfo.seasonWeek === 'DIV' || 
                               gameInfo.seasonWeek === 'CONF' || gameInfo.seasonWeek === 'SB';

              let gameCardClass = styles['game-card'];
              if (isPlayoff) {
                gameCardClass += ` ${styles.playoff}`;
              } else {
                gameCardClass += isWin ? ` ${styles.win}` : ` ${styles.loss}`;
              }

              return (
                <div
                  className={gameCardClass}
                  onClick={() => handleGameClick(gameInfo.gameId)}
                  key={gameInfo.gameId || idx}
                >
                  <div className={styles['game-header']}>
                    <div className={`${styles.week} ${isPlayoff ? styles.playoff : ''}`}>
                      {isPlayoff ? gameInfo.seasonWeek : `Week ${gameInfo.seasonWeek}`}
                    </div>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Statistics Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Team Statistics</h2>
          <div className={styles['stats-section']}>
            <div className={styles['stats-category']}>
              <h3 className={styles['stats-category-title']}>Offensive Statistics</h3>
              <div className={styles['stats-grid-detailed']}>
                <div className={`${styles['stat-item']} ${styles['rank-good']}`}>
                  <div className={styles['stat-rank']}>#5</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Total Offense</div>
                    <div className={styles['stat-value-detailed']}>389.2 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-elite']}`}>
                  <div className={styles['stat-rank']}>#3</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Rushing Offense</div>
                    <div className={styles['stat-value-detailed']}>144.8 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-good']}`}>
                  <div className={styles['stat-rank']}>#12</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Passing Offense</div>
                    <div className={styles['stat-value-detailed']}>244.4 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-elite']}`}>
                  <div className={styles['stat-rank']}>#1</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Red Zone Efficiency</div>
                    <div className={styles['stat-value-detailed']}>73.5%</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#7</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>3rd Down Conversion</div>
                    <div className={styles['stat-value-detailed']}>44.2%</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#4</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Time of Possession</div>
                    <div className={styles['stat-value-detailed']}>31:42</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['stats-category']}>
              <h3 className={styles['stats-category-title']}>Defensive Statistics</h3>
              <div className={styles['stats-grid-detailed']}>
                <div className={`${styles['stat-item']} ${styles['rank-elite']}`}>
                  <div className={styles['stat-rank']}>#3</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Total Defense</div>
                    <div className={styles['stat-value-detailed']}>298.4 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-elite']}`}>
                  <div className={styles['stat-rank']}>#1</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Rushing Defense</div>
                    <div className={styles['stat-value-detailed']}>87.8 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#8</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Passing Defense</div>
                    <div className={styles['stat-value-detailed']}>210.6 YPG</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-elite']}`}>
                  <div className={styles['stat-rank']}>#2</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Red Zone Defense</div>
                    <div className={styles['stat-value-detailed']}>47.1%</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#6</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>3rd Down Defense</div>
                    <div className={styles['stat-value-detailed']}>35.8%</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-good']}`}>
                  <div className={styles['stat-rank']}>#5</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Sacks</div>
                    <div className={styles['stat-value-detailed']}>48</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['stats-category']}>
              <h3 className={styles['stats-category-title']}>Special Teams & Turnovers</h3>
              <div className={styles['stats-grid-detailed']}>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#8</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Field Goal %</div>
                    <div className={styles['stat-value-detailed']}>87.5%</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-good']}`}>
                  <div className={styles['stat-rank']}>#14</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Punt Average</div>
                    <div className={styles['stat-value-detailed']}>46.2 YDS</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-good']}`}>
                  <div className={styles['stat-rank']}>#11</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Kick Return Avg</div>
                    <div className={styles['stat-value-detailed']}>23.8 YDS</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#9</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Turnover Differential</div>
                    <div className={styles['stat-value-detailed']}>+8</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-average']}`}>
                  <div className={styles['stat-rank']}>#15</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Giveaways</div>
                    <div className={styles['stat-value-detailed']}>18</div>
                  </div>
                </div>
                <div className={`${styles['stat-item']} ${styles['rank-great']}`}>
                  <div className={styles['stat-rank']}>#7</div>
                  <div className={styles['stat-details']}>
                    <div className={styles['stat-name']}>Takeaways</div>
                    <div className={styles['stat-value-detailed']}>26</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Roster Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Team Roster</h2>
          <div className={styles['players-section']}>
            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Quarterbacks</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>13</div>
                  <div className={styles['player-name']}>Brock Purdy</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>10</div>
                  <div className={styles['player-name']}>Jimmy Garoppolo</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>3</div>
                  <div className={styles['player-name']}>Trey Lance</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Running Backs</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>23</div>
                  <div className={styles['player-name']}>Christian McCaffrey</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>30</div>
                  <div className={styles['player-name']}>Elijah Mitchell</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>28</div>
                  <div className={styles['player-name']}>Jordan Mason</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>24</div>
                  <div className={styles['player-name']}>TDP McBride</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Wide Receivers</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>19</div>
                  <div className={styles['player-name']}>Deebo Samuel</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>11</div>
                  <div className={styles['player-name']}>Brandon Aiyuk</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>15</div>
                  <div className={styles['player-name']}>Jauan Jennings</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>18</div>
                  <div className={styles['player-name']}>Ronnie Bell</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>7</div>
                  <div className={styles['player-name']}>Chris Conley</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Tight Ends</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>85</div>
                  <div className={styles['player-name']}>George Kittle</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>82</div>
                  <div className={styles['player-name']}>Ross Dwelley</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>80</div>
                  <div className={styles['player-name']}>Charlie Woerner</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Offensive Line</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>71</div>
                  <div className={styles['player-name']}>Trent Williams</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>64</div>
                  <div className={styles['player-name']}>Mike McGlinchey</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>69</div>
                  <div className={styles['player-name']}>Aaron Banks</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>50</div>
                  <div className={styles['player-name']}>Alex Mack</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>78</div>
                  <div className={styles['player-name']}>Daniel Brunskill</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>77</div>
                  <div className={styles['player-name']}>Jaylon Moore</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Defensive Line</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>97</div>
                  <div className={styles['player-name']}>Nick Bosa</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>99</div>
                  <div className={styles['player-name']}>Javon Kinlaw</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>91</div>
                  <div className={styles['player-name']}>Arik Armstead</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>98</div>
                  <div className={styles['player-name']}>Hassan Ridgeway</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>95</div>
                  <div className={styles['player-name']}>Kerry Hyder Jr.</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>94</div>
                  <div className={styles['player-name']}>Jordan Willis</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Linebackers</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>54</div>
                  <div className={styles['player-name']}>Fred Warner</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>57</div>
                  <div className={styles['player-name']}>Dre Greenlaw</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>58</div>
                  <div className={styles['player-name']}>Samson Ebukam</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>53</div>
                  <div className={styles['player-name']}>Oren Burks</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>51</div>
                  <div className={styles['player-name']}>Azeez Al-Shaair</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Defensive Backs</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>20</div>
                  <div className={styles['player-name']}>Charvarius Ward</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>38</div>
                  <div className={styles['player-name']}>Deommodore Lenoir</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>29</div>
                  <div className={styles['player-name']}>Talanoa Hufanga</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>1</div>
                  <div className={styles['player-name']}>Ji'Ayir Brown</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>31</div>
                  <div className={styles['player-name']}>Tashaun Gipson Sr.</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>26</div>
                  <div className={styles['player-name']}>Isaiah Oliver</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>2</div>
                  <div className={styles['player-name']}>Ambry Thomas</div>
                </div>
              </div>
            </div>

            <div className={styles['position-group']}>
              <h3 className={styles['position-title']}>Special Teams</h3>
              <div className={styles['player-list']}>
                <div className={styles.player}>
                  <div className={styles['player-number']}>27</div>
                  <div className={styles['player-name']}>Jake Moody</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>6</div>
                  <div className={styles['player-name']}>Mitch Wishnowsky</div>
                </div>
                <div className={styles.player}>
                  <div className={styles['player-number']}>46</div>
                  <div className={styles['player-name']}>Taybor Pepper</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonSummaryVisualization;
