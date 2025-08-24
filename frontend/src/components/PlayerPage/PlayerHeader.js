import React from 'react';
import styles from './PlayerHeader.module.css';

function PlayerHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className={styles['player-header']}>
      <div className={styles['player-image-section']}>
        {profile.img && (
          <img 
            src={profile.img} 
            alt={`${profile.name}`}
            className={styles['player-image']}
          />
        )}
      </div>
      
      <div className={styles['player-info']}>
        <div className={styles['player-name']}>
          <h1>{profile.name}</h1>
        </div>
        
        <div className={styles['player-details']}>
          <div className={styles['detail-line']}>
            <span className={styles['label']}>Height:</span>
            <span className={styles['value']}>{profile.height}</span>
          </div>
          
          <div className={styles['detail-line']}>
            <span className={styles['label']}>Weight:</span>
            <span className={styles['value']}>{profile.weight}</span>
          </div>
          
          <div className={styles['detail-line']}>
            <span className={styles['label']}>Date of Birth:</span>
            <span className={styles['value']}>{profile.dob}</span>
          </div>
          
          <div className={styles['detail-line']}>
            <span className={styles['label']}>College:</span>
            <span className={styles['value']}>{profile.college}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerHeader;
