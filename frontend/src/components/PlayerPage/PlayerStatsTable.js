import React, { useState, useEffect } from 'react';
import styles from './PlayerStatsTable.module.css';
import { getTeamPrimaryColor, TEAM_MAP } from '../../utils';
import { fetchPlayerAvailableSeasons } from '../../api/fetches';

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

  function PlayerStatsTable({ playerId, selectedYear, gameStats, seasonStats, onYearChange }) {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState([]);

  // Fetch available seasons for this player and set default season
  useEffect(() => {
    async function loadAvailableSeasons() {
      try {
        const seasons = await fetchPlayerAvailableSeasons(playerId);
        setAvailableSeasons(seasons);
        
        // Set default to most recent season if no year is selected
        if (seasons.length > 0 && !selectedYear) {
          console.log('Setting default season to:', seasons[0], 'from available seasons:', seasons);
          onYearChange(seasons[0]); // seasons[0] should be the most recent (sorted in backend)
        }
      } catch (error) {
        console.error('Error fetching available seasons:', error);
      }
    }

    if (playerId) {
      loadAvailableSeasons();
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
      const stats = game.playerStats;
      
      // Passing stats
      if (stats.passAttempts && stats.passAttempts > 0) categories.passing = true;
      
      // Rushing stats
      if (stats.rushAttempts && stats.rushAttempts > 0) categories.rushing = true;
      
      // Receiving stats
      if (stats.receivingTargets && stats.receivingTargets > 0) categories.receiving = true;
      
      // Defensive stats
      if (stats.defensiveTacklesCombined && stats.defensiveTacklesCombined > 0) categories.defensive = true;
      if (stats.defensiveSacks && stats.defensiveSacks > 0) categories.defensive = true;
      if (stats.defensiveInterceptions && stats.defensiveInterceptions > 0) categories.defensive = true;
      if (stats.defensivePassesDefended && stats.defensivePassesDefended > 0) categories.defensive = true;
      
      // Kicking stats
      if (stats.fieldGoalsAttempted && stats.fieldGoalsAttempted > 0) categories.kicking = true;
      if (stats.extraPointsAttempted && stats.extraPointsAttempted > 0) categories.kicking = true;
      
      // Punting stats
      if (stats.punts && stats.punts > 0) categories.punting = true;
      
      // Return stats
      if (stats.kickReturns && stats.kickReturns > 0) categories.returns = true;
      if (stats.puntReturns && stats.puntReturns > 0) categories.returns = true;
      
      // Fumbles
      if (stats.fumblesTotal && stats.fumblesTotal > 0) categories.fumbles = true;
    });
    
    return categories;
  };

  // Get stat categories for this season
  const statCategories = getSeasonStatCategories(gameStats || []);

  // Build offensive table headers for regular season games
  const buildOffensiveHeaders = () => {
    const headers = ['Week', 'Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
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

  // Build offensive table headers for playoff games (includes playoff_game column)
  const buildPlayoffOffensiveHeaders = () => {
    const headers = ['Playoff', 'Team', 'Opponent', 'Score', 'W/L'];
    
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

  // Build defensive table headers for regular season games
  const buildDefensiveHeaders = () => {
    const headers = ['Week', 'Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
    if (statCategories.defensive) {
      headers.push('Tackles', 'Solo', 'Assist', 'Sacks', 'INT', 'PD');
    }
    
    return headers;
  };

  // Build defensive table headers for playoff games (includes playoff_game column)
  const buildPlayoffDefensiveHeaders = () => {
    const headers = ['Playoff', 'Team', 'Opponent', 'Score', 'W/L'];
    
    if (statCategories.defensive) {
      headers.push('Tackles', 'Solo', 'Assist', 'Sacks', 'INT', 'PD');
    }
    
    return headers;
  };

  // Build special teams table headers for regular season games
  const buildSpecialTeamsHeaders = () => {
    const headers = ['Week', 'Date', 'Team', 'Opponent', 'Score', 'W/L'];
    
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

  // Build special teams table headers for playoff games (includes playoff_game column)
  const buildPlayoffSpecialTeamsHeaders = () => {
    const headers = ['Playoff', 'Team', 'Opponent', 'Score', 'W/L'];
    
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
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Format date by removing week name (take everything after first space)
    const formattedDate = gameInfo.date ? gameInfo.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.seasonWeek || '-',
      formattedDate,
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.passing) {
      row.push(
        formatStat(stats.passCompletions),
        formatStat(stats.passAttempts),
        formatStat(stats.passYards),
        formatStat(stats.passTouchdowns),
        formatStat(stats.passInterceptions),
        formatStat(stats.passRating)
      );
    }
    
    if (statCategories.rushing) {
      row.push(
        formatStat(stats.rushAttempts),
        formatStat(stats.rushYards),
        formatStat(stats.rushTouchdowns)
      );
    }
    
    if (statCategories.receiving) {
      row.push(
        formatStat(stats.receivingTargets),
        formatStat(stats.receivingReceptions),
        formatStat(stats.receivingYards),
        formatStat(stats.receivingTouchdowns)
      );
    }
    
    if (statCategories.fumbles) {
      row.push(
        formatStat(stats.fumblesTotal),
        formatStat(stats.fumblesLost)
      );
    }
    
    return row;
  };

  // Build offensive row data for playoff games (includes playoff_game column)
  const buildPlayoffOffensiveRow = (game) => {
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.playoffGame || '-', // Playoff column first
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.passing) {
      row.push(
        formatStat(stats.passCompletions),
        formatStat(stats.passAttempts),
        formatStat(stats.passYards),
        formatStat(stats.passTouchdowns),
        formatStat(stats.passInterceptions),
        formatStat(stats.passRating)
      );
    }
    
    if (statCategories.rushing) {
      row.push(
        formatStat(stats.rushAttempts),
        formatStat(stats.rushYards),
        formatStat(stats.rushTouchdowns)
      );
    }
    
    if (statCategories.receiving) {
      row.push(
        formatStat(stats.receivingTargets),
        formatStat(stats.receivingReceptions),
        formatStat(stats.receivingYards),
        formatStat(stats.receivingTouchdowns)
      );
    }
    
    if (statCategories.fumbles) {
      row.push(
        formatStat(stats.fumblesTotal),
        formatStat(stats.fumblesLost)
      );
    }
    
    return row;
  };

  // Build defensive row data for a specific game
  const buildDefensiveRow = (game) => {
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Format date by removing week name (take everything after first space)
    const formattedDate = gameInfo.date ? gameInfo.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.seasonWeek || '-',
      formattedDate,
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.defensive) {
      row.push(
        formatStat(stats.defensiveTacklesCombined),
        formatStat(stats.defensiveTacklesSolo),
        formatStat(stats.defensiveTacklesAssists),
        formatStat(stats.defensiveSacks),
        formatStat(stats.defensiveInterceptions),
        formatStat(stats.defensivePassesDefended)
      );
    }
    
    return row;
  };

  // Build defensive row data for playoff games (includes playoff_game column)
  const buildPlayoffDefensiveRow = (game) => {
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.playoffGame || '-', // Playoff column first
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.defensive) {
      row.push(
        formatStat(stats.defensiveTacklesCombined),
        formatStat(stats.defensiveTacklesSolo),
        formatStat(stats.defensiveTacklesAssists),
        formatStat(stats.defensiveSacks),
        formatStat(stats.defensiveInterceptions),
        formatStat(stats.defensivePassesDefended)
      );
    }
    
    return row;
  };

  // Build special teams row data for a specific game
  const buildSpecialTeamsRow = (game) => {
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Format date by removing week name (take everything after first space)
    const formattedDate = gameInfo.date ? gameInfo.date.split(' ').slice(1).join(' ') : '';
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.seasonWeek || '-',
      formattedDate,
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.kicking) {
      row.push(
        formatStat(stats.fieldGoalsMade),
        formatStat(stats.fieldGoalsAttempted),
        formatStat(stats.extraPointsMade),
        formatStat(stats.extraPointsAttempted)
      );
    }
    
    if (statCategories.punting) {
      row.push(
        formatStat(stats.punts),
        formatStat(stats.puntYards)
      );
    }
    
    if (statCategories.returns) {
      row.push(
        formatStat(stats.kickReturns),
        formatStat(stats.kickReturnYards),
        formatStat(stats.kickReturnTouchdowns),
        formatStat(stats.puntReturns),
        formatStat(stats.puntReturnYards),
        formatStat(stats.puntReturnTouchdowns)
      );
    }
    
    return row;
  };

  // Build special teams row data for playoff games (includes playoff_game column)
  const buildPlayoffSpecialTeamsRow = (game) => {
    const gameInfo = game.gameInfo;
    const stats = game.playerStats;
    
    // Determine if player's team won
    const isWinner = gameInfo.winningTeamId === stats.teamId;
    const winLoss = isWinner ? 'W' : 'L';
    
    // Format score (team score - opponent score)
    const score = `${stats.teamId === gameInfo.homeTeamId ? gameInfo.homePoints : gameInfo.awayPoints} - ${stats.teamId === gameInfo.homeTeamId ? gameInfo.awayPoints : gameInfo.homePoints}`;
    
    // Get opponent team ID
    const opponent = stats.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
    
    const row = [
      gameInfo.playoffGame || '-', // Playoff column first
      TEAM_MAP[stats.teamId]?.city || stats.teamId,
      TEAM_MAP[opponent]?.city || opponent,
      score,
      winLoss
    ];
    
    if (statCategories.kicking) {
      row.push(
        formatStat(stats.fieldGoalsMade),
        formatStat(stats.fieldGoalsAttempted),
        formatStat(stats.extraPointsMade),
        formatStat(stats.extraPointsAttempted)
      );
    }
    
    if (statCategories.punting) {
      row.push(
        formatStat(stats.punts),
        formatStat(stats.puntYards)
      );
    }
    
    if (statCategories.returns) {
      row.push(
        formatStat(stats.kickReturns),
        formatStat(stats.kickReturnYards),
        formatStat(stats.kickReturnTouchdowns),
        formatStat(stats.puntReturns),
        formatStat(stats.puntReturnYards),
        formatStat(stats.puntReturnTouchdowns)
      );
    }
    
    return row;
  };

  // Build offensive group headers
  const buildOffensiveGroupHeaders = () => {
    const groupHeaders = [];
    
    // Basic info columns (Week, Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 6 });
    
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
    
    // Basic info columns (Week, Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 6 });
    
    if (statCategories.defensive) {
      groupHeaders.push({ label: 'Defense', colspan: 6 });
    }
    
    return groupHeaders;
  };

  // Build special teams group headers
  const buildSpecialTeamsGroupHeaders = () => {
    const groupHeaders = [];
    
    // Basic info columns (Week, Date, Team, Opponent, Score, W/L)
    groupHeaders.push({ label: '', colspan: 6 });
    
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

  // Build offensive group headers for playoff games (includes playoff column)
  const buildPlayoffOffensiveGroupHeaders = () => {
    const groups = [
      { label: 'Game Info', colspan: 5 }, // Playoff, Team, Opponent, Score, W/L
    ];
    
    if (statCategories.passing) {
      groups.push({ label: 'Passing', colspan: 6 });
    }
    
    if (statCategories.rushing) {
      groups.push({ label: 'Rushing', colspan: 3 });
    }
    
    if (statCategories.receiving) {
      groups.push({ label: 'Receiving', colspan: 4 });
    }
    
    if (statCategories.fumbles) {
      groups.push({ label: 'Fumbles', colspan: 2 });
    }
    
    return groups;
  };

  // Build defensive group headers for playoff games (includes playoff column)
  const buildPlayoffDefensiveGroupHeaders = () => {
    const groups = [
      { label: 'Game Info', colspan: 5 }, // Playoff, Team, Opponent, Score, W/L
    ];
    
    if (statCategories.defensive) {
      groups.push({ label: 'Defensive', colspan: 6 });
    }
    
    return groups;
  };

  // Build special teams group headers for playoff games (includes playoff column)
  const buildPlayoffSpecialTeamsGroupHeaders = () => {
    const groups = [
      { label: 'Game Info', colspan: 5 }, // Playoff, Team, Opponent, Score, W/L
    ];
    
    if (statCategories.kicking) {
      groups.push({ label: 'Kicking', colspan: 4 });
    }
    
    if (statCategories.punting) {
      groups.push({ label: 'Punting', colspan: 2 });
    }
    
    if (statCategories.returns) {
      groups.push({ label: 'Returns', colspan: 6 });
    }
    
    return groups;
  };

  // Calculate season win-loss record
  const calculateSeasonRecord = () => {
    if (!gameStats || gameStats.length === 0) return '0-0';
    
    let wins = 0;
    let losses = 0;
    
    gameStats.forEach(game => {
      const isWinningTeam = game.gameInfo.winningTeamId === game.playerStats.teamId;
      const isNotPlayoff = !game.gameInfo.playoffGame;

      if (isNotPlayoff) {
        if (isWinningTeam) {
          wins++;
        } else {
          losses++;
        }
      } 
    });
    
    return `${wins}-${losses}`;
  };

  // Build offensive summary row
  const buildOffensiveSummaryRow = () => {
    if (!seasonStats) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add week, team, opponent, score, and season record
    summary.push('-', '-', '-', '-', calculateSeasonRecord());
    
    if (statCategories.passing) {
      summary.push(
        formatStat(seasonStats.passingCompletions),
        formatStat(seasonStats.passingAttempts),
        formatStat(seasonStats.passingYards),
        formatStat(seasonStats.passingTouchdowns),
        formatStat(seasonStats.passingInterceptions),
        formatStat(seasonStats.passerRating)
      );
    }
    
    if (statCategories.rushing) {
      summary.push(
        formatStat(seasonStats.rushingAttempts),
        formatStat(seasonStats.rushingYards),
        formatStat(seasonStats.rushingTouchdowns)
      );
    }
    
    if (statCategories.receiving) {
      summary.push(
        formatStat(seasonStats.receivingTargets),
        formatStat(seasonStats.receivingReceptions),
        formatStat(seasonStats.receivingYards),
        formatStat(seasonStats.receivingTouchdowns)
      );
    }
    
    if (statCategories.fumbles) {
      // Only fumblesLost is available in season stats
      summary.push('-', formatStat(seasonStats.fumblesLost));
    }
    
    return summary;
  };

  // Build defensive summary row
  const buildDefensiveSummaryRow = () => {
    if (!seasonStats) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add week, team, opponent, score, and season record
    summary.push('-', '-', '-', '-', calculateSeasonRecord());
    
    if (statCategories.defensive) {
      summary.push(
        formatStat(seasonStats.defensiveTacklesCombined),
        '-', // defensiveTacklesSolo not available in season stats
        '-', // defensiveTacklesAssists not available in season stats
        formatStat(seasonStats.defensiveSacks),
        formatStat(seasonStats.defensiveInterceptions),
        formatStat(seasonStats.defensivePassesDefended)
      );
    }
    
    return summary;
  };

  // Build special teams summary row
  const buildSpecialTeamsSummaryRow = () => {
    if (!seasonStats) return null;
    
    const summary = ['SEASON TOTAL'];
    
    // Add week, team, opponent, score, and season record
    summary.push('-', '-', '-', '-', calculateSeasonRecord());
    
    if (statCategories.kicking) {
      summary.push(
        formatStat(seasonStats.fieldGoalsMade),
        formatStat(seasonStats.fieldGoalsAttempted),
        formatStat(seasonStats.extraPointsMade),
        formatStat(seasonStats.extraPointsAttempted)
      );
    }
    
    if (statCategories.punting) {
      summary.push(
        formatStat(seasonStats.punts),
        formatStat(seasonStats.puntYards)
      );
    }
    
    if (statCategories.returns) {
      // Return stats are not available in season stats, so we'll show dashes
      summary.push('-', '-', '-', '-', '-', '-');
    }
    
    return summary;
  };

  // Check if we have any offensive stats
  const hasOffensiveStats = statCategories.passing || statCategories.rushing || statCategories.receiving || statCategories.fumbles;
  
  // Check if we have any defensive stats
  const hasDefensiveStats = statCategories.defensive;
  
  // Check if we have any special teams stats
  const hasSpecialTeamsStats = statCategories.kicking || statCategories.punting || statCategories.returns;

  // Separate regular season and playoff games
  const regularSeasonGames = gameStats ? gameStats.filter(game => {
    // A game is regular season if playoffGame is null, undefined, or empty string
    return !game.gameInfo.playoffGame || game.gameInfo.playoffGame === '' || game.gameInfo.playoffGame === null;
  }).sort((a, b) => {
    return (a.gameInfo.seasonWeek || 0) - (b.gameInfo.seasonWeek || 0);
  }) : [];
  
  const playoffGames = gameStats ? gameStats.filter(game => {
    // A game is playoff if playoffGame has a non-empty string value
    return game.gameInfo.playoffGame && game.gameInfo.playoffGame !== '' && game.gameInfo.playoffGame !== null;
  }).sort((a, b) => {
    // Sort playoff games by playoff type (Wild Card, Divisional, Conference Championship, Superbowl)
    const playoffOrder = { 
      'Wild Card': 1, 
      'Divisional': 2, 
      'Conference Championship': 3, 
      'Superbowl': 4 
    };
    return (playoffOrder[a.gameInfo.playoffGame] || 0) - (playoffOrder[b.gameInfo.playoffGame] || 0);
  }) : [];

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
          {/* Offensive Stats Table - Combined Container */}
          {hasOffensiveStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>OFFENSIVE STATISTICS</h4>
              
              {/* Regular Season Offensive Table */}
              {regularSeasonGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Regular Season</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildOffensiveGroupHeaders().map((group, index) => {
                            // Calculate width based on colspan and column type
                            let width;
                            if (index === 0) {
                              // First group: Week(50) + Date(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 460px
                              width = 460;
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
                        {regularSeasonGames.map((game, gameIndex) => {
                          const gameRow = buildOffensiveRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={gameIndex} 
                              style={{ backgroundColor: teamColor }}
                              className={styles['game-row']}
                            >
                              {gameRow.map((cell, cellIndex) => {
                                let cellClass = '';
                                if (cellIndex === 5) { // W/L column (index 5 in regular season: Week, Date, Team, Opponent, Score, W/L)
                                  cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                                } else if (cellIndex > 5) { // Stat columns
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

              {/* Playoff Offensive Table */}
              {playoffGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Playoff</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildPlayoffOffensiveGroupHeaders().map((group, index) => {
                            let width;
                            if (index === 0) {
                              // First group: Week(50) + Date(80) + Playoff(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 540px
                              width = 540;
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
                          {buildPlayoffOffensiveHeaders().map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {playoffGames.map((game, gameIndex) => {
                          const gameRow = buildPlayoffOffensiveRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={`playoff-offensive-${gameIndex}`} 
                              style={{ backgroundColor: teamColor }}
                              className={styles['game-row']}
                            >
                              {gameRow.map((cell, cellIndex) => {
                                let cellClass = '';
                                if (cellIndex === 4) { // W/L column (now at index 4 since we removed Week and Date)
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Defensive Stats Table */}
          {hasDefensiveStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>DEFENSIVE STATISTICS</h4>
              
              {/* Regular Season Defensive Table */}
              {regularSeasonGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Regular Season</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildDefensiveGroupHeaders().map((group, index) => {
                            let width;
                            if (index === 0) {
                              width = 460;
                            } else {
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
                        {regularSeasonGames.map((game, gameIndex) => {
                          const gameRow = buildDefensiveRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={gameIndex} 
                              style={{ backgroundColor: teamColor }}
                              className={styles['game-row']}
                            >
                              {gameRow.map((cell, cellIndex) => {
                                let cellClass = '';
                                if (cellIndex === 5) { // W/L column (index 5 in regular season: Week, Date, Team, Opponent, Score, W/L)
                                  cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                                } else if (cellIndex > 5) { // Stat columns
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

              {/* Playoff Defensive Table */}
              {playoffGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Playoff</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildPlayoffDefensiveGroupHeaders().map((group, index) => {
                            let width;
                            if (index === 0) {
                              // First group: Playoff(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 410px
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
                          {buildPlayoffDefensiveHeaders().map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {playoffGames.map((game, gameIndex) => {
                          const gameRow = buildPlayoffDefensiveRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={`playoff-defensive-${gameIndex}`} 
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special Teams Stats Table */}
          {hasSpecialTeamsStats && (
            <div className={styles['stats-section']}>
              <h4 className={styles['table-title']}>SPECIAL TEAMS STATISTICS</h4>
              
              {/* Regular Season Special Teams Table */}
              {regularSeasonGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Regular Season</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildSpecialTeamsGroupHeaders().map((group, index) => {
                            let width;
                            if (index === 0) {
                              width = 460;
                            } else {
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
                        {regularSeasonGames.map((game, gameIndex) => {
                          const gameRow = buildSpecialTeamsRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={gameIndex} 
                              style={{ backgroundColor: teamColor }}
                              className={styles['game-row']}
                            >
                              {gameRow.map((cell, cellIndex) => {
                                let cellClass = '';
                                if (cellIndex === 5) { // W/L column (index 5 in regular season: Week, Date, Team, Opponent, Score, W/L)
                                  cellClass = `${styles['win-loss-cell']} ${cell === 'W' ? styles['win'] : styles['loss']}`;
                                } else if (cellIndex > 5) { // Stat columns
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

              {/* Playoff Special Teams Table */}
              {playoffGames.length > 0 && (
                <div className={styles['sub-table-container']}>
                  <div className={styles['sub-table-label']}>Playoff</div>
                  <div className={styles['stats-table']}>
                    <table>
                      <thead>
                        {/* Group Headers Row */}
                        <tr className={styles['group-headers']}>
                          {buildPlayoffSpecialTeamsGroupHeaders().map((group, index) => {
                            let width;
                            if (index === 0) {
                              // First group: Playoff(80) + Team(100) + Opponent(100) + Score(70) + W/L(60) = 410px
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
                          {buildPlayoffSpecialTeamsHeaders().map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {playoffGames.map((game, gameIndex) => {
                          const gameRow = buildPlayoffSpecialTeamsRow(game);
                          const teamColor = darkenColor(getTeamPrimaryColor(game.playerStats.teamId));
                          return (
                            <tr 
                              key={`playoff-special-${gameIndex}`} 
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PlayerStatsTable;