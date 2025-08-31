import React from 'react';
import styles from './TeamStatsComparison.module.css';

function TeamStatsComparison({ homeStats, awayStats, homeTeamColor, awayTeamColor }) {
  // Helper function to convert time string (MM:SS) to total seconds
  const convertTimeToSeconds = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 0;
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  // Proportional bar calculations for Key Stats (removed passing and rushing yards)
  const statBarData = [
    {
      label: 'Time of Possession',
      home: convertTimeToSeconds(homeStats.timeOfPossession),
      away: convertTimeToSeconds(awayStats.timeOfPossession),
      homeDisplay: homeStats.timeOfPossession || '0:00',
      awayDisplay: awayStats.timeOfPossession || '0:00',
    },
    {
      label: 'Total Yards',
      home: homeStats.totalYards,
      away: awayStats.totalYards,
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

  // Rushing stats with proportional bars
  const rushingStats = [
    {
      label: 'Yards',
      home: homeStats.rushingYards,
      away: awayStats.rushingYards,
    },
    {
      label: 'Attempts',
      home: homeStats.rushingAttempts,
      away: awayStats.rushingAttempts,
    },
    {
      label: 'Touchdowns',
      home: homeStats.rushingTouchdowns,
      away: awayStats.rushingTouchdowns,
    },
    {
      label: 'Fumbles',
      home: homeStats.fumblesLost || 0,
      away: awayStats.fumblesLost || 0,
    },
  ];

  // Passing stats with proportional bars
  const passingStats = [
    {
      label: 'Yards',
      home: homeStats.passingYards,
      away: awayStats.passingYards,
    },
    {
      label: 'Attempts',
      home: homeStats.passingAttempts,
      away: awayStats.passingAttempts,
    },
    {
      label: 'Touchdowns',
      home: homeStats.passingTouchdowns,
      away: awayStats.passingTouchdowns,
    },
    {
      label: 'Interceptions',
      home: homeStats.passingInterceptions || 0,
      away: awayStats.passingInterceptions || 0,
    },
  ];

  // Helper function to render stat bars
  const renderStatBars = (statsData, section = '') => {
    // Show all stats, including those with 0 values
    return (
      <div className={styles['chart-container']}>
        {statsData.map(({ label, home, away, homeDisplay, awayDisplay }, idx) => {
          const total = (home || 0) + (away || 0);
          const homePct = total ? (home / total) * 100 : 50;
          const awayPct = total ? (away / total) * 100 : 50;
          
          // Determine which CSS class to use for stat names
          let statNameClass = styles['stat-name'];
          if (section === 'rushing') {
            statNameClass = styles['rushing-stat-name'];
          } else if (section === 'passing') {
            statNameClass = styles['passing-stat-name'];
          }
          
          return (
            <div className={styles['stat-comparison']} key={label}>
              <div className={statNameClass}>{label}</div>
              <div className={styles['stat-bars']}>
                <div className={styles['bar-row']}>
                  {(home || 0) > 0 && (away || 0) > 0 && (
                    <div className={styles['center-line']}></div>
                  )}
                  {(home || 0) > 0 && (
                    <div
                      className={styles.bar}
                      style={{ 
                        width: `${homePct}%`,
                        backgroundColor: homeTeamColor
                      }}
                    >
                      {homeStats.id.teamId}: {homeDisplay || home}
                    </div>
                  )}
                  {(away || 0) > 0 && (
                    <div
                      className={styles.bar}
                      style={{ 
                        width: `${awayPct}%`,
                        backgroundColor: awayTeamColor
                      }}
                    >
                      {awayStats.id.teamId}: {awayDisplay || away}
                    </div>
                  )}
                  {(home || 0) === 0 && (away || 0) === 0 && (
                    <div className={styles['none-indicator']}>(none)</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Key Stats Comparison */}
      <div className={styles['visual-comparison']}>
        <h3>Key Stats Comparison</h3>
        {renderStatBars(statBarData)}
      </div>

      {/* Rushing and Passing Stats Containers */}
      <div className={styles['stats-containers']}>
        {/* Left Container - Rushing Stats */}
        <div className={styles['stats-container']}>
          <h4>Rushing</h4>
          {renderStatBars(rushingStats, 'rushing')}
        </div>

        {/* Right Container - Passing Stats */}
        <div className={styles['stats-container']}>
          <h4>Passing</h4>
          {renderStatBars(passingStats, 'passing')}
        </div>
      </div>
    </>
  );
}

export default TeamStatsComparison;
