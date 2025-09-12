import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AwardWinners.module.css';
import { fetchPlayerProfile, fetchPlayerTeamBySeason } from '../../api/fetches';
import { getNeonTeamColor } from '../../utils';

function AwardWinners({ awards, seasonYear }) {
  const [playerProfiles, setPlayerProfiles] = useState({});
  const [playerTeamColors, setPlayerTeamColors] = useState({});

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

  // Fetch player team colors for the specific season
  useEffect(() => {
    const fetchPlayerTeamColors = async () => {
      if (!awards || awards.length === 0 || !seasonYear) return;

      const teamColors = {};
      
      for (const award of awards) {
        if (award.playerId) {
          try {
            const teamId = await fetchPlayerTeamBySeason(award.playerId, seasonYear);
            if (teamId) {
              const teamColor = getNeonTeamColor(teamId);
              teamColors[award.playerId] = teamColor;
            }
          } catch (error) {
            console.warn(`Failed to fetch team for player ${award.playerId}:`, error);
          }
        }
      }
      
      setPlayerTeamColors(teamColors);
    };

    fetchPlayerTeamColors();
  }, [awards, seasonYear]);

  // Helper function to get player name as a link
  const getPlayerNameLink = (award) => {
    const playerName = award.winner || 'N/A';
    const playerId = award.playerId;
    
    if (playerId) {
      return (
        <Link to={`/player/${playerId}`} className={styles['player-link']}>
          {playerName}
        </Link>
      );
    }
    
    return <span>{playerName}</span>;
  };

  // Sort awards in the desired order
  const sortedAwards = [...(awards || [])].sort((a, b) => {
    const order = [
      'Offensive Rookie of the Year',
      'Offensive Player of the Year', 
      'MVP',
      'Defensive Player of the Year',
      'Defensive Rookie of the Year'
    ];
    return order.indexOf(a.award) - order.indexOf(b.award);
  });

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Award Winners</h2>
      <div className={styles['awards-container']}>
        <div className={styles['awards-grid']}>
        {sortedAwards.map((award, index) => {
          const isMajorAward = ['Offensive Player of the Year', 'MVP', 'Defensive Player of the Year'].includes(award.award);
          return (
          <div 
            key={index} 
            className={`${styles['award-card']} ${isMajorAward ? styles['major-award-card'] : ''}`}
            style={{ borderColor: playerTeamColors[award.playerId] || '#ffff00' }}
          >
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
            <div className={styles['award-team']}>{award.team}</div>
            <div className={styles['player-picture-placeholder']}>
              <img 
                src={playerProfiles[award.playerId] || '/icons/missing_player.jpg'} 
                alt={`${award.winner}`}
                className={styles['player-picture']}
                style={{ borderColor: playerTeamColors[award.playerId] || 'rgba(255, 255, 255, 0.2)' }}
              />
            </div>
            <div className={styles['award-winner']}>{getPlayerNameLink(award)}</div>
          </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default AwardWinners;
