import React from 'react';
import styles from './SeasonHeader.module.css';
import { TEAM_MAP } from '../../utils';

function SeasonHeader({ teamInfo, teamId, year }) {
  const { logo, wins, losses, division, divisionRank, playoffs, coach, offCoordinator, defCoordinator } = teamInfo;
  const teamName = TEAM_MAP[teamId]?.name;

  return (
    <>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles['header-background']}>
          <div className={styles['team-logo-bg']}>
            {logo ? (
              <img src={logo} alt={teamName} className={styles['team-logo-background']} />
            ) : (
              <div className={styles['team-logo-placeholder']}>{teamName?.slice(0,2)}</div>
            )}
          </div>
        </div>
        <div className={styles['header-content']}>
          <div className={styles['team-info']}>
            <div className={styles['team-details']}>
              <h1>{year} {teamName}</h1>
              <div className={styles['team-stats']}>
                <div className={styles['stat-item-header']}>
                  <div className={styles['stat-value-header']}>{wins}-{losses}</div>
                  <div className={styles['stat-label-header']}>Record</div>
                </div>
                <div className={styles['stat-item-header']}>
                  <div className={styles['stat-value-header']}>{divisionRank || '-'}</div>
                  <div className={styles['stat-label-header']}>{division || 'Division'}</div>
                </div>
                <div className={styles['stat-item-header']}>
                  <div className={`${styles['stat-value-header']} ${styles['playoffs-value-header']}`}>{playoffs || '-'}</div>
                  <div className={styles['stat-label-header']}>Playoffs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Staff Section */}
      <div className={styles.section}>
        <div className={styles['coach-info']}>
          <div className={styles['coaching-staff']}>
            <div className={styles['coach-card']}>
              <div className={styles['coach-name']}>{coach}</div>
              <div className={styles['coach-title']}>Head Coach</div>
            </div>
            <div className={styles['coach-card']}>
              <div className={styles['coach-name']}>{offCoordinator}</div>
              <div className={styles['coach-title']}>Offensive Coordinator</div>
            </div>
            <div className={styles['coach-card']}>
              <div className={styles['coach-name']}>{defCoordinator}</div>
              <div className={styles['coach-title']}>Defensive Coordinator</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SeasonHeader;
