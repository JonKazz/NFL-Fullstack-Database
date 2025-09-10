import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TeamStatLeaders.module.css';
import { fetchTeamsBySeason } from '../../api/fetches';
import { TEAM_MAP, getTeamPrimaryColor } from '../../utils';

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

  // Get top 8 teams for a specific stat
  const getTopTeams = (statField, sortDirection = 'desc', limit = 8) => {
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
      })
      .slice(0, limit);
  };

  // Helper function to get team name as a link
  const getTeamNameLink = (teamId) => {
    const teamInfo = TEAM_MAP[teamId];
    if (!teamInfo) return teamId || 'N/A';
    
    return (
      <Link to={`/${teamId}/${year}`} className={styles['team-link']}>
        {teamInfo.name_short}
      </Link>
    );
  };

  // Helper function to get team logo URL
  const getTeamLogoUrl = (teamId) => {
    return `https://cdn.ssref.net/req/202508221/tlogo/pfr/${teamId}-${year}.png`;
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

  // Reusable component for stat tables
  const StatTable = ({ title, statField, sortDirection, statType, formatValue }) => {
    const topTeams = getTopTeams(statField, sortDirection);
    
    return (
      <div className={styles['stat-category']}>
        <h4>{title}</h4>
        <div className={styles['table-with-image']}>
          {topTeams.length > 0 && (
            <div className={styles['top-team-image']}>
              <img 
                src={getTeamLogoUrl(topTeams[0].teamId)} 
                alt={topTeams[0].teamId}
                className={styles['team-image-large']}
                style={{ borderColor: getTeamPrimaryColor(topTeams[0].teamId) }}
              />
            </div>
          )}
          <table className={styles['leader-table']}>
            <tbody>
              {topTeams.map((team, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{getTeamNameLink(team.teamId)}</td>
                  <td>{formatValue ? formatValue(team[statField], statType) : team[statField] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
          <StatTable 
            title="Yards Per Game"
            statField="totalYardsFor"
            sortDirection="desc"
            statType="yards"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Points Per Game"
            statField="pointsFor"
            sortDirection="desc"
            statType="points"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Passing Yards Per Game"
            statField="passYardsFor"
            sortDirection="desc"
            statType="yards"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Rushing Yards Per Game"
            statField="rushYardsFor"
            sortDirection="desc"
            statType="yards"
            formatValue={formatStatValue}
          />
        </div>
      </div>

      {/* Defensive Team Stats */}
      <div className={styles['stats-section']}>
        <h3>Defensive Rankings</h3>
        <div className={styles['defensive-stats-grid']}>
          <StatTable 
            title="Defensive Yards Allowed Per Game"
            statField="totalYardsAgainst"
            sortDirection="asc"
            statType="yards"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Defensive Points Allowed Per Game"
            statField="pointsAgainst"
            sortDirection="asc"
            statType="points"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Passing Yards Allowed Per Game"
            statField="passYardsAgainst"
            sortDirection="asc"
            statType="yards"
            formatValue={formatStatValue}
          />
          <StatTable 
            title="Rushing Yards Allowed Per Game"
            statField="rushYardsAgainst"
            sortDirection="asc"
            statType="yards"
            formatValue={formatStatValue}
          />
        </div>
      </div>

      {/* Other Team Stats */}
      <div className={styles['stats-section']}>
        <h3>Other Rankings</h3>
        <div className={styles['other-stats-grid']}>
          <StatTable 
            title="Offensive Turnover Leaders"
            statField="turnovers"
            sortDirection="asc"
          />
          <StatTable 
            title="Defensive Turnover Leaders"
            statField="forcedTurnovers"
            sortDirection="desc"
          />
          <StatTable 
            title="Penalty Leaders"
            statField="penaltiesFor"
            sortDirection="asc"
          />
          <StatTable 
            title="Interception Leaders"
            statField="passInts"
            sortDirection="desc"
          />
        </div>
      </div>
    </div>
  );
}

export default TeamStatLeaders;
