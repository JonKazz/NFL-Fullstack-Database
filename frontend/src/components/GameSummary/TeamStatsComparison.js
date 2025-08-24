import React from 'react';
import styles from './TeamStatsComparison.module.css';
import { getTeamPrimaryColor } from '../../utils';

function TeamStatsComparison({ homeStats, awayStats }) {
  // Proportional bar calculations
  const statBarData = [
    {
      label: 'Total Yards',
      home: homeStats.totalYards,
      away: awayStats.totalYards,
    },
    {
      label: 'Passing Yards',
      home: homeStats.passingYards,
      away: awayStats.passingYards,
    },
    {
      label: 'Rushing Yards',
      home: homeStats.rushingYards,
      away: awayStats.rushingYards,
    },
    {
      label: 'First Downs',
      home: homeStats.firstDownsTotal,
      away: awayStats.firstDownsTotal,
    },
    {
      label: 'Touchdowns',
      home: (homeStats.passingTouchdowns || 0) + (homeStats.rushingTouchdowns || 0),
      away: (awayStats.passingTouchdowns || 0) + (awayStats.rushingTouchdowns || 0),
    },
  ];

  return (
    <div className={styles['visual-comparison']}>
      <h3>Key Stats Comparison</h3>
      <div className={styles['chart-container']}>
        {statBarData.map(({ label, home, away }, idx) => {
          const total = (home || 0) + (away || 0);
          const homePct = total ? (home / total) * 100 : 50;
          const awayPct = total ? (away / total) * 100 : 50;
          return (
            <div className={styles['stat-comparison']} key={label}>
              <div className={styles['stat-name']}>{label}</div>
              <div className={styles['stat-bars']}>
                <div className={styles['bar-row']}>
                  <div
                    className={styles.bar}
                    style={{ 
                      width: `${homePct}%`,
                      backgroundColor: getTeamPrimaryColor(homeStats.id.teamId)
                    }}
                  >
                    {homeStats.id.teamId}: {home}
                  </div>
                  <div
                    className={styles.bar}
                    style={{ 
                      width: `${awayPct}%`,
                      backgroundColor: getTeamPrimaryColor(awayStats.id.teamId)
                    }}
                  >
                    {awayStats.id.teamId}: {away}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamStatsComparison;
