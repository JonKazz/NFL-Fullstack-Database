import React from 'react';
import styles from './PlayerStats.module.css';
import { Link } from 'react-router-dom';

function PlayerStats({ gamePlayerStats, teams }) {
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
        playerId: player.id?.playerId || player.playerId,
        position: player.position,
        teamId: player.teamId,
        // Passing stats
        passYds: player.passYards || 0,
        passTd: player.passTouchdowns || 0,
        passInt: player.passInterceptions || 0,
        passAtt: player.passAttempts || 0,
        passCmp: player.passCompletions || 0,
        passRating: player.passRating || 0,
        // Rushing stats
        rushYds: player.rushYards || 0,
        rushTd: player.rushTouchdowns || 0,
        rushAtt: player.rushAttempts || 0,
        rushLong: player.rushLong || 0,
        // Receiving stats
        rec: player.receivingReceptions || 0,
        recYds: player.receivingYards || 0,
        recTd: player.receivingTouchdowns || 0,
        targets: player.receivingTargets || 0,
        recLong: player.receivingLong || 0,
        // Defensive stats
        sacks: player.defensiveSacks || 0,
        tacklesTotal: player.defensiveTacklesCombined || 0,
        soloTackles: player.defensiveTacklesSolo || 0,
        defInt: player.defensiveInterceptions || 0,
        passDefended: player.defensivePassesDefended || 0,
        tacklesLoss: player.defensiveTacklesLoss || 0,
        qbHits: player.defensiveQbHits || 0,
        fumblesForced: player.fumblesForced || 0,
        // Kicking stats
        fgm: player.fieldGoalsMade || 0,
        fga: player.fieldGoalsAttempted || 0,
        xpm: player.extraPointsMade || 0,
        xpa: player.extraPointsAttempted || 0,
        // Punting stats
        punt: player.punts || 0,
        puntYds: player.puntYards || 0,
        puntLong: player.puntLong || 0
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
    const team = teams.find(t => t.teamId === teamId);
    return team?.name || teamId.toUpperCase();
  };

  return (
    <div className={styles['player-stats']}>
      <h3>Player Statistics</h3>
      
      {playerStats.quarterbacks.length > 0 && (
        <>
          <h4>Passing</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Cmp/Att</th>
                <th>Yards</th>
                <th>TD</th>
                <th>INT</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.quarterbacks.map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.passCmp}/{player.passAtt}</td>
                  <td>{player.passYds}</td>
                  <td>{player.passTd}</td>
                  <td>{player.passInt}</td>
                  <td>{player.passRating || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {playerStats.runningBacks.length > 0 && (
        <>
          <h4>Rushing</h4>
          <table className={styles['player-table']}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Att</th>
                <th>Yards</th>
                <th>TD</th>
                <th>Long</th>
                <th>YPC</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.runningBacks.map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.rushAtt}</td>
                  <td>{player.rushYds}</td>
                  <td>{player.rushTd}</td>
                  <td>{player.rushLong || 'N/A'}</td>
                  <td>{player.rushAtt > 0 ? (player.rushYds / player.rushAtt).toFixed(1) : '0.0'}</td>
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
              {playerStats.receivers.map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.rec}</td>
                  <td>{player.recYds}</td>
                  <td>{player.recTd}</td>
                  <td>{player.recLong || 'N/A'}</td>
                  <td>{player.rec > 0 ? (player.recYds / player.rec).toFixed(1) : '0.0'}</td>
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
                <th>Player</th>
                <th>Team</th>
                <th>Tackles</th>
                <th>Solo</th>
                <th>Sacks</th>
                <th>INT</th>
                <th>PD</th>
                <th>TFL</th>
                <th>QB Hits</th>
                <th>FF</th>
              </tr>
            </thead>
            <tbody>
              {[...playerStats.defensiveLine, ...playerStats.linebackers, ...playerStats.defensiveBacks].map((player, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
                    </Link>
                  </td>
                  <td>{getTeamName(player.teamId)}</td>
                  <td>{player.tacklesTotal}</td>
                  <td>{player.soloTackles || 0}</td>
                  <td>{player.sacks}</td>
                  <td>{player.defInt}</td>
                  <td>{player.passDefended}</td>
                  <td>{player.tacklesLoss || 0}</td>
                  <td>{player.qbHits || 0}</td>
                  <td>{player.fumblesForced}</td>
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
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
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
                    <Link to={`/player/${player.playerId}`} className={styles['player-link']}>
                      {player.playerId}
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

      {Object.values(playerStats).every(array => array.length === 0) && (
        <p>No player statistics available for this game.</p>
      )}
    </div>
  );
}

export default PlayerStats;
