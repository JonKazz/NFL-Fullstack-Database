import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './StatLeaders.module.css';
import { fetchSeasonStatsByYear, fetchPlayerProfile } from '../../api/fetches';
import { TEAM_MAP, getTeamPrimaryColor } from '../../utils';

function StatLeaders({ year }) {
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
    const playerName = player.playerName || player.playerId || 'N/A';
    const playerId = player.playerId;
    const isTopPlayer = index === 0 && (statField === 'passingYards' || statField === 'passingAttempts');
    
    if (isTopPlayer && playerProfiles[playerId]) {
      return (
        <div className={styles['player-with-image']}>
          <img 
            src={playerProfiles[playerId]} 
            alt={playerName}
            className={styles['player-image']}
          />
          <Link to={`/player/${playerId}`} className={styles['player-link']}>
            {playerName}
          </Link>
        </div>
      );
    }
    
    return getPlayerNameLink(player);
  };



  // Helper function to get team name short
  const getTeamNameShort = (teamId) => {
    return TEAM_MAP[teamId]?.name_short || teamId || 'N/A';
  };

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Player Stat Leaders</h2>
      
      {/* Passing Stats */}
      <div className={styles['stats-section']}>
        <h3>Passing</h3>
        <div className={styles['passing-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Passing Yard Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('passingYards', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('passingYards', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('passingYards', 1)[0].playerName || getTopPlayers('passingYards', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('passingYards', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
                <tbody>
                  {getTopPlayers('passingYards').map((player, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{getPlayerNameLink(player)}</td>
                      <td>{getTeamNameShort(player.teamId)}</td>
                      <td>{player.passingYards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Attempt Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('passingAttempts', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('passingAttempts', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('passingAttempts', 1)[0].playerName || getTopPlayers('passingAttempts', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('passingAttempts', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
                <tbody>
                  {getTopPlayers('passingAttempts').map((player, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{getPlayerNameLink(player)}</td>
                      <td>{getTeamNameShort(player.teamId)}</td>
                      <td>{player.passingAttempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Touchdown Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('passingTouchdowns', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('passingTouchdowns', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('passingTouchdowns', 1)[0].playerName || getTopPlayers('passingTouchdowns', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('passingTouchdowns', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('passingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.passingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Passing Interception Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('passingInterceptions', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('passingInterceptions', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('passingInterceptions', 1)[0].playerName || getTopPlayers('passingInterceptions', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('passingInterceptions', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('passingInterceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameWithImage(player, index, 'passingInterceptions')}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.passingInterceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Rushing Stats */}
      <div className={styles['stats-section']}>
        <h3>Rushing</h3>
        <div className={styles['stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Rushing Yard Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('rushingYards', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('rushingYards', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('rushingYards', 1)[0].playerName || getTopPlayers('rushingYards', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('rushingYards', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('rushingYards').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameWithImage(player, index, 'rushingYards')}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.rushingYards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Rushing Touchdown Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('rushingTouchdowns', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('rushingTouchdowns', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('rushingTouchdowns', 1)[0].playerName || getTopPlayers('rushingTouchdowns', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('rushingTouchdowns', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('rushingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.rushingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Receiving Stats */}
      <div className={styles['stats-section']}>
        <h3>Receiving</h3>
        <div className={styles['receiving-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Receiving Yard Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('receivingYards', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('receivingYards', 1)[0]?.playerId] || '/icons/missing_player.jpg'} 
                    alt={getTopPlayers('receivingYards', 1)[0].playerName || getTopPlayers('receivingYards', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('receivingYards', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('receivingYards').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.receivingYards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Receiving Touchdown Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('receivingTouchdowns', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('receivingTouchdowns', 1)[0].playerId]} 
                    alt={getTopPlayers('receivingTouchdowns', 1)[0].playerName || getTopPlayers('receivingTouchdowns', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('receivingTouchdowns', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('receivingTouchdowns').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.receivingTouchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Receiving Target Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('receivingTargets', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('receivingTargets', 1)[0].playerId]} 
                    alt={getTopPlayers('receivingTargets', 1)[0].playerName || getTopPlayers('receivingTargets', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('receivingTargets', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('receivingTargets').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.receivingTargets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Reception Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('receivingReceptions', 1).length > 0 && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('receivingReceptions', 1)[0].playerId]} 
                    alt={getTopPlayers('receivingReceptions', 1)[0].playerName || getTopPlayers('receivingReceptions', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('receivingReceptions', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('receivingReceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.receivingReceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Defensive Stats */}
      <div className={styles['stats-section']}>
        <h3>Defense</h3>
        <div className={styles['defensive-stats-grid']}>
          <div className={styles['stat-category']}>
            <h4>Tackle Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('defensiveTacklesCombined', 1).length > 0 && playerProfiles[getTopPlayers('defensiveTacklesCombined', 1)[0]?.playerId] && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('defensiveTacklesCombined', 1)[0].playerId]} 
                    alt={getTopPlayers('defensiveTacklesCombined', 1)[0].playerName || getTopPlayers('defensiveTacklesCombined', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('defensiveTacklesCombined', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('defensiveTacklesCombined').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.defensiveTacklesCombined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>QB Hit Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('defensiveQbHits', 1).length > 0 && playerProfiles[getTopPlayers('defensiveQbHits', 1)[0]?.playerId] && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('defensiveQbHits', 1)[0].playerId]} 
                    alt={getTopPlayers('defensiveQbHits', 1)[0].playerName || getTopPlayers('defensiveQbHits', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('defensiveQbHits', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('defensiveQbHits').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.defensiveQbHits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Sack Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('defensiveSacks', 1).length > 0 && playerProfiles[getTopPlayers('defensiveSacks', 1)[0]?.playerId] && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('defensiveSacks', 1)[0].playerId]} 
                    alt={getTopPlayers('defensiveSacks', 1)[0].playerName || getTopPlayers('defensiveSacks', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('defensiveSacks', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('defensiveSacks').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.defensiveSacks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className={styles['stat-category']}>
            <h4>Interception Leaders</h4>
            <div className={styles['table-with-image']}>
              {getTopPlayers('defensiveInterceptions', 1).length > 0 && playerProfiles[getTopPlayers('defensiveInterceptions', 1)[0]?.playerId] && (
                <div className={styles['top-player-image']}>
                  <img 
                    src={playerProfiles[getTopPlayers('defensiveInterceptions', 1)[0].playerId]} 
                    alt={getTopPlayers('defensiveInterceptions', 1)[0].playerName || getTopPlayers('defensiveInterceptions', 1)[0].playerId}
                    className={styles['player-image-large']}
                    style={{ borderColor: getTeamPrimaryColor(getTopPlayers('defensiveInterceptions', 1)[0].teamId) }}
                  />
                </div>
              )}
              <table className={styles['leader-table']}>
              <tbody>
                {getTopPlayers('defensiveInterceptions').map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{getPlayerNameLink(player)}</td>
                    <td>{getTeamNameShort(player.teamId)}</td>
                    <td>{player.defensiveInterceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatLeaders;
