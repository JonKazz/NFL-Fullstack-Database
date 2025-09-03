import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SeasonSummary.module.css';
import { fetchTeamsBySeason } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function TeamStatLeaders({ year }) {
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch team stats for the season
  useEffect(() => {
    const fetchTeamStats = async () => {
      if (!year) return;

      try {
        setLoading(true);
        const stats = await fetchTeamsBySeason(year);
        if (stats && Array.isArray(stats)) {
          setTeamStats(stats);
        }
      } catch (error) {
        console.warn('Failed to fetch team stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, [year]);

  // Get top 32 teams for a specific stat (all teams ranked)
  const getTopTeams = (statField, sortDirection = 'desc') => {
    if (!teamStats || !Array.isArray(teamStats)) return [];
    
    return teamStats
      .filter(team => team[statField] !== null && team[statField] !== undefined)
      .sort((a, b) => {
        const aVal = a[statField] || 0;
        const bVal = b[statField] || 0;
        
        if (sortDirection === 'desc') {
          return bVal - aVal; // Higher values first
        } else {
          return aVal - bVal; // Lower values first
        }
      });
  };

  // Helper function to get team name as a link
  const getTeamNameLink = (teamId) => {
    const teamInfo = TEAM_MAP[teamId];
    if (!teamInfo) return teamId || 'N/A';
    
    return (
      <Link to={`/team/${teamId}/${year}`} className={styles['team-link']}>
        {teamInfo.city}
      </Link>
    );
  };

  // Helper function to format stat values
  const formatStatValue = (value, statType) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (statType) {
      case 'yards':
        return `${Math.round(value / 17)} YPG`;
      case 'points':
        return `${Math.round(value / 17)} PPG`;
      case 'percentage':
        return `${value}%`;
      case 'time':
        return value; // Already formatted as MM:SS
      default:
        return value;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading team statistics...</div>;
  }

  if (!teamStats || teamStats.length === 0) {
    return <div className={styles['no-data-message']}>No team statistics available for {year}.</div>;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Team Stat Rankings</h2>
      
      {/* Offensive Team Stats */}
      <div className={styles['stats-section']}>
        <h3>Offensive Rankings</h3>
        <div className={styles['offensive-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Total Offense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('totalYardsFor', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.totalYardsFor, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Offense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('passYardsFor', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.passYardsFor, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Rushing Offense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('rushYardsFor', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.rushYardsFor, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Points Scored</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('pointsFor', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.pointsFor, 'points')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Defensive Team Stats */}
      <div className={styles['stats-section']}>
        <h3>Defensive Rankings</h3>
        <div className={styles['defensive-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Total Defense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('totalYardsAgainst', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.totalYardsAgainst, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Defense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('passYardsAgainst', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.passYardsAgainst, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Rushing Defense</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Yards</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('rushYardsAgainst', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.rushYardsAgainst, 'yards')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Points Allowed</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('pointsAgainst', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{formatStatValue(team.pointsAgainst, 'points')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Other Team Stats */}
      <div className={styles['stats-section']}>
        <h3>Other Rankings</h3>
        <div className={styles['other-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Turnovers</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('turnovers', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{team.turnovers || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Forced Turnovers</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('forcedTurnovers', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{team.forcedTurnovers || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles['stat-category']}>
            <h4>Penalties</h4>
            <table className={styles['leader-table']}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('penaltiesFor', 'asc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{team.penaltiesFor || 'N/A'}</td>
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
                  <th>Team</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {getTopTeams('passInts', 'desc').map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getTeamNameLink(team.teamId)}</td>
                    <td>{team.passInts || 'N/A'}</td>
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

export default TeamStatLeaders;
