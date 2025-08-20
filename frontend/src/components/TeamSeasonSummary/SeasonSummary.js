import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SeasonSummary.module.css';
import { fetchFullSeason, fetchTeamInfo, fetchTeamPlayerStats } from '../../api/fetches';
import { TEAM_MAP, processPlayerStats, formatNumber, getPlayerName, getTeamPrimaryColor } from '../../utils';

// Component to handle async player name fetching
function PlayerNameCell({ playerId }) {
  const [playerName, setPlayerName] = useState('Loading...');

  useEffect(() => {
    async function fetchPlayerName() {
      const name = await getPlayerName(playerId);
      setPlayerName(name);
    }
    
    fetchPlayerName();
  }, [playerId]);

  return <td className={styles['player-name-cell']}>{playerName}</td>;
}

// Hook for sorting functionality
function useSortableData(data, config = null) {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedData, requestSort, sortConfig };
}

// Generic Sortable Table Component
function SortableTable({ players, columns }) {
  // Default sort to first stat column (index 1) in descending order
  const defaultSort = { key: columns[1]?.key, direction: 'desc' };
  const { items: sortedPlayers, requestSort, sortConfig } = useSortableData(players, defaultSort);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return styles['table-header'];
    }
    return sortConfig.key === name ? 
      `${styles['table-header']} ${styles[sortConfig.direction]}` : 
      styles['table-header'];
  };

  const getSortIndicator = (name) => {
    if (!sortConfig || sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <table className={styles['position-table']}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th 
              key={column.key}
              className={getClassNamesFor(column.key)}
              onClick={() => requestSort(column.key)}
              style={{ cursor: 'pointer' }}
            >
              {column.label}{getSortIndicator(column.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((player, index) => (
          <tr key={player.playerId || index} className={styles['table-row']}>
            <PlayerNameCell playerId={player.playerId} />
            {columns.slice(1).map((column) => (
              <td key={column.key} className={styles['stat-cell']}>
                {formatNumber(player[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SeasonSummaryVisualization() {
  const params = useParams();
  const navigate = useNavigate();
  const teamId = params.teamId;
  const year = params.year;
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
      // Set team primary color for the header
      const teamColor = getTeamPrimaryColor(teamId);
      document.documentElement.style.setProperty('--team-primary-color', teamColor);
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
            navigate(`/game/${gameId}`);
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
                <SortableTable 
                  players={processedPlayerStats.quarterbacks} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'passYds', label: 'Pass YDS' },
                    { key: 'passTd', label: 'TD' },
                    { key: 'passInt', label: 'INT' }
                  ]}
                />
              </div>
            )}

            {/* Running Backs */}
            {processedPlayerStats.runningBacks.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Running Backs</h3>
                <SortableTable 
                  players={processedPlayerStats.runningBacks} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'rushYds', label: 'Rush YDS' },
                    { key: 'rushTd', label: 'Rush TD' },
                    { key: 'rec', label: 'REC' },
                    { key: 'recYds', label: 'Rec YDS' }
                  ]}
                />
              </div>
            )}

            {/* Receivers */}
            {processedPlayerStats.receivers.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Receivers</h3>
                <SortableTable 
                  players={processedPlayerStats.receivers} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'position', label: 'Pos' },
                    { key: 'rec', label: 'REC' },
                    { key: 'recYds', label: 'YDS' },
                    { key: 'recTd', label: 'TD' },
                    { key: 'targets', label: 'TGT' }
                  ]}
                />
              </div>
            )}

            {/* Defensive Line */}
            {processedPlayerStats.defensiveLine.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Defensive Line</h3>
                <SortableTable 
                  players={processedPlayerStats.defensiveLine} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'sacks', label: 'Sacks' },
                    { key: 'tacklesTotal', label: 'Tackles' },
                    { key: 'tacklesLoss', label: 'TFL' }
                  ]}
                />
              </div>
            )}

            {/* Linebackers */}
            {processedPlayerStats.linebackers.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Linebackers</h3>
                <SortableTable 
                  players={processedPlayerStats.linebackers} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'tacklesTotal', label: 'Tackles' },
                    { key: 'sacks', label: 'Sacks' },
                    { key: 'defInt', label: 'INT' }
                  ]}
                />
              </div>
            )}

            {/* Defensive Backs */}
            {processedPlayerStats.defensiveBacks.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Defensive Backs</h3>
                <SortableTable 
                  players={processedPlayerStats.defensiveBacks} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'defInt', label: 'INT' },
                    { key: 'passDefended', label: 'PD' },
                    { key: 'tacklesTotal', label: 'Tackles' }
                  ]}
                />
              </div>
            )}

            {/* Special Teams */}
            {processedPlayerStats.specialTeams.length > 0 && (
              <div className={styles['position-group']}>
                <h3 className={styles['position-title']}>Special Teams</h3>
                <SortableTable 
                  players={processedPlayerStats.specialTeams} 
                  columns={[
                    { key: 'playerId', label: 'Player' },
                    { key: 'position', label: 'Position' },
                    { key: 'fgm', label: 'FG' },
                    { key: 'fga', label: 'FGA' },
                    { key: 'punt', label: 'Punt' },
                    { key: 'puntYds', label: 'YDS Avg' }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonSummaryVisualization;
