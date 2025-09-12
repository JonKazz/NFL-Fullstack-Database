import React from 'react';
import styles from './Coaches.module.css';
import { getNeonTeamColor } from '../../utils';

/**
 * Coaches component displays the coaching staff for a team
 * @param {Object} props - Component props
 * @param {Object} props.teamInfo - Team information containing coach details
 * @param {string} props.teamId - Team identifier for color styling
 * @returns {JSX.Element} Coaches component
 */
function Coaches({ teamInfo, teamId }) {
  if (!teamInfo) {
    return null;
  }

  const neonColor = getNeonTeamColor(teamId);

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Coaches</h2>
      <div 
        className={styles.coachInfo}
        style={{ '--team-neon-color': neonColor }}
      >
        <div className={styles.coachingStaff}>
          <div className={styles.coachCard}>
            <div className={styles.coachName}>{teamInfo.coach}</div>
            <div className={styles.coachTitle}>Head Coach</div>
          </div>
          <div className={styles.coachCard}>
            <div className={styles.coachName}>{teamInfo.offCoordinator}</div>
            <div className={styles.coachTitle}>Offensive Coordinator</div>
          </div>
          <div className={styles.coachCard}>
            <div className={styles.coachName}>{teamInfo.defCoordinator}</div>
            <div className={styles.coachTitle}>Defensive Coordinator</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coaches;
