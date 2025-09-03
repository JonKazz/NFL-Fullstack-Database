import React, { useState, useEffect } from 'react';
import styles from './PlayerStats.module.css';
import { Link } from 'react-router-dom';
import { fetchPlayerProfile } from '../../api/fetches';

function PlayerStats({ gamePlayerStats, teams }) {
  const [playerProfiles, setPlayerProfiles] = useState({});
  const [sortConfig, setSortConfig] = useState({
    passing: { column: 'passYds', direction: 'desc' },
    rushing: { column: 'rushYds', direction: 'desc' },
    receiving: { column: 'recYds', direction: 'desc' },
    defense: { column: 'tacklesTotal', direction: 'desc' }
  });

  // Sort function for any column
  const sortData = (data, column, direction) => {
    return [...data].sort((a, b) => {
      const aVal = a[column] || 0;
      const bVal = b[column] || 0;
      
      if (direction === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
  };

  // Handle column header click
  const handleSort = (tableType, column) => {
    setSortConfig(prev => ({
      ...prev,
      [tableType]: {
        column,
        direction: prev[tableType].column === column && prev[tableType].direction === 'desc' ? 'asc' : 'desc'
      }
    }));
  };

  // Get sort indicator
  const getSortIndicator = (tableType, column) => {
    const config = sortConfig[tableType];
    if (config.column === column) {
      return config.direction === 'desc' ? ' ▼' : ' ▲';
    }
    return '';
  };

  // Fetch player profiles for all players in the game
  useEffect(() => {
    const fetchPlayerProfiles = async () => {
      if (!gamePlayerStats || gamePlayerStats.length === 0) return;

      const profiles = {};
      const uniquePlayerNames = [...new Set(gamePlayerStats.map(player => 
        player.playerName
      ))];

      for (const playerName of uniquePlayerNames) {
        try {
          const profile = await fetchPlayerProfile(playerName);
          if (profile && profile.name) {
            profiles[playerName] = profile.name;
          }
        } catch (error) {
          console.warn(`Failed to fetch profile for player ${playerName}:`, error);
          profiles[playerName] = playerName; // Fallback to player name if profile fetch fails
        }
      }
      
      setPlayerProfiles(profiles);
    };

    fetchPlayerProfiles();
  }, [gamePlayerStats]);

  // Get player name from profiles or fallback to player name
  const getPlayerName = (playerName) => {
    return playerProfiles[playerName] || playerName;
  };

  // Process player stats by position
  const processPlayerStats = (players) => {
    const quarterbacks = [];
    const runningBacks = [];
    const receivers = [];
    const defensiveLine = [];
    const linebackers = [];
    const defensiveBacks = [];
    const specialTeams = [];

    players.forEach(player => {
      // Map the backend field names to the expected format
      const mappedPlayer = {
        playerName: player.playerName,
        playerId: player.playerId,
        position: player.position,
        teamId: player.teamId,
        // Passing stats
        passYds: player.passYards || 0,
        passTd: player.passTouchdowns || 0,
        passInt: player.passInterceptions || 0,
        passAtt: player.passAttempts || 0,
        passCmp: player.passCompletions || 0,
        passRating: player.passRating || 0,
        passSacked: player.passSacked || 0,
        passSackedYards: player.passSackedYards || 0,
        passLong: player.passLong || 0,
        passFirstDowns: player.passFirstDowns || 0,
        // Rushing stats
        rushYds: player.rushYards || 0,
        rushTd: player.rushTouchdowns || 0,
        rushAtt: player.rushAttempts || 0,
        rushLong: player.rushLong || 0,
        rushFirstDowns: player.rushFirstDowns || 0,
        // Receiving stats
        rec: player.receivingReceptions || 0,
        recYds: player.receivingYards || 0,
        recTd: player.receivingTouchdowns || 0,
        targets: player.receivingTargets || 0,
        recLong: player.receivingLong || 0,
        recYardsAfterCatch: player.receivingYardsAfterCatch || 0,
        recFirstDowns: player.receivingFirstDowns || 0,
        recDrops: player.receivingDrops || 0,
        // Defensive stats
        sacks: player.defensiveSacks || 0,
        tacklesTotal: player.defensiveTacklesCombined || 0,
        soloTackles: player.defensiveTacklesSolo || 0,
        tacklesAssists: player.defensiveTacklesAssists || 0,
        defInt: player.defensiveInterceptions || 0,
        defIntYards: player.defensiveInterceptionYards || 0,
        defIntTouchdowns: player.defensiveInterceptionTouchdowns || 0,
        passDefended: player.defensivePassesDefended || 0,
        tacklesLoss: player.defensiveTacklesLoss || 0,
        qbHits: player.defensiveQbHits || 0,
        pressures: player.defensivePressures || 0,
        qbHurries: player.defensiveQbHurries || 0,
        missedTackles: player.defensiveTacklesMissed || 0,
        fumblesForced: player.fumblesForced || 0,
        // Fumble stats
        fumblesTotal: player.fumblesTotal || 0,
        fumblesLost: player.fumblesLost || 0,
        // Kicking stats
        fgm: player.fieldGoalsMade || 0,
        fga: player.fieldGoalsAttempted || 0,
        xpm: player.extraPointsMade || 0,
        xpa: player.extraPointsAttempted || 0,
        // Punting stats
        punt: player.punts || 0,
        puntYds: player.puntYards || 0,
        puntLong: player.puntLong || 0,
        // Snap count stats
        snapcountsOffense: player.snapcountsOffense || 0,
        snapcountsOffensePercentage: player.snapcountsOffensePercentage || 0
      };

      const position = mappedPlayer.position;
      if (position === 'QB') {
        quarterbacks.push(mappedPlayer);
      } else if (position === 'RB' || position === 'FB') {
        runningBacks.push(mappedPlayer);
      } else if (position === 'WR' || position === 'TE') {
        receivers.push(mappedPlayer);
      } else if (position === 'DT' || position === 'DE' || position === 'NT') {
        defensiveLine.push(mappedPlayer);
      } else if (position === 'LB' || position === 'OLB' || position === 'ILB' || position === 'MLB') {
        linebackers.push(mappedPlayer);
      } else if (position === 'CB' || position === 'S' || position === 'FS' || position === 'SS') {
        defensiveBacks.push(mappedPlayer);
      } else if (position === 'K' || position === 'P' || position === 'LS') {
        specialTeams.push(mappedPlayer);
      }
    });

    return {
      quarterbacks,
      runningBacks,
      receivers,
      defensiveLine,
      linebackers,
      defensiveBacks,
      specialTeams
    };
  };

  // Process the player stats
  const playerStats = processPlayerStats(gamePlayerStats);

  // Get team names for display
  const getTeamName = (teamId) => {
    if (!teamId) return 'N/A';
    const team = teams.find(t => t.teamId === teamId);
    return team?.city || teamId.toUpperCase();
  };

  return (
    <div className={styles['player-stats']}>
      <h3>Player Statistics</h3>
      
      {playerStats.quarterbacks.filter(player => player.passAtt > 0).length > 0 && (
        <>
          <h4>Passing</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th onClick={() => handleSort('passing', 'playerName')} style={{ cursor: 'pointer' }}>
                  Player{getSortIndicator('passing', 'playerName')}
                </th>
                <th onClick={() => handleSort('passing', 'teamId')} style={{ cursor: 'pointer' }}>
                  Team{getSortIndicator('passing', 'teamId')}
                </th>
                <th onClick={() => handleSort('passing', 'passCmp')} style={{ cursor: 'pointer' }}>
                  Cmp/Att{getSortIndicator('passing', 'passCmp')}
                </th>
                <th onClick={() => handleSort('passing', 'passYds')} style={{ cursor: 'pointer' }}>
                  Yards{getSortIndicator('passing', 'passYds')}
                </th>
                <th onClick={() => handleSort('passing', 'passTd')} style={{ cursor: 'pointer' }}>
                  TD{getSortIndicator('passing', 'passTd')}
                </th>
                <th onClick={() => handleSort('passing', 'passInt')} style={{ cursor: 'pointer' }}>
                  INT{getSortIndicator('passing', 'passInt')}
                </th>
                <th onClick={() => handleSort('passing', 'passRating')} style={{ cursor: 'pointer' }}>
                  Rating{getSortIndicator('passing', 'passRating')}
                </th>
                <th onClick={() => handleSort('passing', 'passFirstDowns')} style={{ cursor: 'pointer' }}>
                  1st Downs{getSortIndicator('passing', 'passFirstDowns')}
                </th>
                <th onClick={() => handleSort('passing', 'passSacked')} style={{ cursor: 'pointer' }}>
                  Sacks{getSortIndicator('passing', 'passSacked')}
                </th>
                <th onClick={() => handleSort('passing', 'passSackedYards')} style={{ cursor: 'pointer' }}>
                  Sack Yds{getSortIndicator('passing', 'passSackedYards')}
                </th>
                <th onClick={() => handleSort('passing', 'passLong')} style={{ cursor: 'pointer' }}>
                  Long{getSortIndicator('passing', 'passLong')}
                </th>
                <th onClick={() => handleSort('passing', 'fumblesTotal')} style={{ cursor: 'pointer' }}>
                  Fumbles{getSortIndicator('passing', 'fumblesTotal')}
                </th>
                <th onClick={() => handleSort('passing', 'fumblesLost')} style={{ cursor: 'pointer' }}>
                  Fumbles Lost{getSortIndicator('passing', 'fumblesLost')}
                </th>
                <th onClick={() => handleSort('passing', 'snapcountsOffense')} style={{ cursor: 'pointer' }}>
                  Snaps{getSortIndicator('passing', 'snapcountsOffense')}
                </th>
                <th onClick={() => handleSort('passing', 'snapcountsOffensePercentage')} style={{ cursor: 'pointer' }}>
                  Snap %{getSortIndicator('passing', 'snapcountsOffensePercentage')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortData(
                playerStats.quarterbacks.filter(player => player.passAtt > 0),
                sortConfig.passing.column,
                sortConfig.passing.direction
              ).map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-link']}
                    >
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.passCmp}/{player.passAtt}</td>
                  <td>{player.passYds}</td>
                  <td>{player.passTd}</td>
                  <td>{player.passInt}</td>
                  <td>{player.passRating || 'N/A'}</td>
                  <td>{player.passFirstDowns || 0}</td>
                  <td>{player.passSacked || 0}</td>
                  <td>{player.passSackedYards || 0}</td>
                  <td>{player.passLong || 'N/A'}</td>
                  <td>{player.fumblesTotal || 0}</td>
                  <td>{player.fumblesLost || 0}</td>
                  <td>{player.snapcountsOffense || 0}</td>
                  <td>{player.snapcountsOffensePercentage || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {playerStats.runningBacks.filter(player => player.rushAtt > 0).length > 0 && (
        <>
          <h4>Rushing</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th onClick={() => handleSort('rushing', 'playerName')} style={{ cursor: 'pointer' }}>
                  Player{getSortIndicator('rushing', 'playerName')}
                </th>
                <th onClick={() => handleSort('rushing', 'teamId')} style={{ cursor: 'pointer' }}>
                  Team{getSortIndicator('rushing', 'teamId')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushYds')} style={{ cursor: 'pointer' }}>
                  Yards{getSortIndicator('rushing', 'rushYds')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushAtt')} style={{ cursor: 'pointer' }}>
                  Attempts{getSortIndicator('rushing', 'rushAtt')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushYds')} style={{ cursor: 'pointer' }}>
                  YPA{getSortIndicator('rushing', 'rushYds')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushTd')} style={{ cursor: 'pointer' }}>
                  TD{getSortIndicator('rushing', 'rushTd')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushLong')} style={{ cursor: 'pointer' }}>
                  Long{getSortIndicator('rushing', 'rushLong')}
                </th>
                <th onClick={() => handleSort('rushing', 'rushFirstDowns')} style={{ cursor: 'pointer' }}>
                  1st Downs{getSortIndicator('rushing', 'rushFirstDowns')}
                </th>
                <th onClick={() => handleSort('rushing', 'fumblesTotal')} style={{ cursor: 'pointer' }}>
                  Fumbles{getSortIndicator('rushing', 'fumblesTotal')}
                </th>
                <th onClick={() => handleSort('rushing', 'fumblesLost')} style={{ cursor: 'pointer' }}>
                  Fumbles Lost{getSortIndicator('rushing', 'fumblesLost')}
                </th>
                <th onClick={() => handleSort('rushing', 'snapcountsOffense')} style={{ cursor: 'pointer' }}>
                  Snaps{getSortIndicator('rushing', 'snapcountsOffense')}
                </th>
                <th onClick={() => handleSort('rushing', 'snapcountsOffensePercentage')} style={{ cursor: 'pointer' }}>
                  Snap %{getSortIndicator('rushing', 'snapcountsOffensePercentage')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortData(
                playerStats.runningBacks.filter(player => player.rushAtt > 0),
                sortConfig.rushing.column,
                sortConfig.rushing.direction
              ).map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-link']}
                    >
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.rushYds}</td>
                  <td>{player.rushAtt}</td>
                  <td>{player.rushAtt > 0 ? (player.rushYds / player.rushAtt).toFixed(1) : '0.0'}</td>
                  <td>{player.rushTd}</td>
                  <td>{player.rushLong || 'N/A'}</td>
                  <td>{player.rushFirstDowns || 0}</td>
                  <td>{player.fumblesTotal || 0}</td>
                  <td>{player.fumblesLost || 0}</td>
                  <td>{player.snapcountsOffense || 0}</td>
                  <td>{player.snapcountsOffensePercentage || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {playerStats.receivers.length > 0 && (
        <>
          <h4>Receiving</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th onClick={() => handleSort('receiving', 'playerName')} style={{ cursor: 'pointer' }}>
                  Player{getSortIndicator('receiving', 'playerName')}
                </th>
                <th onClick={() => handleSort('receiving', 'teamId')} style={{ cursor: 'pointer' }}>
                  Team{getSortIndicator('receiving', 'teamId')}
                </th>
                <th onClick={() => handleSort('receiving', 'position')} style={{ cursor: 'pointer' }}>
                  Position{getSortIndicator('receiving', 'position')}
                </th>
                <th onClick={() => handleSort('receiving', 'recYds')} style={{ cursor: 'pointer' }}>
                  Yards{getSortIndicator('receiving', 'recYds')}
                </th>
                <th onClick={() => handleSort('receiving', 'targets')} style={{ cursor: 'pointer' }}>
                  Targets/Rec{getSortIndicator('receiving', 'targets')}
                </th>
                <th onClick={() => handleSort('receiving', 'recTd')} style={{ cursor: 'pointer' }}>
                  TD{getSortIndicator('receiving', 'recTd')}
                </th>
                <th onClick={() => handleSort('receiving', 'recYardsAfterCatch')} style={{ cursor: 'pointer' }}>
                  YAC{getSortIndicator('receiving', 'recYardsAfterCatch')}
                </th>
                <th onClick={() => handleSort('receiving', 'recFirstDowns')} style={{ cursor: 'pointer' }}>
                  1st Downs{getSortIndicator('receiving', 'recFirstDowns')}
                </th>
                <th onClick={() => handleSort('receiving', 'recLong')} style={{ cursor: 'pointer' }}>
                  Long{getSortIndicator('receiving', 'recLong')}
                </th>
                <th onClick={() => handleSort('receiving', 'recDrops')} style={{ cursor: 'pointer' }}>
                  Drops{getSortIndicator('receiving', 'recDrops')}
                </th>
                <th onClick={() => handleSort('receiving', 'fumblesTotal')} style={{ cursor: 'pointer' }}>
                  Fumbles{getSortIndicator('receiving', 'fumblesTotal')}
                </th>
                <th onClick={() => handleSort('receiving', 'fumblesLost')} style={{ cursor: 'pointer' }}>
                  Fumbles Lost{getSortIndicator('receiving', 'fumblesLost')}
                </th>
                <th onClick={() => handleSort('receiving', 'snapcountsOffense')} style={{ cursor: 'pointer' }}>
                  Snaps{getSortIndicator('receiving', 'snapcountsOffense')}
                </th>
                <th onClick={() => handleSort('receiving', 'snapcountsOffensePercentage')} style={{ cursor: 'pointer' }}>
                  Snap %{getSortIndicator('receiving', 'snapcountsOffensePercentage')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortData(
                playerStats.receivers.filter(player => player.targets > 0),
                sortConfig.receiving.column,
                sortConfig.receiving.direction
              ).map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-link']}
                    >
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.position}</td>
                  <td>{player.recYds}</td>
                  <td>{player.targets}/{player.rec}</td>
                  <td>{player.recTd}</td>
                  <td>{player.recYardsAfterCatch || 0}</td>
                  <td>{player.recFirstDowns || 0}</td>
                  <td>{player.recLong || 'N/A'}</td>
                  <td>{player.recDrops || 0}</td>
                  <td>{player.fumblesTotal || 0}</td>
                  <td>{player.fumblesLost || 0}</td>
                  <td>{player.snapcountsOffense || 0}</td>
                  <td>{player.snapcountsOffensePercentage || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {playerStats.specialTeams.filter(player => player.position === 'K').length > 0 && (
        <>
          <h4>Kicking</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>FG Made</th>
                <th>FG Attempted</th>
                <th>FG Percentage</th>
                <th>XP Made</th>
                <th>XP Attempted</th>
                <th>XP Percentage</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.specialTeams.filter(player => player.position === 'K').map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerName}`} 
                      className={styles['player-link']}
                    >
                      {getPlayerName(player.playerName)}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.fgm}</td>
                  <td>{player.fga}</td>
                  <td>{player.fga > 0 ? ((player.fgm / player.fga) * 100).toFixed(1) : '0.0'}%</td>
                  <td>{player.xpm}</td>
                  <td>{player.xpa}</td>
                  <td>{player.xpa > 0 ? ((player.xpm / player.xpa) * 100).toFixed(1) : '0.0'}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {playerStats.specialTeams.filter(player => player.position === 'P').length > 0 && (
        <>
          <h4>Punting</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Punts</th>
                <th>Total Yards</th>
                <th>Average</th>
                <th>Long</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.specialTeams.filter(player => player.position === 'P').map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-link']}
                    >
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.punt}</td>
                  <td>{player.puntYds}</td>
                  <td>{player.punt > 0 ? (player.puntYds / player.punt).toFixed(1) : '0.0'}</td>
                  <td>{player.puntLong || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(playerStats.defensiveLine.length > 0 || playerStats.linebackers.length > 0 || playerStats.defensiveBacks.length > 0) && (
        <>
          <h4>Defense</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th onClick={() => handleSort('defense', 'playerName')} style={{ cursor: 'pointer' }}>
                  Player{getSortIndicator('defense', 'playerName')}
                </th>
                <th onClick={() => handleSort('defense', 'teamId')} style={{ cursor: 'pointer' }}>
                  Team{getSortIndicator('defense', 'teamId')}
                </th>
                <th onClick={() => handleSort('defense', 'tacklesTotal')} style={{ cursor: 'pointer' }}>
                  Tackles{getSortIndicator('defense', 'tacklesTotal')}
                </th>
                <th onClick={() => handleSort('defense', 'soloTackles')} style={{ cursor: 'pointer' }}>
                  Solo{getSortIndicator('defense', 'soloTackles')}
                </th>
                <th onClick={() => handleSort('defense', 'tacklesAssists')} style={{ cursor: 'pointer' }}>
                  Assists{getSortIndicator('defense', 'tacklesAssists')}
                </th>
                <th onClick={() => handleSort('defense', 'sacks')} style={{ cursor: 'pointer' }}>
                  Sacks{getSortIndicator('defense', 'sacks')}
                </th>
                <th onClick={() => handleSort('defense', 'defInt')} style={{ cursor: 'pointer' }}>
                  INT{getSortIndicator('defense', 'defInt')}
                </th>
                <th onClick={() => handleSort('defense', 'defIntYards')} style={{ cursor: 'pointer' }}>
                  INT Yds{getSortIndicator('defense', 'defIntYards')}
                </th>
                <th onClick={() => handleSort('defense', 'defIntTouchdowns')} style={{ cursor: 'pointer' }}>
                  INT TD{getSortIndicator('defense', 'defIntTouchdowns')}
                </th>
                <th onClick={() => handleSort('defense', 'passDefended')} style={{ cursor: 'pointer' }}>
                  PD{getSortIndicator('defense', 'passDefended')}
                </th>
                <th onClick={() => handleSort('defense', 'tacklesLoss')} style={{ cursor: 'pointer' }}>
                  TFL{getSortIndicator('defense', 'tacklesLoss')}
                </th>
                <th onClick={() => handleSort('defense', 'qbHits')} style={{ cursor: 'pointer' }}>
                  QB Hits{getSortIndicator('defense', 'qbHits')}
                </th>
                <th onClick={() => handleSort('defense', 'pressures')} style={{ cursor: 'pointer' }}>
                  Pressures{getSortIndicator('defense', 'pressures')}
                </th>
                <th onClick={() => handleSort('defense', 'qbHurries')} style={{ cursor: 'pointer' }}>
                  QB Hurries{getSortIndicator('defense', 'qbHurries')}
                </th>
                <th onClick={() => handleSort('defense', 'missedTackles')} style={{ cursor: 'pointer' }}>
                  Missed Tackles{getSortIndicator('defense', 'missedTackles')}
                </th>
                <th onClick={() => handleSort('defense', 'fumblesForced')} style={{ cursor: 'pointer' }}>
                  FF{getSortIndicator('defense', 'fumblesForced')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortData(
                [...playerStats.defensiveLine, ...playerStats.linebackers, ...playerStats.defensiveBacks],
                sortConfig.defense.column,
                sortConfig.defense.direction
              ).map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-link']}
                    >
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.tacklesTotal}</td>
                  <td>{player.soloTackles || 0}</td>
                  <td>{player.tacklesAssists || 0}</td>
                  <td>{player.sacks}</td>
                  <td>{player.defInt}</td>
                  <td>{player.defIntYards || 0}</td>
                  <td>{player.defIntTouchdowns || 0}</td>
                  <td>{player.passDefended}</td>
                  <td>{player.tacklesLoss || 0}</td>
                  <td>{player.qbHits || 0}</td>
                  <td>{player.pressures || 0}</td>
                  <td>{player.qbHurries || 0}</td>
                  <td>{player.missedTackles || 0}</td>
                  <td>{player.fumblesForced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {Object.values(playerStats).every(array => array.length === 0) && (
        <p>No player statistics available for this game.</p>
      )}
    </div>
  );
}

export default PlayerStats;
