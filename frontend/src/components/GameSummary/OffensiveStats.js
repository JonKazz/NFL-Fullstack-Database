import React from 'react';
import styles from './OffensiveStats.module.css';

function OffensiveStats({ homeStats, awayStats }) {
  return (
    <div className={styles['stats-grid']}>
      <div className={styles['stat-card']}>
        <h3>Offensive Statistics</h3>
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
              <td><strong>Red Zone Efficiency</strong></td>
              <td>{homeStats.redZoneConversions || 0}/{homeStats.redZoneAttempts || 0}</td>
              <td>{awayStats.redZoneConversions || 0}/{awayStats.redZoneAttempts || 0}</td>
            </tr>
            <tr>
              <td><strong>Time of Possession</strong></td>
              <td>{homeStats.timeOfPossession || '00:00'}</td>
              <td>{awayStats.timeOfPossession || '00:00'}</td>
            </tr>
            <tr>
              <td><strong>Passing Touchdowns</strong></td>
              <td>{homeStats.passingTouchdowns || 0}</td>
              <td>{awayStats.passingTouchdowns || 0}</td>
            </tr>
            <tr>
              <td><strong>Rushing Touchdowns</strong></td>
              <td>{homeStats.rushingTouchdowns || 0}</td>
              <td>{awayStats.rushingTouchdowns || 0}</td>
            </tr>
            <tr>
              <td><strong>Field Goals</strong></td>
              <td>{homeStats.fieldGoalsMade || 0}/{homeStats.fieldGoalsAttempted || 0}</td>
              <td>{awayStats.fieldGoalsMade || 0}/{awayStats.fieldGoalsAttempted || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OffensiveStats;
