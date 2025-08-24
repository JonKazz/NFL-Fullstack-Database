import React, { useState, useEffect } from 'react';
import styles from './PlayerStatsTable.module.css';
import { getTeamPrimaryColor, TEAM_MAP } from '../../utils';

  // Helper function to darken hex colors for dark theme
  const darkenColor = (hexColor, amount = 0.6) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken by reducing each component
    const darkR = Math.max(0, Math.floor(r * (1 - amount)));
    const darkG = Math.max(0, Math.floor(g * (1 - amount)));
    const darkB = Math.max(0, Math.floor(b * (1 - amount)));
    
    // Convert back to hex
    return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
  };

function PlayerStatsTable({ playerId, selectedYear, gameStats, seasonSummary, onYearChange }) {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState([]);

  // Fetch available seasons for this player and set default season
  useEffect(() => {
    async function fetchAvailableSeasons() {
      try {
        const response = await fetch(`http://localhost:8080/api/season-stats/player/${playerId}/seasons`);
        if (response.ok) {
          const seasons = await response.json();
          setAvailableSeasons(seasons);
          
          // Set default to most recent season if no year is selected
          if (seasons.length > 0 && !selectedYear) {
            console.log('Setting default season to:', seasons[0], 'from available seasons:', seasons);
            onYearChange(seasons[0]); // seasons[0] should be the most recent (sorted in backend)
          }
        }
      } catch (error) {
        console.error('Error fetching available seasons:', error);
      }
    }

    if (playerId) {
      fetchAvailableSeasons();
    }
  }, [playerId, selectedYear, onYearChange]);


  // Helper function to format stat values
  const formatStat = (value) => {
    if (value === null || value === undefined) return '-';
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(1);
  };

  // Pre-analyze the season to determine which stat categories to show
  const getSeasonStatCategories = (games) => {
    const categories = {
      passing: false,
      rushing: false,
      receiving: false,
      defensive: false,
      kicking: false,
      punting: false,
      returns: false,
      fumbles: false
    };
    
    games.forEach(game => {
      // Passing stats
      if (game.passAttempts && game.passAttempts > 0) categories.passing = true;
      
      // Rushing stats
      if (game.rushAttempts && game.rushAttempts > 0) categories.rushing = true;
      
      // Receiving stats
      if (game.receivingTargets && game.receivingTargets > 0) categories.receiving = true;
      
      // Defensive stats
      if (game.defensiveTacklesCombined && game.defensiveTacklesCombined > 0) categories.defensive = true;
      if (game.defensiveSacks && game.defensiveSacks > 0) categories.defensive = true;
      if (game.defensiveInterceptions && game.defensiveInterceptions > 0) categories.defensive = true;
      if (game.defensivePassesDefended && game.defensivePassesDefended > 0) categories.defensive = true;
      
      // Kicking stats
      if (game.fieldGoalsAttempted && game.fieldGoalsAttempted > 0) categories.kicking = true;
      if (game.extraPointsAttempted && game.extraPointsAttempted > 0) categories.kicking = true;
      
      // Punting stats
      if (game.punts && game.punts > 0) categories.punting = true;
      
      // Return stats
      if (game.kickReturns && game.kickReturns > 0) categories.returns = true;
      if (game.puntReturns && game.puntReturns > 0) categories.returns = true;
      
      // Fumbles
      if (game.fumblesTotal && game.fumblesTotal > 0) categories.fumbles = true;
    });
    
    return categories;
  };

  // Get stat categories for this season
  const statCategories = getSeasonStatCategories(gameStats || []);

  // Build offensive table headers
  const buildOffensiveHeaders = () => {
    const headers = ['Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
    if (statCategories.passing) {
      headers.push('CMP', 'Att', 'Yds', 'TD', 'Int', 'Rate');
    }
    
    if (statCategories.rushing) {
      headers.push('Att', 'Yds', 'TD');
    }
    
    if (statCategories.receiving) {
      headers.push('TGT', 'Rec', 'Yds', 'TD');
    }
    
    if (statCategories.fumbles) {
      headers.push('Fumbles', 'Lost');
    }
    
    return headers;
  };

  // Build defensive table headers
  const buildDefensiveHeaders = () => {
    const headers = ['Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
    if (statCategories.defensive) {
      headers.push('Tackles', 'Solo', 'Assist', 'Sacks', 'INT', 'PD');
    }
    
    return headers;
  };

  // Build special teams table headers
  const buildSpecialTeamsHeaders = () => {
    const headers = ['Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
    if (statCategories.kicking) {
      headers.push('FG Made', 'FG Att', 'XP Made', 'XP Att');
    }
    
    if (statCategories.punting) {
      headers.push('Punts', 'Yds');
    }
    
    if (statCategories.returns) {
      headers.push('KR', 'Yds', 'TD', 'PR', 'Yds', 'TD');
    }
    
    return headers;
  };

  // Build offensive row data for a specific game
  const buildOffensiveRow = (game) => {
    // Format date by removing week name (take everything after first space)
    const formattedDate = game.date ? game.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = game.winningTeamId === game.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${game.teamId === game.homeTeamId ? game.homeScore : game.awayScore} - ${game.teamId === game.homeTeamId ? game.awayScore : game.homeScore}`;
    
    const row = [
      formattedDate,
      TEAM_MAP[game.teamId]?.city || game.teamId,
      TEAM_MAP[game.opponent]?.city || game.opponent,
      score,
      winLoss
    ];
    
    if (statCategories.passing) {
      row.push(
        formatStat(game.passCompletions),
        formatStat(game.passAttempts),
        formatStat(game.passYards),
        formatStat(game.passTouchdowns),
        formatStat(game.passInterceptions),
        formatStat(game.passRating)
      );
    }
    
    if (statCategories.rushing) {
      row.push(
        formatStat(game.rushAttempts),
        formatStat(game.rushYards),
        formatStat(game.rushTouchdowns)
      );
    }
    
    if (statCategories.receiving) {
      row.push(
        formatStat(game.receivingTargets),
        formatStat(game.receivingReceptions),
        formatStat(game.receivingYards),
        formatStat(game.receivingTouchdowns)
      );
    }
    
    if (statCategories.fumbles) {
      row.push(
        formatStat(game.fumblesTotal),
        formatStat(game.fumblesLost)
      );
    }
    
    return row;
  };

  // Build defensive row data for a specific game
  const buildDefensiveRow = (game) => {
    // Format date by removing week name (take everything after first space)
    const formattedDate = game.date ? game.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = game.winningTeamId === game.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${game.teamId === game.homeTeamId ? game.homeScore : game.awayScore} - ${game.teamId === game.homeTeamId ? game.awayScore : game.homeScore}`;
    
    const row = [
      formattedDate,
      TEAM_MAP[game.teamId]?.city || game.teamId,
      TEAM_MAP[game.opponent]?.city || game.opponent,
      score,
      winLoss
    ];
    
    if (statCategories.defensive) {
      row.push(
        formatStat(game.defensiveTacklesCombined),
        formatStat(game.defensiveTacklesSolo),
        formatStat(game.defensiveTacklesAssists),
        formatStat(game.defensiveSacks),
        formatStat(game.defensiveInterceptions),
        formatStat(game.defensivePassesDefended)
      );
    }
    
    return row;
  };

  // Build special teams row data for a specific game
  const buildSpecialTeamsRow = (game) => {
    // Format date by removing week name (take everything after first space)
    const formattedDate = game.date ? game.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = game.winningTeamId === game.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${game.teamId === game.homeTeamId ? game.homeScore : game.awayScore} - ${game.teamId === game.homeTeamId ? game.awayScore : game.homeScore}`;
    
    const row = [
      formattedDate,
      TEAM_MAP[game.teamId]?.city || game.teamId,
      TEAM_MAP[game.opponent]?.city || game.opponent,
      score,
      winLoss
    ];
    
    if (statCategories.kicking) {
      row.push(
        formatStat(game.fieldGoalsMade),
        formatStat(game.fieldGoalsAttempted),
        formatStat(game.extraPointsMade),
        formatStat(game.extraPointsAttempted)
      );
    }
    
    if (statCategories.punting) {
      row.push(
        formatStat(game.punts),
        formatStat(game.puntYards)
      );
    }
    
    if (statCategories.returns) {
      row.push(
        formatStat(game.kickReturns),
        formatStat(game.kickReturnYards),
        formatStat(game.kickReturnTouchdowns),
        formatStat(game.puntReturns),
        formatStat(game.puntReturnYards),
        formatStat(game.puntReturnTouchdowns)
      );
    }
    
    return row;
  };

  // Build offensive group headers
  const buildOffensiveGroupHeaders = () => {
    const groupHeaders = [];
    
    // Basic info columns (Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 5 });
    
    if (statCategories.passing) {
      groupHeaders.push({ label: 'Passing', colspan: 6 });
    }
    
    if (statCategories.rushing) {
      groupHeaders.push({ label: 'Rushing', colspan: 3 });
    }
    
    if (statCategories.receiving) {
      groupHeaders.push({ label: 'Receiving', colspan: 4 });
    }
    
    if (statCategories.fumbles) {
      groupHeaders.push({ label: 'Fumbles', colspan: 2 });
    }
    
    return groupHeaders;
  };

  // Build defensive group headers
  const buildDefensiveGroupHeaders = () => {
    const groupHeaders = [];
    
    // Basic info columns (Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 5 });
    
    if (statCategories.defensive) {
      groupHeaders.push({ label: 'Defense', colspan: 6 });
    }
    
    return groupHeaders;
  };

  // Build special teams group headers
  const buildSpecialTeamsGroupHeaders = () => {
    const groupHeaders = [];
    
    // Basic info columns (Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 5 });
    
    if (statCategories.kicking) {
      groupHeaders.push({ label: 'Kicking', colspan: 4 });
    }
    
    if (statCategories.punting) {
      groupHeaders.push({ label: 'Punting', colspan: 2 });
    }
    
    if (statCategories.returns) {
      groupHeaders.push({ label: 'Returns', colspan: 6 });
    }
    
    return groupHeaders;
  };

  // Build offensive summary row
  const buildOffensiveSummaryRow = () => {
    if (!seasonSummary) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add empty cells for team, opponent, score, and W/L columns
    summary.push('-', '-', '-', '-');
    
    if (statCategories.passing) {
      summary.push(
        formatStat(seasonSummary.totalPassCompletions),
        formatStat(seasonSummary.totalPassAttempts),
        formatStat(seasonSummary.totalPassYards),
        formatStat(seasonSummary.totalPassTouchdowns),
        formatStat(seasonSummary.totalPassInterceptions),
        formatStat(seasonSummary.avgPassRating)
      );
    }
    
    if (statCategories.rushing) {
      summary.push(
        formatStat(seasonSummary.totalRushAttempts),
        formatStat(seasonSummary.totalRushYards),
        formatStat(seasonSummary.totalRushTouchdowns)
      );
    }
    
    if (statCategories.receiving) {
      summary.push(
        formatStat(seasonSummary.totalReceivingTargets),
        formatStat(seasonSummary.totalReceivingReceptions),
        formatStat(seasonSummary.totalReceivingYards),
        formatStat(seasonSummary.totalReceivingTouchdowns)
      );
    }
    
    if (statCategories.fumbles) {
      summary.push(
        formatStat(seasonSummary.totalFumblesTotal),
        formatStat(seasonSummary.totalFumblesLost)
      );
    }
    
    return summary;
  };

  // Build defensive summary row
  const buildDefensiveSummaryRow = () => {
    if (!seasonSummary) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add empty cells for team, opponent, score, and W/L columns
    summary.push('-', '-', '-', '-');
    
    if (statCategories.defensive) {
      summary.push(
        formatStat(seasonSummary.totalDefensiveTacklesCombined),
        formatStat(seasonSummary.totalDefensiveTacklesSolo),
        formatStat(seasonSummary.totalDefensiveTacklesAssists),
        formatStat(seasonSummary.totalDefensiveSacks),
        formatStat(seasonSummary.totalDefensiveInterceptions),
        formatStat(seasonSummary.totalDefensivePassesDefended)
      );
    }
    
    return summary;
  };

  // Build special teams summary row
  const buildSpecialTeamsSummaryRow = () => {
    if (!seasonSummary) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add empty cells for team, opponent, score, and W/L columns
    summary.push('-', '-', '-', '-');
    
    if (statCategories.kicking) {
      summary.push(
        formatStat(seasonSummary.totalFieldGoalsMade),
        formatStat(seasonSummary.totalFieldGoalsAttempted),
        formatStat(seasonSummary.totalExtraPointsMade),
        formatStat(seasonSummary.totalExtraPointsAttempted)
      );
    }
    
    if (statCategories.punting) {
      summary.push(
        formatStat(seasonSummary.totalPunts),
        formatStat(seasonSummary.totalPuntYards)
      );
    }
    
    if (statCategories.returns) {
      summary.push(
        formatStat(seasonSummary.totalKickReturns),
        formatStat(seasonSummary.totalKickReturnYards),
        formatStat(seasonSummary.totalKickReturnTouchdowns),
        formatStat(seasonSummary.totalPuntReturns),
        formatStat(seasonSummary.totalPuntReturnYards),
        formatStat(seasonSummary.totalPuntReturnTouchdowns)
      );
    }
    
    return summary;
  };

  // Check if we have any offensive stats
  const hasOffensiveStats = statCategories.passing || statCategories.rushing || statCategories.receiving || statCategories.fumbles;
  
  // Check if we have any defensive stats
  const hasDefensiveStats = statCategories.defensive;
  
  // Check if we have any special teams stats
  const hasSpecialTeamsStats = statCategories.kicking || statCategories.punting || statCategories.returns;

  return (
    <div className={styles['stats-table-container']}>
      <h3>
        {selectedYear ? (
          <>
            <span className={styles['year-button']} onClick={() => {
              setShowYearDropdown(!showYearDropdown);
            }}>
              {selectedYear}
            </span>
            {' Season Statistics'}
            {showYearDropdown && (
              <div className={styles['year-dropdown']}>
                {availableSeasons.length > 0 ? (
                  availableSeasons.map(year => (
                    <div 
                      key={year} 
                      className={styles['year-option']}
                      onClick={() => {
                        onYearChange(year);
                        setShowYearDropdown(false);
                      }}
                    >
                      {year}
                    </div>
                  ))
                ) : (
                  <div className={styles['year-option']}>Loading seasons...</div>
                )}
              </div>
            )}
          </>
        ) : (
          'Select a Season'
        )}
      </h3>
      
      {!gameStats || gameStats.length === 0 ? (
        <div className={styles['no-stats']}>
          <p>{selectedYear ? `No games found for ${selectedYear}` : 'Please select a season to view statistics'}</p>
        </div>
      ) : (
        <>
          {/* Offensive Stats Table */}
          {hasOffensiveStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>Offensive Statistics</h4>
              <div className={styles['stats-table']}>
                <table>
                  <thead>
                    {/* Group Headers Row */}
                    <tr className={styles['group-headers']}>
                      {buildOffensiveGroupHeaders().map((group, index) => {
                        // Calculate width based on colspan and column type
                        let width;
                        if (index === 0) {
                          // First group: Date(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 410px
                          width = 410;
                        } else {
                          // Stat groups: each column is 40px
                          width = group.colspan * 40;
                        }
                        
                        return (
                          <th 
                            key={index} 
                            colSpan={group.colspan} 
                            className={styles['group-header']}
                            style={{ width: `${width}px` }}
                          >
                            {group.label}
                          </th>
                        );
                      })}
                    </tr>
                    {/* Column Headers Row */}
                    <tr>
                      {buildOffensiveHeaders().map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gameStats.map((game, gameIndex) => {
                      const gameRow = buildOffensiveRow(game);
                      const teamColor = darkenColor(getTeamPrimaryColor(game.teamId));
                      return (
                        <tr 
                          key={gameIndex} 
                          style={{ backgroundColor: teamColor }}
                          className={styles['game-row']}
                        >
                          {gameRow.map((cell, cellIndex) => {
                            let cellClass = '';
                            if (cellIndex === 4) { // W/L column
                              cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                            } else if (cellIndex > 4) { // Stat columns
                              cellClass = styles['stat-cell'];
                            }
                            return (
                              <td key={cellIndex} className={cellClass}>
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Season Summary Row */}
                    {buildOffensiveSummaryRow() && (
                      <tr className={styles['summary-row']}>
                        {buildOffensiveSummaryRow().map((cell, cellIndex) => (
                          <td key={cellIndex} className={cellIndex === 0 ? styles['summary-label'] : styles['summary-cell']}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Defensive Stats Table */}
          {hasDefensiveStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>Defensive Statistics</h4>
              <div className={styles['stats-table']}>
                <table>
                  <thead>
                    {/* Group Headers Row */}
                    <tr className={styles['group-headers']}>
                      {buildDefensiveGroupHeaders().map((group, index) => {
                        // Calculate width based on colspan and column type
                        let width;
                        if (index === 0) {
                          // First group: Date(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 410px
                          width = 410;
                        } else {
                          // Stat groups: each column is 40px
                          width = group.colspan * 40;
                        }
                        
                        return (
                          <th 
                            key={index} 
                            colSpan={group.colspan} 
                            className={styles['group-header']}
                            style={{ width: `${width}px` }}
                          >
                            {group.label}
                          </th>
                        );
                      })}
                    </tr>
                    {/* Column Headers Row */}
                    <tr>
                      {buildDefensiveHeaders().map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gameStats.map((game, gameIndex) => {
                      const gameRow = buildDefensiveRow(game);
                      const teamColor = darkenColor(getTeamPrimaryColor(game.teamId));
                      return (
                        <tr 
                          key={gameIndex} 
                          style={{ backgroundColor: teamColor }}
                          className={styles['game-row']}
                        >
                          {gameRow.map((cell, cellIndex) => {
                            let cellClass = '';
                            if (cellIndex === 4) { // W/L column
                              cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                            } else if (cellIndex > 4) { // Stat columns
                              cellClass = styles['stat-cell'];
                            }
                            return (
                              <td key={cellIndex} className={cellClass}>
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Season Summary Row */}
                    {buildDefensiveSummaryRow() && (
                      <tr className={styles['summary-row']}>
                        {buildDefensiveSummaryRow().map((cell, cellIndex) => (
                          <td key={cellIndex} className={cellIndex === 0 ? styles['summary-label'] : styles['summary-cell']}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Special Teams Stats Table */}
          {hasSpecialTeamsStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>Special Teams Statistics</h4>
              <div className={styles['stats-table']}>
                <table>
                  <thead>
                    {/* Group Headers Row */}
                    <tr className={styles['group-headers']}>
                      {buildSpecialTeamsGroupHeaders().map((group, index) => {
                        // Calculate width based on colspan and column type
                        let width;
                        if (index === 0) {
                          // First group: Date(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 410px
                          width = 410;
                        } else {
                          // Stat groups: each column is 40px
                          width = group.colspan * 40;
                        }
                        
                        return (
                          <th 
                            key={index} 
                            colSpan={group.colspan} 
                            className={styles['group-header']}
                            style={{ width: `${width}px` }}
                          >
                            {group.label}
                          </th>
                        );
                      })}
                    </tr>
                    {/* Column Headers Row */}
                    <tr>
                      {buildSpecialTeamsHeaders().map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                                    <tbody>
                    {gameStats.map((game, gameIndex) => {
                      const gameRow = buildSpecialTeamsRow(game);
                      const teamColor = darkenColor(getTeamPrimaryColor(game.teamId));
                      return (
                        <tr 
                          key={gameIndex} 
                          style={{ backgroundColor: teamColor }}
                          className={styles['game-row']}
                        >
                          {gameRow.map((cell, cellIndex) => {
                            let cellClass = '';
                            if (cellIndex === 4) { // W/L column
                              cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                            } else if (cellIndex > 4) { // Stat columns
                              cellClass = styles['stat-cell'];
                            }
                            return (
                              <td key={cellIndex} className={cellClass}>
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Season Summary Row */}
                    {buildSpecialTeamsSummaryRow() && (
                      <tr className={styles['summary-row']}>
                        {buildSpecialTeamsSummaryRow().map((cell, cellIndex) => (
                          <td key={cellIndex} className={cellIndex === 0 ? styles['summary-label'] : styles['summary-cell']}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {seasonSummary && (
            <div className={styles['season-info']}>
              <p>Games Played: {seasonSummary.gamesPlayed}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PlayerStatsTable;
