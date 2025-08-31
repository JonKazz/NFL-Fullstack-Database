import React from 'react';
import styles from './DownConversionRates.module.css';
import { TEAM_MAP } from '../../utils';

function DownConversionRates({ homeStats, awayStats, homeTeamColor, awayTeamColor }) {
  // Third down calculations
  const thirdDownMaxAttempts = Math.max(homeStats.thirdDownAttempts || 0, awayStats.thirdDownAttempts || 0);
  const thirdDownHomeBarWidth = thirdDownMaxAttempts > 0 ? ((homeStats.thirdDownAttempts || 0) / thirdDownMaxAttempts * 100) : 0;
  const thirdDownAwayBarWidth = thirdDownMaxAttempts > 0 ? ((awayStats.thirdDownAttempts || 0) / thirdDownMaxAttempts * 100) : 0;

  // Fourth down calculations
  const fourthDownMaxAttempts = Math.max(homeStats.thirdDownAttempts || 0, awayStats.thirdDownAttempts || 0);
  const fourthDownHomeBarWidth = fourthDownMaxAttempts > 0 ? ((homeStats.fourthDownAttempts || 0) / fourthDownMaxAttempts * 100) : 0;
  const fourthDownAwayBarWidth = fourthDownMaxAttempts > 0 ? ((awayStats.fourthDownAttempts || 0) / fourthDownMaxAttempts * 100) : 0;

  return (
    <div className={styles['visual-comparison']}>
      <h3>Down Conversion Rates</h3>
      
      {/* Third Down Conversion Rate */}
      <div className={styles['conversion-section']}>
        <h4>Third Down</h4>
        <div className={styles['chart-container']}>
          <div className={styles['stat-comparison']}>
            <div className={styles['stat-name']}>{TEAM_MAP[homeStats.id.teamId]?.city || homeStats.id.teamId}</div>
            <div className={styles['stat-bars']}>
              <div 
                className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                data-team-id={homeStats.id.teamId}
                style={{ 
                  '--team-primary-color': homeTeamColor,
                  width: `${thirdDownHomeBarWidth}%`
                }}
              >
                <div
                  className={styles.bar}
                  style={{ 
                    width: `${(homeStats.thirdDownAttempts || 0) > 0 ? ((homeStats.thirdDownConversions || 0) / (homeStats.thirdDownAttempts || 0) * 100) : 0}%`
                  }}
                  data-team-id={homeStats.id.teamId}
                >
                  {homeStats.thirdDownConversions || 0}/{homeStats.thirdDownAttempts || 0} ({homeStats.thirdDownAttempts > 0 ? Math.round((homeStats.thirdDownConversions / homeStats.thirdDownAttempts * 100)) : 0}%)
                </div>
                {/* Division lines for each segment based on home team's attempts */}
                {Array.from({ length: (homeStats.thirdDownAttempts || 0) - 1 }, (_, index) => (
                  <div
                    key={index}
                    className={styles['division-line']}
                    style={{
                      left: `${((index + 1) / (homeStats.thirdDownAttempts || 0)) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles['stat-comparison']}>
            <div className={styles['stat-name']}>{TEAM_MAP[awayStats.id.teamId]?.city || awayStats.id.teamId}</div>
            <div className={styles['stat-bars']}>
              <div 
                className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                data-team-id={awayStats.id.teamId}
                style={{ 
                  '--team-primary-color': awayTeamColor,
                  width: `${thirdDownAwayBarWidth}%`
                }}
              >
                <div
                  className={styles.bar}
                  style={{ 
                    width: `${(awayStats.thirdDownAttempts || 0) > 0 ? ((awayStats.thirdDownConversions || 0) / (awayStats.thirdDownAttempts || 0) * 100) : 0}%`
                  }}
                  data-team-id={awayStats.id.teamId}
                >
                  {awayStats.thirdDownConversions || 0}/{awayStats.thirdDownAttempts || 0} ({awayStats.thirdDownAttempts > 0 ? Math.round((awayStats.thirdDownConversions / awayStats.thirdDownAttempts * 100)) : 0}%)
                </div>
                {/* Division lines for each segment based on away team's attempts */}
                {Array.from({ length: (awayStats.thirdDownAttempts || 0) - 1 }, (_, index) => (
                  <div
                    key={index}
                    className={styles['division-line']}
                    style={{
                      left: `${((index + 1) / (awayStats.thirdDownAttempts || 0)) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Down Conversion Rate */}
      <div className={styles['conversion-section']}>
        <h4>Fourth Down</h4>
        <div className={styles['chart-container']}>
          <div className={styles['stat-comparison']}>
            <div className={styles['stat-name']}>{TEAM_MAP[homeStats.id.teamId]?.city || homeStats.id.teamId}</div>
            <div className={styles['stat-bars']}>
              {(homeStats.fourthDownAttempts || 0) > 0 ? (
                <div 
                  className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                  data-team-id={homeStats.id.teamId}
                  style={{ 
                    '--team-primary-color': homeTeamColor,
                    width: `${fourthDownHomeBarWidth}%`
                  }}
                >
                  <div
                    className={styles.bar}
                    style={{ 
                      width: `${(homeStats.fourthDownConversions || 0) / (homeStats.fourthDownAttempts || 0) * 100}%`
                    }}
                    data-team-id={homeStats.id.teamId}
                  >
                    {homeStats.fourthDownConversions || 0}/{homeStats.fourthDownAttempts || 0} ({Math.round((homeStats.fourthDownConversions / homeStats.fourthDownAttempts * 100))}%)
                  </div>
                  {/* Division lines for each segment based on home team's attempts */}
                  {Array.from({ length: (homeStats.fourthDownAttempts || 0) - 1 }, (_, index) => (
                    <div
                      key={index}
                      className={styles['division-line']}
                      style={{
                        left: `${((index + 1) / (homeStats.fourthDownAttempts || 0)) * 100}%`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles['no-attempts']}>(no attempts)</div>
              )}
            </div>
          </div>
          
          <div className={styles['stat-comparison']}>
            <div className={styles['stat-name']}>{TEAM_MAP[awayStats.id.teamId]?.city || awayStats.id.teamId}</div>
            <div className={styles['stat-bars']}>
              {(awayStats.fourthDownAttempts || 0) > 0 ? (
                <div 
                  className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                  data-team-id={awayStats.id.teamId}
                  style={{ 
                    '--team-primary-color': awayTeamColor,
                    width: `${fourthDownAwayBarWidth}%`
                  }}
                >
                  <div
                    className={styles.bar}
                    style={{ 
                      width: `${(awayStats.fourthDownConversions || 0) / (awayStats.fourthDownAttempts || 0) * 100}%`
                    }}
                    data-team-id={awayStats.id.teamId}
                  >
                    {awayStats.fourthDownConversions || 0}/{awayStats.fourthDownAttempts || 0} ({Math.round((awayStats.fourthDownConversions / awayStats.fourthDownAttempts * 100))}%)
                  </div>
                  {/* Division lines for each segment based on away team's attempts */}
                  {Array.from({ length: (awayStats.fourthDownAttempts || 0) - 1 }, (_, index) => (
                    <div
                      key={index}
                      className={styles['division-line']}
                      style={{
                        left: `${((index + 1) / (awayStats.fourthDownAttempts || 0)) * 100}%`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles['no-attempts']}>(no attempts)</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownConversionRates;
