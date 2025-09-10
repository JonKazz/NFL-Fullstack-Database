import React from 'react';
import styles from './Coaches.module.css';

/**
 * Coaches component displays the coaching staff for a team
 * @param {Object} props - Component props
 * @param {Object} props.teamInfo - Team information containing coach details
 * @returns {JSX.Element} Coaches component
 */
function Coaches({ teamInfo }) {
  if (!teamInfo) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Coaches</h2>
      <div className={styles.coachInfo}>
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
