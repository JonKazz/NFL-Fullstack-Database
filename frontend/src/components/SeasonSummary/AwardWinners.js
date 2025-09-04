import React, { useState, useEffect } from 'react';
import styles from './AwardWinners.module.css';
import { fetchPlayerProfile } from '../../api/fetches';

function AwardWinners({ awards }) {
  const [playerProfiles, setPlayerProfiles] = useState({});

  // Fetch player profiles for award winners using player IDs
  useEffect(() => {
    const fetchPlayerProfiles = async () => {
      if (!awards || awards.length === 0) return;

      const profiles = {};
      
      for (const award of awards) {
        if (award.playerId) {
          try {
            const response = await fetchPlayerProfile(award.playerId);
            if (response.exists && response.profile && response.profile.img) {
              profiles[award.playerId] = response.profile.img;
            }
          } catch (error) {
            console.warn(`Failed to fetch profile for player ${award.playerId}:`, error);
          }
        }
      }
      
      setPlayerProfiles(profiles);
    };

    fetchPlayerProfiles();
  }, [awards]);

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Award Winners</h2>
      <div className={styles['awards-grid']}>
        {awards.map((award, index) => (
          <div key={index} className={styles['award-card']}>
            {award.award === 'MVP' && (
              <div className={styles['mvp-title']}>MVP</div>
            )}
            {award.award === 'Offensive Player of the Year' && (
              <div className={styles['award-title']}>
                <div>Offensive</div>
                <div>Player of the Year</div>
              </div>
            )}
            {award.award === 'Defensive Player of the Year' && (
              <div className={styles['award-title']}>
                <div>Defensive</div>
                <div>Player of the Year</div>
              </div>
            )}
            {award.award === 'Offensive Rookie of the Year' && (
              <div className={styles['award-title']}>
                <div>Offensive</div>
                <div>Rookie of the Year</div>
              </div>
            )}
            {award.award === 'Defensive Rookie of the Year' && (
              <div className={styles['award-title']}>
                <div>Defensive</div>
                <div>Rookie of the Year</div>
              </div>
            )}
            <div className={styles['award-winner']}>{award.winner}</div>
            <div className={styles['award-team']}>{award.team}</div>
            <div className={styles['player-picture-placeholder']}>
              {award.playerId && playerProfiles[award.playerId] ? (
                <img 
                  src={playerProfiles[award.playerId]} 
                  alt={`${award.winner}`}
                  className={styles['player-picture']}
                />
              ) : (
                <div className={styles['picture-placeholder']}>
                  <span>📷</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AwardWinners;
