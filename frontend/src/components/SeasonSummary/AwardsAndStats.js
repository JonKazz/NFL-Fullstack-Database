import React from 'react';
import styles from './SeasonSummary.module.css';

function AwardsAndStats({ awards, statLeaders }) {
  return (
    <>
      {/* Awards */}
      <div className={styles.section}>
        <h2 className={styles['section-title']}>Award Winners</h2>
        <div className={styles['awards-grid']}>
          {awards.map((award, index) => (
            <div key={index} className={styles['award-card']}>
              <h3>{award.award}</h3>
              <div className={styles['award-winner']}>{award.winner}</div>
              <div className={styles['award-team']}>{award.team}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Leaders */}
      <div className={styles.section}>
        <h2 className={styles['section-title']}>Stat Leaders</h2>
        <div className={styles['stats-grid']}>
          {Object.entries(statLeaders).map(([category, leader]) => (
            <div key={category} className={styles['stat-card']}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className={styles['stat-leader']}>{leader.leader}</div>
              {leader.team && <div className={styles['stat-team']}>{leader.team}</div>}
              {leader.yards && leader.tds && (
                <div className={styles['stat-value']}>
                  {leader.yards} yards, {leader.tds} TDs
                </div>
              )}
              {leader.sacks && (
                <div className={styles['stat-value']}>
                  {leader.sacks} sacks
                </div>
              )}
              {leader.ints && (
                <div className={styles['stat-value']}>
                  {leader.ints} INTs
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AwardsAndStats; 