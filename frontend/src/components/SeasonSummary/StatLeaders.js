import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './StatLeaders.module.css';
import { fetchSeasonStatsByYear } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function StatLeaders({ year }) {
  const [seasonStats, setSeasonStats] = useState({});

  // Fetch season player stats for stat leaders
  useEffect(() => {
    const loadSeasonStats = async () => {
      if (!year) return;

      try {
        const stats = await fetchSeasonStatsByYear(year);
        setSeasonStats(stats);
      } catch (error) {
        console.warn('Failed to fetch season stats:', error);
      }
    };

    loadSeasonStats();
  }, [year]);



  // Get top 10 players for a specific stat
  const getTopPlayers = (statField, limit = 10) => {
    if (!seasonStats || !Array.isArray(seasonStats)) return [];
    
    return seasonStats
      .filter(player => player[statField] && player[statField] > 0)
      .sort((a, b) => (b[statField] || 0) - (a[statField] || 0))
      .slice(0, limit);
  };

  // Helper function to get player name as a link
  const getPlayerNameLink = (player) => {
    const playerName = player.playerName || player.playerId || 'N/A';
    const playerId = player.playerId;
    return (
      <Link to={`/player/${playerId}`} className={styles['player-link']}>
        {playerName}
      </Link>
    );
  };



  // Helper function to get team city
  const getTeamCity = (teamId) => {
    return TEAM_MAP[teamId]?.city || teamId || 'N/A';
  };

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Season Stat Leaders</h2>
      
      {/* Passing Stats */}
      <div className={styles['stats-section']}>
        <h3>Passing Leaders</h3>
        <div className={styles['passing-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Passing Yards</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('passingYards').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.passingYards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Attempts</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('passingAttempts').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.passingAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Touchdowns</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>TDs</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('passingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.passingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Interceptions</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>INTs</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('passingInterceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.passingInterceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rushing Stats */}
      <div className={styles['stats-section']}>
        <h3>Rushing Leaders</h3>
        <div className={styles['stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Rushing Yards</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('rushingYards').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.rushingYards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Rushing Touchdowns</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>TDs</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('rushingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.rushingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Receiving Stats */}
      <div className={styles['stats-section']}>
        <h3>Receiving Leaders</h3>
        <div className={styles['receiving-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Receiving Yards</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('receivingYards').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.receivingYards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Receiving Touchdowns</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>TDs</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('receivingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.receivingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Receiving Targets</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Targets</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('receivingTargets').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.receivingTargets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Receptions</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Rec</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('receivingReceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.receivingReceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Defensive Stats */}
      <div className={styles['stats-section']}>
        <h3>Defensive Leaders</h3>
        <div className={styles['defensive-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Tackles</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Tackles</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('defensiveTacklesCombined').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.defensiveTacklesCombined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Pressures</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Pressures</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('defensivePressures').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.defensivePressures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Sacks</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Sacks</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('defensiveSacks').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.defensiveSacks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Interceptions</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>INTs</th>
                </tr>
              </thead>
              <tbody>
                {getTopPlayers('defensiveInterceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamCity(player.teamId)}</td>
                    <td>{player.defensiveInterceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatLeaders;
