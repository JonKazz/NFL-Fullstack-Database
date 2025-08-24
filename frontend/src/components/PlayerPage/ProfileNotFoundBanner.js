import React from 'react';
import styles from './ProfileNotFoundBanner.module.css';

function ProfileNotFoundBanner({ playerId }) {
  return (
    <div className={styles['profile-not-found-banner']}>
      <div className={styles['banner-content']}>
        <div className={styles['warning-icon']}>⚠️</div>
        <div className={styles['banner-text']}>
          <h3>Profile Information Not Available</h3>
          <p>This player's profile has not yet been populated in the database.</p>
          <p className={styles['player-id']}>Player ID: {playerId}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileNotFoundBanner;
