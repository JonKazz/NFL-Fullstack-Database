import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './SeasonSummary.module.css';
import { fetchFullSeason, fetchTeamInfo, fetchTeamPlayerStats } from '../../api/fetches';
import { TEAM_MAP, processPlayerStats, formatNumber, getPlayerName } from '../../utils';

function SeasonSummaryVisualization() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamId = searchParams.get('teamId');
  const year = searchParams.get('year');
  const [teamInfo, setTeamInfo] = useState(null);
  const [games, setGames] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teamInfoResult, gamesResult, playerStatsResult] = await Promise.allSettled([
          fetchTeamInfo(teamId, year),
          fetchFullSeason(teamId, year),
          fetchTeamPlayerStats(teamId, year)
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

        if (playerStatsResult.status === 'fulfilled') {
          setPlayerStats(playerStatsResult.value);
        } else {
          console.warn('Failed to fetch player stats, using fallback data');
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
          defCoordinator } = teamInfo;
  const teamName = TEAM_MAP[teamId]?.name;

  // Process player stats
  const processedPlayerStats = processPlayerStats(playerStats);

  const handleGameClick = (gameId) => {
    navigate(`/game?gameId=${gameId}`);
  };
  
  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles['header-background']}>
            <div className={styles['team-logo-bg']}>
              {logo ? (
                <img src={logo} alt={teamName} className={styles['team-logo-background']} />
              ) : (
                <div className={styles['team-logo-placeholder']}>{teamName?.slice(0,2)}</div>
              )}
            </div>
          </div>
          <div className={styles['header-content']}>
            <div className={styles['team-info']}>
              <div className={styles['team-details']}>
                <h1>{year} {teamName}</h1>
                <div className={styles['team-stats']}>
                  <div className={styles['stat-item-header']}>
                    <div className={styles['stat-value-header']}>{wins}-{losses}</div>
                    <div className={styles['stat-label-header']}>Record</div>
                  </div>
                  <div className={styles['stat-item-header']}>
                    <div className={styles['stat-value-header']}>{divisionRank || '-'}</div>
                    <div className={styles['stat-label-header']}>{division || 'Division'}</div>
                  </div>
                  <div className={styles['stat-item-header']}>
                    <div className={`${styles['stat-value-header']} ${styles['playoffs-value-header']}`}>{playoffs || '-'}</div>
                    <div className={styles['stat-label-header']}>Playoffs</div>
                  </div>
                </div>
              </div>
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
                  {/* Game Header */}
                  <div className={styles['game-header']}>
                    <div className={styles['game-meta']}>
                      <div className={styles['week-date-row']}>
                        <div className={`${styles.week} ${isPlayoff ? styles.playoff : ''}`}>
                          {isPlayoff ? gameInfo.seasonWeek : `Week ${gameInfo.seasonWeek}`}
                        </div>
                    <div className={styles['game-date']}>{gameInfo.date}</div>
                      </div>
                    </div>
                    <div className={styles['game-result']}>
                      {isWin ? 'W' : 'L'}
                    </div>
                  </div>

                  {/* Game Matchup */}
                  <div className={styles['game-matchup']}>
                    {/* My Team */}
                    <div className={styles['team-section']}>
                      <div className={styles['team-info']}>
                        <div className={`${styles['team-name']} ${isWin ? styles['winner-text'] : ''}`}>
                          {TEAM_MAP[myStats.id.teamId]?.city}
                        </div>
                        <div className={styles['team-record']}>
                          {/* Could add team record here if available */}
                        </div>
                      </div>
                      <div className={`${styles['team-score']} ${isWin ? styles['winner-score'] : ''}`}>
                        {myStats.pointsTotal}
                      </div>
                    </div>

                    {/* Game Status */}
                    <div className={styles['game-status']}>
                      <div className={styles['vs-indicator']}>{isHome ? 'vs' : '@'}</div>
                    </div>

                    {/* Opponent Team */}
                    <div className={styles['team-section']}>
                      <div className={styles['team-info']}>
                        <div className={`${styles['team-name']} ${!isWin ? styles['winner-text'] : ''}`}>
                          {TEAM_MAP[oppStats.id.teamId]?.city}
                        </div>
                        <div className={styles['team-record']}>
                          {/* Could add team record here if available */}
                        </div>
                      </div>
                      <div className={`${styles['team-score']} ${!isWin ? styles['winner-score'] : ''}`}>
                        {oppStats.pointsTotal}
                      </div>
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
            
            {/* Offensive Statistics */}
            <div className={styles['stats-category']}>
              <h3 className={styles['stats-category-title']}>Offensive Statistics</h3>
              
              {/* Main Stats - Prominent Display */}
              <div className={styles['main-stats-grid']}>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#5</div>
                    <div className={styles['main-stat-name']}>Total Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>389.2 YPG</div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#12</div>
                    <div className={styles['main-stat-name']}>Passing Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>244.4 YPG</div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#3</div>
                    <div className={styles['main-stat-name']}>Rushing Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>144.8 YPG</div>
                </div>
              </div>

              {/* Miscellaneous Stats - Table Format */}
              <div className={styles['misc-stats-section']}>
                <table className={styles['misc-stats-table']}>
                  <tbody>
                    <tr>
                      <td className={styles['rank-cell']}>#1</td>
                      <td className={styles['stat-name-cell']}>Red Zone Efficiency</td>
                      <td className={styles['stat-value-cell']}>73.5%</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#7</td>
                      <td className={styles['stat-name-cell']}>3rd Down Conversion</td>
                      <td className={styles['stat-value-cell']}>44.2%</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#4</td>
                      <td className={styles['stat-name-cell']}>Time of Possession</td>
                      <td className={styles['stat-value-cell']}>31:42</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#6</td>
                      <td className={styles['stat-name-cell']}>Points Per Game</td>
                      <td className={styles['stat-value-cell']}>28.9</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#5</td>
                      <td className={styles['stat-name-cell']}>Touchdowns</td>
                      <td className={styles['stat-value-cell']}>48</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#8</td>
                      <td className={styles['stat-name-cell']}>Field Goals</td>
                      <td className={styles['stat-value-cell']}>28</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Defensive Statistics */}
            <div className={styles['stats-category']}>
              <h3 className={styles['stats-category-title']}>Defensive Statistics</h3>
              
              {/* Main Stats - Prominent Display */}
              <div className={styles['main-stats-grid']}>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#3</div>
                    <div className={styles['main-stat-name']}>Total Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>298.4 YPG</div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#8</div>
                    <div className={styles['main-stat-name']}>Passing Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>210.6 YPG</div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>#1</div>
                    <div className={styles['main-stat-name']}>Rushing Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>87.8 YPG</div>
                </div>
              </div>

              {/* Miscellaneous Stats - Table Format */}
              <div className={styles['misc-stats-section']}>
                <table className={styles['misc-stats-table']}>
                  <tbody>
                    <tr>
                      <td className={styles['rank-cell']}>#2</td>
                      <td className={styles['stat-name-cell']}>Red Zone Defense</td>
                      <td className={styles['stat-value-cell']}>47.1%</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#6</td>
                      <td className={styles['stat-name-cell']}>3rd Down Defense</td>
                      <td className={styles['stat-value-cell']}>35.8%</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#5</td>
                      <td className={styles['stat-name-cell']}>Sacks</td>
                      <td className={styles['stat-value-cell']}>48</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#4</td>
                      <td className={styles['stat-name-cell']}>Interceptions</td>
                      <td className={styles['stat-value-cell']}>18</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#7</td>
                      <td className={styles['stat-name-cell']}>Fumble Recoveries</td>
                      <td className={styles['stat-value-cell']}>8</td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>#3</td>
                      <td className={styles['stat-name-cell']}>Points Allowed</td>
                      <td className={styles['stat-value-cell']}>17.2 PPG</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Team Roster Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Team Roster</h2>
          <div className={styles['players-section']}>
            
            {/* Quarterbacks */}
            {processedPlayerStats.quarterbacks.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Quarterbacks</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>Pass YDS</th>
                      <th className={styles['table-header']}>TD</th>
                      <th className={styles['table-header']}>INT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.quarterbacks.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.passYds)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.passTd)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.passInt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Running Backs */}
            {processedPlayerStats.runningBacks.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Running Backs</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>Rush YDS</th>
                      <th className={styles['table-header']}>Rush TD</th>
                      <th className={styles['table-header']}>REC</th>
                      <th className={styles['table-header']}>Rec YDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.runningBacks.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.rushYds)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.rushTd)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.rec)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.recYds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Wide Receivers */}
            {processedPlayerStats.wideReceivers.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Wide Receivers</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>REC</th>
                      <th className={styles['table-header']}>YDS</th>
                      <th className={styles['table-header']}>TD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.wideReceivers.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.rec)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.recYds)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.recTd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tight Ends */}
            {processedPlayerStats.tightEnds.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Tight Ends</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>REC</th>
                      <th className={styles['table-header']}>YDS</th>
                      <th className={styles['table-header']}>TD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.tightEnds.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.rec)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.recYds)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.recTd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Defensive Line */}
            {processedPlayerStats.defensiveLine.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Defensive Line</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>Sacks</th>
                      <th className={styles['table-header']}>Tackles</th>
                      <th className={styles['table-header']}>TFL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.defensiveLine.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.sacks)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.tackles)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.tacklesLoss || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Linebackers */}
            {processedPlayerStats.linebackers.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Linebackers</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>Tackles</th>
                      <th className={styles['table-header']}>Sacks</th>
                      <th className={styles['table-header']}>INT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.linebackers.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.tackles)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.sacks)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.defInt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Defensive Backs */}
            {processedPlayerStats.defensiveBacks.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Defensive Backs</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>INT</th>
                      <th className={styles['table-header']}>PD</th>
                      <th className={styles['table-header']}>Tackles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.defensiveBacks.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.defInt)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.passDefended)}</td>
                        <td className={styles['stat-cell']}>{formatNumber(player.tackles)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Special Teams */}
            {processedPlayerStats.specialTeams.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Special Teams</h3>
                <table className={styles['position-table']}>
                  <thead>
                    <tr>
                      <th className={styles['table-header']}>Player</th>
                      <th className={styles['table-header']}>Position</th>
                      <th className={styles['table-header']}>Stats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPlayerStats.specialTeams.map((player, index) => (
                      <tr key={player.playerId || index} className={styles['table-row']}>
                        <td className={styles['player-name-cell']}>{getPlayerName(player.playerId)}</td>
                        <td className={styles['stat-cell']}>{player.position || 'Specialist'}</td>
                        <td className={styles['stat-cell']}>
                          {player.fgm > 0 ? `${player.fgm}/${player.fga} FG` : 
                           player.punt > 0 ? `${formatNumber(player.puntYds / player.punt)} YDS Avg` : 
                           'Specialist'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonSummaryVisualization;
