import React from 'react';
import styles from './QuarterScores.module.css';

function QuarterScores({ homeStats, awayStats, homeName, awayName, hasOvertime }) {
  return (
    <div className={styles['quarter-scores']}>
      <table className={styles['quarter-table']}>
        <thead>
          <tr>
            <th>Team</th>
            <th>1st</th>
            <th>2nd</th>
            <th>3rd</th>
            <th>4th</th>
            {hasOvertime && <th>OT</th>}
            <th>Final</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{homeName}</td>
            <td>{homeStats.pointsQ1 || 0}</td>
            <td>{homeStats.pointsQ2 || 0}</td>
            <td>{homeStats.pointsQ3 || 0}</td>
            <td>{homeStats.pointsQ4 || 0}</td>
            {hasOvertime && <td>{homeStats.pointsOvertime || 0}</td>}
            <td className={styles.winner}>{homeStats.pointsTotal}</td>
          </tr>
          <tr>
            <td>{awayName}</td>
            <td>{awayStats.pointsQ1 || 0}</td>
            <td>{awayStats.pointsQ2 || 0}</td>
            <td>{awayStats.pointsQ3 || 0}</td>
            <td>{awayStats.pointsQ4 || 0}</td>
            {hasOvertime && <td>{awayStats.pointsOvertime || 0}</td>}
            <td>{awayStats.pointsTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default QuarterScores;
