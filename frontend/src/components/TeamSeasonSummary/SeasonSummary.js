import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './SeasonSummary.module.css';
import { fetchFullSeason, fetchTeamInfo, fetchTeamPlayerStats, fetchTeamsStatsBySeason } from '../../api/fetches';
import { TEAM_MAP, processPlayerStats, formatNumber, getPlayerName, getTeamPrimaryColor, calculateTeamRanking, formatRanking, getStatValue } from '../../utils';

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

  return (
    <td className={styles['player-name-cell']}>
      <Link to={`/player/${playerId}`} className={styles['player-link']}>
        {playerName}
      </Link>
    </td>
  );
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

  const renderCell = (player, column) => {
    const value = player[column.key];
    
    // Handle special cases
    if (column.key === 'playerId') {
      return <PlayerNameCell playerId={player.playerId} />;
    }
    
    if (column.key === 'passCmp') {
      const completions = player.passCompletions || 0;
      const attempts = player.passAttempts || 0;
      return <td className={styles['stat-cell']}>{completions}/{attempts}</td>;
    }
    
    if (column.key === 'rushYardsPerAttempt') {
      const yards = player.rushYards || 0;
      const attempts = player.rushAtt || 0;
      const ypa = attempts > 0 ? (yards / attempts).toFixed(1) : '0.0';
      return <td className={styles['stat-cell']}>{ypa}</td>;
    }
    
    if (column.key === 'fieldGoalPercentage') {
      const made = player.fieldGoalsMade || 0;
      const attempted = player.fieldGoalsAttempted || 0;
      const percentage = attempted > 0 ? Math.round((made / attempted) * 100) : 0;
      return <td className={styles['stat-cell']}>{percentage}%</td>;
    }
    
    if (column.key === 'puntAverage') {
      const yards = player.puntYards || 0;
      const punts = player.punts || 0;
      const average = punts > 0 ? Math.round(yards / punts) : 0;
      return <td className={styles['stat-cell']}>{average}</td>;
    }
    
    // Default case
    return <td className={styles['stat-cell']}>{formatNumber(value)}</td>;
  };

  return (
    <div className={styles['table-container']}>
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
              {columns.map((column) => (
                <React.Fragment key={column.key}>
                  {renderCell(player, column)}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort games by season week for chronological order
  const sortedGames = useMemo(() => {
    if (!games) return [];
    
    return [...games].sort((a, b) => {
      const weekA = a.gameInfo?.seasonWeek;
      const weekB = b.gameInfo?.seasonWeek;
      
      // Handle playoff weeks (they come after regular season)
      if (weekA === 'WC' || weekA === 'DIV' || weekA === 'CONF' || weekA === 'SB') {
        if (weekB === 'WC' || weekB === 'DIV' || weekB === 'CONF' || weekB === 'SB') {
          // Sort playoff weeks in order: WC -> DIV -> CONF -> SB
          const playoffOrder = { 'WC': 1, 'DIV': 2, 'CONF': 3, 'SB': 4 };
          return playoffOrder[weekA] - playoffOrder[weekB];
        }
        return 1; // Playoff games come after regular season
      }
      
      if (weekB === 'WC' || weekB === 'DIV' || weekB === 'CONF' || weekB === 'SB') {
        return -1; // Regular season comes before playoff
      }
      
      // Regular season weeks - convert to numbers and sort
      const numWeekA = parseInt(weekA);
      const numWeekB = parseInt(weekB);
      
      if (isNaN(numWeekA) || isNaN(numWeekB)) {
        return 0; // Keep original order if parsing fails
      }
      
      return numWeekA - numWeekB;
    });
  }, [games]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teamInfoResult, gamesResult, playerStatsResult, teamStatsResult] = await Promise.allSettled([
          fetchTeamInfo(teamId, year),
          fetchFullSeason(teamId, year),
          fetchTeamPlayerStats(teamId, year),
          fetchTeamsStatsBySeason(year)
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

        if (teamStatsResult.status === 'fulfilled') {
          setTeamStats(teamStatsResult.value);
        } else {
          console.warn('Failed to fetch team stats, using fallback data');
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
          <h2 className={styles['section-title']}>Regular Season</h2>
          <div className={styles['games-grid']}>
            {sortedGames
              .filter(game => {
                // Filter to only show regular season games (no playoff_game column or null)
                return game?.gameInfo?.playoffGame === null || game?.gameInfo?.playoffGame === undefined;
              })
              .map((game, idx) => {
              // Safety check - ensure game has required properties
              if (!game || !game.gameInfo || !game.gameStats || !Array.isArray(game.gameStats)) {
                return null;
              }
              
              const { gameInfo, gameStats } = game;
              const myStats = gameStats.find(gs => gs && gs.id && gs.id.teamId === teamId);
              const oppStats = gameStats.find(gs => gs && gs.id && gs.id.teamId !== teamId);
              
              // Safety check - if stats are not found or pointsTotal is undefined, skip this game
              if (!myStats || !oppStats || typeof myStats.pointsTotal === 'undefined' || typeof oppStats.pointsTotal === 'undefined') {
                return null;
              }
              
              const isHome = gameInfo.homeTeamId === teamId;
              const isWin = myStats.pointsTotal > oppStats.pointsTotal;

              const gameCardClass = `${styles['game-card']} ${isWin ? styles.win : styles.loss}`;

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
                        <div className={styles.week}>
                          Week {gameInfo.seasonWeek}
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
            }).filter(Boolean)}
          </div>
        </div>

        {/* Playoffs Section - Only show if there are playoff games */}
        {sortedGames.some(game => game?.gameInfo?.playoffGame !== null && game?.gameInfo?.playoffGame !== undefined) && (
          <div className={styles.section}>
            <h2 className={styles['section-title']}>Playoffs</h2>
            <div className={styles['games-grid']}>
              {sortedGames
                .filter(game => {
                  // Filter to only show playoff games (playoff_game column is not null)
                  return game?.gameInfo?.playoffGame !== null && game?.gameInfo?.playoffGame !== undefined;
                })
                .map((game, idx) => {
              // Safety check - ensure game has required properties
              if (!game || !game.gameInfo || !game.gameStats || !Array.isArray(game.gameStats)) {
                return null;
              }
              
              const { gameInfo, gameStats } = game;
              const myStats = gameStats.find(gs => gs && gs.id && gs.id.teamId === teamId);
              const oppStats = gameStats.find(gs => gs && gs.id && gs.id.teamId !== teamId);
              
              // Safety check - if stats are not found or pointsTotal is undefined, skip this game
              if (!myStats || !oppStats || typeof myStats.pointsTotal === 'undefined' || typeof oppStats.pointsTotal === 'undefined') {
                return null;
              }
              
              const isHome = gameInfo.homeTeamId === teamId;
              const isWin = myStats.pointsTotal > oppStats.pointsTotal;

              const gameCardClass = `${styles['game-card']} ${styles.playoff} ${isWin ? styles.win : styles.loss}`;

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
                        <div className={styles['playoff-game-text']}>
                          {gameInfo.playoffGame === 'Conference Championship' ? 'Conference' : gameInfo.playoffGame}
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
            }).filter(Boolean)}
          </div>
        </div>
        )}

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
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'totalYardsFor', 'desc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Total Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.totalYardsFor ? `${Math.round(teamInfo.totalYardsFor / 17)} YPG` : 'N/A'}
                  </div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passYardsFor', 'desc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Passing Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.passYardsFor ? `${Math.round(teamInfo.passYardsFor / 17)} YPG` : 'N/A'}
                  </div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushYardsFor', 'desc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Rushing Offense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.rushYardsFor ? `${Math.round(teamInfo.rushYardsFor / 17)} YPG` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Miscellaneous Stats - Table Format */}
              <div className={styles['misc-stats-section']}>
                <table className={styles['misc-stats-table']}>
                  <tbody>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'pointsFor', 'desc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Points Per Game</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.pointsFor ? `${Math.round(teamInfo.pointsFor / 17)} PPG` : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passTdFor', 'desc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Passing Touchdowns</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.passTdFor || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushTdFor', 'desc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Rushing Touchdowns</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.rushTdFor || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'turnovers', 'asc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Turnovers</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.turnovers || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'penaltiesFor', 'asc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Penalties</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.penaltiesFor || 'N/A'}
                      </td>
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
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'totalYardsAgainst', 'asc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Total Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.totalYardsAgainst ? `${Math.round(teamInfo.totalYardsAgainst / 17)} YPG` : 'N/A'}
                  </div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passYardsAgainst', 'asc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Passing Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.passYardsAgainst ? `${Math.round(teamInfo.passYardsAgainst / 17)} YPG` : 'N/A'}
                  </div>
                </div>
                <div className={styles['main-stat-item']}>
                  <div className={styles['main-stat-header']}>
                    <div className={styles['main-stat-rank']}>
                      {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushYardsAgainst', 'asc')}` : '#N/A'}
                    </div>
                    <div className={styles['main-stat-name']}>Rushing Defense</div>
                  </div>
                  <div className={styles['main-stat-value']}>
                    {teamInfo?.rushYardsAgainst ? `${Math.round(teamInfo.rushYardsAgainst / 17)} YPG` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Miscellaneous Stats - Table Format */}
              <div className={styles['misc-stats-section']}>
                <table className={styles['misc-stats-table']}>
                  <tbody>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'pointsAgainst', 'asc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Points Allowed</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.pointsAgainst ? `${Math.round(teamInfo.pointsAgainst / 17)} PPG` : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passTdAgainst', 'asc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Passing TDs Allowed</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.passTdAgainst || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushTdAgainst', 'asc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Rushing TDs Allowed</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.rushTdAgainst || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passInts', 'desc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Interceptions</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.passInts || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles['rank-cell']}>
                        {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'forcedTurnovers', 'desc')}` : '#N/A'}
                      </td>
                      <td className={styles['stat-name-cell']}>Forced Turnovers</td>
                      <td className={styles['stat-value-cell']}>
                        {teamInfo?.forcedTurnovers || 'N/A'}
                      </td>
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
                    { key: 'passCmp', label: 'Cmp/Att' },
                    { key: 'passYds', label: 'Yards' },
                    { key: 'passTd', label: 'TD' },
                    { key: 'passInt', label: 'INT' },
                    { key: 'passRating', label: 'Rating' },
                    { key: 'passFirstDowns', label: '1st Downs' },
                    { key: 'passSacked', label: 'Sacks' },
                    { key: 'passSackedYards', label: 'Sack Yds' },
                    { key: 'passLong', label: 'Long' },
                    { key: 'fumblesTotal', label: 'Fumbles' },
                    { key: 'fumblesLost', label: 'Fumbles Lost' },
                    { key: 'snapcountsOffense', label: 'Snaps' },
                    { key: 'snapcountsOffensePercentage', label: 'Snap %' }
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
                    { key: 'rushYds', label: 'Yards' },
                    { key: 'rushAtt', label: 'Attempts' },
                    { key: 'rushYardsPerAttempt', label: 'YPA' },
                    { key: 'rushTd', label: 'TD' },
                    { key: 'rushLong', label: 'Long' },
                    { key: 'rushFirstDowns', label: '1st Downs' },
                    { key: 'fumblesTotal', label: 'Fumbles' },
                    { key: 'fumblesLost', label: 'Fumbles Lost' },
                    { key: 'rec', label: 'REC' },
                    { key: 'recYds', label: 'Rec YDS' },
                    { key: 'recTd', label: 'Rec TD' },
                    { key: 'snapcountsOffense', label: 'Snaps' },
                    { key: 'snapcountsOffensePercentage', label: 'Snap %' }
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
                    { key: 'recYds', label: 'Yards' },
                    { key: 'recTd', label: 'TD' },
                    { key: 'targets', label: 'Targets' },
                    { key: 'rec', label: 'REC' },
                    { key: 'recYardsAfterCatch', label: 'YAC' },
                    { key: 'recFirstDowns', label: '1st Downs' },
                    { key: 'recLong', label: 'Long' },
                    { key: 'recDrops', label: 'Drops' },
                    { key: 'fumblesTotal', label: 'Fumbles' },
                    { key: 'fumblesLost', label: 'Fumbles Lost' },
                    { key: 'snapcountsOffense', label: 'Snaps' },
                    { key: 'snapcountsOffensePercentage', label: 'Snap %' }
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
                    { key: 'position', label: 'Pos' },
                    { key: 'tacklesTotal', label: 'Tackles' },
                    { key: 'tacklesSolo', label: 'Solo' },
                    { key: 'tacklesAssists', label: 'Assists' },
                    { key: 'tacklesLoss', label: 'TFL' },
                    { key: 'sacks', label: 'Sacks' },
                    { key: 'defensivePressures', label: 'Pressures' },
                    { key: 'defensiveHits', label: 'Hits' },
                    { key: 'defensiveHurries', label: 'Hurries' },
                    { key: 'defensivePassesDefended', label: 'PD' },
                    { key: 'defensiveInterceptions', label: 'INT' },
                    { key: 'fumblesForced', label: 'FF' },
                    { key: 'fumblesRecovered', label: 'FR' },
                    { key: 'snapcountsDefense', label: 'Snaps' },
                    { key: 'snapcountsDefensePercentage', label: 'Snap %' }
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
                    { key: 'position', label: 'Pos' },
                    { key: 'tacklesTotal', label: 'Tackles' },
                    { key: 'tacklesSolo', label: 'Solo' },
                    { key: 'tacklesAssists', label: 'Assists' },
                    { key: 'tacklesLoss', label: 'TFL' },
                    { key: 'sacks', label: 'Sacks' },
                    { key: 'defensivePressures', label: 'Pressures' },
                    { key: 'defensiveHits', label: 'Hits' },
                    { key: 'defensiveHurries', label: 'Hurries' },
                    { key: 'defensivePassesDefended', label: 'PD' },
                    { key: 'defensiveInterceptions', label: 'INT' },
                    { key: 'fumblesForced', label: 'FF' },
                    { key: 'fumblesRecovered', label: 'FR' },
                    { key: 'snapcountsDefense', label: 'Snaps' },
                    { key: 'snapcountsDefensePercentage', label: 'Snap %' }
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
                    { key: 'position', label: 'Pos' },
                    { key: 'tacklesTotal', label: 'Tackles' },
                    { key: 'tacklesSolo', label: 'Solo' },
                    { key: 'tacklesAssists', label: 'Assists' },
                    { key: 'defensiveInterceptions', label: 'INT' },
                    { key: 'defensivePassesDefended', label: 'PD' },
                    { key: 'defensiveInterceptionYards', label: 'INT Yds' },
                    { key: 'defensiveInterceptionTouchdowns', label: 'INT TD' },
                    { key: 'defensiveInterceptionLong', label: 'INT Long' },
                    { key: 'fumblesForced', label: 'FF' },
                    { key: 'fumblesRecovered', label: 'FR' },
                    { key: 'fumbleRecoveryYards', label: 'FR Yds' },
                    { key: 'fumbleRecoveryTouchdowns', label: 'FR TD' },
                    { key: 'snapcountsDefense', label: 'Snaps' },
                    { key: 'snapcountsDefensePercentage', label: 'Snap %' }
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
                    { key: 'fieldGoalsMade', label: 'FG Made' },
                    { key: 'fieldGoalsAttempted', label: 'FG Att' },
                    { key: 'fieldGoalPercentage', label: 'FG %' },
                    { key: 'fieldGoalLong', label: 'FG Long' },
                    { key: 'extraPointsMade', label: 'XP Made' },
                    { key: 'extraPointsAttempted', label: 'XP Att' },
                    { key: 'punts', label: 'Punts' },
                    { key: 'puntYards', label: 'Punt Yds' },
                    { key: 'puntAverage', label: 'Punt Avg' },
                    { key: 'puntLong', label: 'Punt Long' },
                    { key: 'puntInside20', label: 'Inside 20' },
                    { key: 'kickReturns', label: 'KR' },
                    { key: 'kickReturnYards', label: 'KR Yds' },
                    { key: 'kickReturnTouchdowns', label: 'KR TD' },
                    { key: 'puntReturns', label: 'PR' },
                    { key: 'puntReturnYards', label: 'PR Yds' },
                    { key: 'puntReturnTouchdowns', label: 'PR TD' }
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
