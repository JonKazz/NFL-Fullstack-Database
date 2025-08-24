import React from 'react';
import styles from './DefensiveStats.module.css';

function DefensiveStats({ homeStats, awayStats }) {
  return (
    <div className={styles['stats-grid']}>
      <div className={styles['stat-card']}>
        <h3>Defensive Statistics</h3>
        <table className={styles['stats-table']}>
          <thead>
            <tr>
              <th>Category</th>
              <th>{homeStats.id.teamId}</th>
              <th>{awayStats.id.teamId}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total Yards Allowed</strong></td>
              <td>{awayStats.totalYards || 0}</td>
              <td>{homeStats.totalYards || 0}</td>
            </tr>
            <tr>
              <td><strong>Passing Yards Allowed</strong></td>
              <td>{awayStats.passingYards || 0}</td>
              <td>{homeStats.passingYards || 0}</td>
            </tr>
            <tr>
              <td><strong>Rushing Yards Allowed</strong></td>
              <td>{awayStats.rushingYards || 0}</td>
              <td>{homeStats.rushingYards || 0}</td>
            </tr>
            <tr>
              <td><strong>First Downs Allowed</strong></td>
              <td>{awayStats.firstDownsTotal || 0}</td>
              <td>{homeStats.firstDownsTotal || 0}</td>
            </tr>
            <tr>
              <td><strong>Third Down Defense</strong></td>
              <td>{awayStats.thirdDownConversions || 0}/{awayStats.thirdDownAttempts || 0}</td>
              <td>{homeStats.thirdDownConversions || 0}/{homeStats.thirdDownAttempts || 0}</td>
            </tr>
            <tr>
              <td><strong>Red Zone Defense</strong></td>
              <td>{awayStats.redZoneConversions || 0}/{awayStats.redZoneAttempts || 0}</td>
              <td>{homeStats.redZoneConversions || 0}/{homeStats.redZoneAttempts || 0}</td>
            </tr>
            <tr>
              <td><strong>Sacks</strong></td>
              <td>{homeStats.sacksTotal || 0}</td>
              <td>{awayStats.sacksTotal || 0}</td>
            </tr>
            <tr>
              <td><strong>Interceptions</strong></td>
              <td>{homeStats.interceptions || 0}</td>
              <td>{awayStats.interceptions || 0}</td>
            </tr>
            <tr>
              <td><strong>Fumbles Forced</strong></td>
              <td>{homeStats.fumblesForced || 0}</td>
              <td>{awayStats.fumblesForced || 0}</td>
            </tr>
            <tr>
              <td><strong>Fumbles Recovered</strong></td>
              <td>{homeStats.fumblesRecovered || 0}</td>
              <td>{awayStats.fumblesRecovered || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DefensiveStats;
