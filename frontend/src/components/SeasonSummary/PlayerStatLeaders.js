import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PlayerStatLeaders.module.css';
import { fetchSeasonStatsByYear, fetchPlayerProfile } from '../../api/fetches';
import { TEAM_MAP, getNeonTeamColor } from '../../utils';

// Stat categories configuration
const STAT_CATEGORIES = {
  passing: {
    title: 'Passing',
    gridClass: 'passing-stats-grid',
    stats: [
      { field: 'passingYards', title: 'Passing Yard Leaders' },
      { field: 'passingAttempts', title: 'Passing Attempt Leaders' },
      { field: 'passingTouchdowns', title: 'Passing Touchdown Leaders' },
      { field: 'passingInterceptions', title: 'Passing Interception Leaders' }
    ]
  },
  rushing: {
    title: 'Rushing',
    gridClass: 'stats-grid',
    stats: [
      { field: 'rushingYards', title: 'Rushing Yard Leaders' },
      { field: 'rushingTouchdowns', title: 'Rushing Touchdown Leaders' }
    ]
  },
  receiving: {
    title: 'Receiving',
    gridClass: 'receiving-stats-grid',
    stats: [
      { field: 'receivingYards', title: 'Receiving Yard Leaders' },
      { field: 'receivingTouchdowns', title: 'Receiving Touchdown Leaders' },
      { field: 'receivingTargets', title: 'Receiving Target Leaders' },
      { field: 'receivingReceptions', title: 'Reception Leaders' }
    ]
  },
  defense: {
    title: 'Defense',
    gridClass: 'defensive-stats-grid',
    stats: [
      { field: 'defensiveTacklesCombined', title: 'Tackle Leaders' },
      { field: 'defensiveQbHits', title: 'QB Hit Leaders' },
      { field: 'defensiveSacks', title: 'Sack Leaders' },
      { field: 'defensiveInterceptions', title: 'Interception Leaders' }
    ]
  }
};

// Reusable StatCategory component
function StatCategory({ 
  title, 
  gridClass, 
  stats, 
  getTopPlayers, 
  playerProfiles, 
  getPlayerNameLink, 
  getPlayerNameWithImage, 
  getTeamNameShort 
}) {
  return (
    <div className={styles['stats-section']}>
      <h3>{title}</h3>
      <div className={styles[gridClass]}>
        {stats.map(({ field, title: statTitle }) => (
          <div key={field} className={styles['stat-category']}>
            <h4>{statTitle}</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers(field, 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers(field, 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers(field, 1)[0].playerName || getTopPlayers(field, 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ 
                      borderColor: getNeonTeamColor(getTopPlayers(field, 1)[0].teamId),
                      boxShadow: `0 2px 2px rgba(0, 0, 0, 0.3), 0 0 2
                      px rgba(255, 255, 255, 0.8), 0 0 6px ${getNeonTeamColor(getTopPlayers(field, 1)[0].teamId)}`
                    }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
                <tbody>
                  {getTopPlayers(field).map((player, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{getPlayerNameWithImage(player, index, field)}</td>
                      <td>{getTeamNameShort(player.teamId)}</td>
                      <td>{player[field]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerStatLeaders({ year }) {
  const [seasonStats, setSeasonStats] = useState({});
  const [playerProfiles, setPlayerProfiles] = useState({});

  // Fetch season player stats for stat leaders
  useEffect(() => {
    const loadSeasonStats = async () => {
      if (!year) return;

      try {
        const stats = await fetchSeasonStatsByYear(year);
        setSeasonStats(stats);
      } catch (error) {
        console.warn('Failed to fetch season stats:', error);
      }
    };

    loadSeasonStats();
  }, [year]);

  // Fetch player profiles for top players
  useEffect(() => {
    const loadPlayerProfiles = async () => {
      if (!seasonStats || !Array.isArray(seasonStats)) return;

      const profiles = {};
      const topPlayers = [
        ...getTopPlayers('passingYards', 1),
        ...getTopPlayers('passingAttempts', 1),
        ...getTopPlayers('passingTouchdowns', 1),
        ...getTopPlayers('passingInterceptions', 1),
        ...getTopPlayers('rushingYards', 1),
        ...getTopPlayers('rushingTouchdowns', 1),
        ...getTopPlayers('receivingYards', 1),
        ...getTopPlayers('receivingTouchdowns', 1),
        ...getTopPlayers('receivingTargets', 1),
        ...getTopPlayers('receivingReceptions', 1),
        ...getTopPlayers('defensiveTacklesCombined', 1),
        ...getTopPlayers('defensiveQbHits', 1),
        ...getTopPlayers('defensiveSacks', 1),
        ...getTopPlayers('defensiveInterceptions', 1)
      ];

      for (const player of topPlayers) {
        if (player.playerId) {
          try {
            const response = await fetchPlayerProfile(player.playerId);
            if (response.exists && response.profile && response.profile.img) {
              profiles[player.playerId] = response.profile.img;
            }
          } catch (error) {
            console.warn(`Failed to fetch profile for player ${player.playerId}:`, error);
          }
        }
      }

      setPlayerProfiles(profiles);
    };

    loadPlayerProfiles();
  }, [seasonStats]);

  // Get top 8 players for a specific stat
  const getTopPlayers = (statField, limit = 8) => {
    if (!seasonStats || !Array.isArray(seasonStats)) return [];
    
    return seasonStats
      .filter(player => player[statField] && player[statField] > 0)
      .sort((a, b) => (b[statField] || 0) - (a[statField] || 0))
      .slice(0, limit);
  };

  // Helper function to get player name as a link
  const getPlayerNameLink = (player) => {
    const playerName = player.playerName || player.playerId || 'N/A';
    const playerId = player.playerId;
    return (
      <Link to={`/player/${playerId}`} className={styles['player-link']}>
        {playerName}
      </Link>
    );
  };

  // Helper function to get player name with image for #1 players
  const getPlayerNameWithImage = (player, index, statField) => {
    // Always return just the player name link, no images in the table
    return getPlayerNameLink(player);
  };



  // Helper function to get team name short
  const getTeamNameShort = (teamId) => {
    return TEAM_MAP[teamId]?.name_short || teamId || 'N/A';
  };

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Player Stat Leaders</h2>
      
      {Object.entries(STAT_CATEGORIES).map(([key, category]) => (
        <StatCategory
          key={key}
          title={category.title}
          gridClass={category.gridClass}
          stats={category.stats}
          getTopPlayers={getTopPlayers}
          playerProfiles={playerProfiles}
          getPlayerNameLink={getPlayerNameLink}
          getPlayerNameWithImage={getPlayerNameWithImage}
          getTeamNameShort={getTeamNameShort}
        />
      ))}
    </div>
  );
}

export default PlayerStatLeaders;
