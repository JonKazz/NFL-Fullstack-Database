import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './KeyPlayers.module.css';
import { fetchPlayerProfile, fetchApTeamVotes, fetchSeasonInfo, fetchSeasonStatsByYear } from '../../api/fetches';

/**
 * Component that displays key players (QB, RB, WR) for a team
 * @param {Object} props - Component props
 * @param {Array} props.playerStats - Array of player statistics for the team
 * @param {string} props.teamId - Team ID for the season
 * @param {number} props.year - Season year
 * @returns {JSX.Element} KeyPlayers component
 */
function KeyPlayers({ playerStats, teamId, year }) {
  const [playerProfiles, setPlayerProfiles] = useState({});
  const [apTeamVotes, setApTeamVotes] = useState([]);
  const [awardWinners, setAwardWinners] = useState([]);
  const [rankings, setRankings] = useState({});
  const [isCompact, setIsCompact] = useState(false);

  // Calculate dynamic flex ratios based on content
  const totalAwards = awardWinners.length + apTeamVotes.length;
  const hasAwardsOrAllPro = totalAwards > 0;
  const hasManyAwards = totalAwards > 5;

  // Fetch AP team votes and player profiles in parallel
  useEffect(() => {
    const fetchData = async () => {
      if (!playerStats || !Array.isArray(playerStats)) return;

      const profiles = {};
      const keyPlayers = getKeyPlayers();

      // Fetch AP team votes, season info, and season stats in parallel
      const [apVotes, seasonInfo, allSeasonStats] = await Promise.all([
        teamId && year ? fetchApTeamVotes(year, teamId).catch(error => {
          console.warn('Failed to fetch AP team votes:', error);
          return [];
        }) : Promise.resolve([]),
        year ? fetchSeasonInfo(year).catch(error => {
          console.warn('Failed to fetch season info:', error);
          return null;
        }) : Promise.resolve(null),
        year ? fetchSeasonStatsByYear(year).catch(error => {
          console.warn('Failed to fetch season stats:', error);
          return [];
        }) : Promise.resolve([])
      ]);

      setApTeamVotes(apVotes);

      // Get award winners who were on this team
      const teamAwardWinners = getAwardWinnersOnTeam(seasonInfo, playerStats);
      setAwardWinners(teamAwardWinners);

      // Calculate rankings for key players
      const playerRankings = calculateRankings(keyPlayers, allSeasonStats);
      setRankings(playerRankings);

      // Combine key players, AP team votes, and award winners for profile fetching
      const allPlayers = [...keyPlayers, ...apVotes, ...teamAwardWinners];

      // Fetch all player profiles in parallel
      const profilePromises = allPlayers
        .filter(player => player && player.playerId)
        .map(async (player) => {
          try {
            const response = await fetchPlayerProfile(player.playerId);
            return {
              playerId: player.playerId,
              response: response
            };
          } catch (error) {
            console.warn(`Failed to fetch profile for player ${player.playerId}:`, error);
            return {
              playerId: player.playerId,
              response: null
            };
          }
        });

      const profileResults = await Promise.all(profilePromises);

      // Process the results
      profileResults.forEach(({ playerId, response }) => {
        if (response && response.exists && response.profile && response.profile.img) {
          profiles[playerId] = response.profile.img;
        }
      });

      setPlayerProfiles(profiles);
    };

    fetchData();
  }, [playerStats, teamId, year]);

  // Check if awards list needs to be compact
  useEffect(() => {
    if (hasManyAwards) {
      const checkHeight = () => {
        const awardsList = document.querySelector(`.${styles['many-awards-list']}`);
        if (awardsList) {
          const needsCompact = awardsList.scrollHeight > 250;
          setIsCompact(needsCompact);
        }
      };
      
      // Check after a short delay to ensure DOM is updated
      const timeoutId = setTimeout(checkHeight, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [hasManyAwards, awardWinners, apTeamVotes, styles]);

  /**
   * Gets award winners who were on this team
   * @param {Object} seasonInfo - Season info object with award winners
   * @param {Array} playerStats - Array of player stats for the team
   * @returns {Array} Array of award winner objects
   */
  const getAwardWinnersOnTeam = (seasonInfo, playerStats) => {
    if (!seasonInfo || !playerStats || !Array.isArray(playerStats)) return [];

    const teamPlayerIds = new Set(playerStats.map(player => player.playerId));
    const awardWinners = [];

    // Check each award winner
    const awards = [
      { id: seasonInfo.mvpId,  name: seasonInfo.mvpName,  title: 'MVP' },
      { id: seasonInfo.opoyId, name: seasonInfo.opoyName, title: 'OPOY' },
      { id: seasonInfo.dpoyId, name: seasonInfo.dpoyName, title: 'DPOY' },
      { id: seasonInfo.oroyId, name: seasonInfo.oroyName, title: 'OROY' },
      { id: seasonInfo.droyId, name: seasonInfo.droyName, title: 'DROY' }
    ];

    awards.forEach(award => {
      if (award.id && award.name && teamPlayerIds.has(award.id)) {
        // Find the player's position from playerStats
        const player = playerStats.find(p => p.playerId === award.id);
        const position = player?.position || 'Unknown';
        
        awardWinners.push({
          playerId: award.id,
          playerName: award.name,
          title: award.title,
          position: position
        });
      }
    });

    return awardWinners;
  };

  /**
   * Calculates rankings for key players based on season-wide stats
   * @param {Array} keyPlayers - Array of key player objects
   * @param {Array} seasonStats - Array of all player stats for the season
   * @returns {Object} Object with playerId as key and ranking info as value
   */
  const calculateRankings = (keyPlayers, seasonStats) => {
    if (!seasonStats || !Array.isArray(seasonStats) || seasonStats.length === 0) return {};

    const rankings = {};

    // Calculate passing yards ranking
    const passingLeaders = seasonStats
      .filter(player => player.passingYards && player.passingYards > 0)
      .sort((a, b) => (b.passingYards || 0) - (a.passingYards || 0));

    // Calculate rushing yards ranking
    const rushingLeaders = seasonStats
      .filter(player => player.rushingYards && player.rushingYards > 0)
      .sort((a, b) => (b.rushingYards || 0) - (a.rushingYards || 0));

    // Calculate receiving yards ranking
    const receivingLeaders = seasonStats
      .filter(player => player.receivingYards && player.receivingYards > 0)
      .sort((a, b) => (b.receivingYards || 0) - (a.receivingYards || 0));

    // Find rankings for each key player
    keyPlayers.forEach(player => {
      if (player.title === 'Leading Passer') {
        const rank = passingLeaders.findIndex(p => p.playerId === player.playerId) + 1;
        rankings[`${player.playerId}-passing`] = { 
          rank, 
          total: passingLeaders.length, 
          category: 'Passing',
          title: player.title
        };
      } else if (player.title === 'Leading Rusher') {
        const rank = rushingLeaders.findIndex(p => p.playerId === player.playerId) + 1;
        rankings[`${player.playerId}-rushing`] = { 
          rank, 
          total: rushingLeaders.length, 
          category: 'Rushing',
          title: player.title
        };
      } else if (player.title === 'Leading Receiver') {
        const rank = receivingLeaders.findIndex(p => p.playerId === player.playerId) + 1;
        rankings[`${player.playerId}-receiving`] = { 
          rank, 
          total: receivingLeaders.length, 
          category: 'Receiving',
          title: player.title
        };
      }
    });

    return rankings;
  };

  /**
   * Gets the key players (QB with most passing yards, RB with most rushing yards, WR with most receiving yards)
   * Allows the same player to appear multiple times if they lead multiple categories
   * @returns {Array} Array of key player objects
   */
  const getKeyPlayers = () => {
    if (!playerStats || !Array.isArray(playerStats)) return [];

    const keyPlayers = [];

    // Find QB with most passing yards
    const qb = playerStats
      .filter(player => player.passingYards && player.passingYards > 0)
      .sort((a, b) => (b.passingYards || 0) - (a.passingYards || 0))[0];

    // Find RB with most rushing yards
    const rb = playerStats
      .filter(player => player.rushingYards && player.rushingYards > 0)
      .sort((a, b) => (b.rushingYards || 0) - (a.rushingYards || 0))[0];

    // Find WR with most receiving yards
    const wr = playerStats
      .filter(player => player.receivingYards && player.receivingYards > 0)
      .sort((a, b) => (b.receivingYards || 0) - (a.receivingYards || 0))[0];

    // Add players to the list (allowing duplicates)
    if (qb) {
      keyPlayers.push({ ...qb, position: 'QB', title: 'Leading Passer' });
    }
    
    if (rb) {
      keyPlayers.push({ ...rb, position: 'RB', title: 'Leading Rusher' });
    }
    
    if (wr) {
      keyPlayers.push({ ...wr, position: 'WR', title: 'Leading Receiver' });
    }

    return keyPlayers;
  };

  const keyPlayers = getKeyPlayers();
  
  // No flex ratios needed - all players will be in one centered container

  if (keyPlayers.length === 0 && !hasAwardsOrAllPro) {
    return null;
  }

  return (
    <div className={styles['key-players-layout']}>
        {/* All Players Section - Leaders and Awards together (4 or fewer awards) */}
        {!hasManyAwards && (
          <div className={styles['all-players-section']}>
            <div className={styles['players-grid']}>
              {/* Team Leaders */}
              {keyPlayers.map((player, index) => (
                <div 
                  key={player.playerId || index} 
                  className={styles['player-card']}
                >
                  <div className={styles['player-title']}>{player.title}</div>
                  <div className={styles['player-image-container']}>
                    <img 
                      src={playerProfiles[player.playerId] || '/icons/missing_player.jpg'} 
                      alt={player.playerName || player.playerId}
                      className={styles['player-image']}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/icons/missing_player.jpg';
                      }}
                    />
                    <div className={styles['player-position']}>{player.position}</div>
                    {rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`] && (
                      <div className={styles['player-ranking']}>
                        #{rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`].rank} {rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`].category}
                      </div>
                    )}
                  </div>
                  <div className={styles['player-info']}>
                    <Link 
                      to={`/player/${player.playerId}`} 
                      className={styles['player-name']}
                    >
                      {player.playerName || player.playerId}
                    </Link>
                  </div>
                </div>
              ))}

              {/* Award Winners and All-Pro Players (only if 4 or fewer total) */}
              {hasAwardsOrAllPro && (
                <>
                  {/* Award Winners First (with gold title) */}
                  {awardWinners.map((winner, index) => (
                    <div 
                      key={winner.playerId || `award-${index}`} 
                      className={`${styles['player-card']} ${styles['award-winner-card']}`}
                    >
                      <div className={`${styles['player-title']} ${styles['award-winner-title']}`}>{winner.title}</div>
                      <div className={styles['player-image-container']}>
                        <img 
                          src={playerProfiles[winner.playerId] || '/icons/missing_player.jpg'} 
                          alt={winner.playerName || winner.playerId}
                          className={styles['player-image']}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/icons/missing_player.jpg';
                          }}
                        />
                        <div className={styles['player-position']}>{winner.position}</div>
                      </div>
                      <div className={styles['player-info']}>
                        <Link 
                          to={`/player/${winner.playerId}`} 
                          className={styles['player-name']}
                        >
                          {winner.playerName || winner.playerId}
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* 1st Team All-Pro */}
                  {apTeamVotes
                    .filter(vote => vote.apTeam === 1)
                    .map((vote, index) => (
                      <div 
                        key={vote.id || `ap-1st-${index}`} 
                        className={styles['player-card']}
                      >
                        <div className={styles['player-title']}>1st Team All-Pro</div>
                        <div className={styles['player-image-container']}>
                          <img 
                            src={playerProfiles[vote.playerId] || '/icons/missing_player.jpg'} 
                            alt={vote.playerName || vote.playerId}
                            className={styles['player-image']}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/icons/missing_player.jpg';
                            }}
                          />
                          <div className={styles['player-position']}>{playerProfiles[vote.playerId]?.position || vote.position}</div>
                        </div>
                        <div className={styles['player-info']}>
                          <Link 
                            to={`/player/${vote.playerId}`} 
                            className={styles['player-name']}
                          >
                            {vote.playerName || vote.playerId}
                          </Link>
                        </div>
                      </div>
                    ))}

                  {/* 2nd Team All-Pro */}
                  {apTeamVotes
                    .filter(vote => vote.apTeam === 2)
                    .map((vote, index) => (
                      <div 
                        key={vote.id || `ap-2nd-${index}`} 
                        className={styles['player-card']}
                      >
                        <div className={styles['player-title']}>2nd Team All-Pro</div>
                        <div className={styles['player-image-container']}>
                          <img 
                            src={playerProfiles[vote.playerId] || '/icons/missing_player.jpg'} 
                            alt={vote.playerName || vote.playerId}
                            className={styles['player-image']}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/icons/missing_player.jpg';
                            }}
                          />
                          <div className={styles['player-position']}>{playerProfiles[vote.playerId]?.position || vote.position}</div>
                        </div>
                        <div className={styles['player-info']}>
                          <Link 
                            to={`/player/${vote.playerId}`} 
                            className={styles['player-name']}
                          >
                            {vote.playerName || vote.playerId}
                          </Link>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Many Awards Layout - Leaders on left, Awards on right (more than 4 awards) */}
        {hasManyAwards && (
          <div className={styles['many-awards-layout']}>
            {/* Leaders Section */}
            <div className={styles['leaders-section']}>
              <div className={styles['players-grid']}>
                {keyPlayers.map((player, index) => (
                  <div 
                    key={player.playerId || index} 
                    className={styles['player-card']}
                  >
                    <div className={styles['player-title']}>{player.title}</div>
                    <div className={styles['player-image-container']}>
                      <img 
                        src={playerProfiles[player.playerId] || '/icons/missing_player.jpg'} 
                        alt={player.playerName || player.playerId}
                        className={styles['player-image']}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/icons/missing_player.jpg';
                        }}
                      />
                      <div className={styles['player-position']}>{player.position}</div>
                      {rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`] && (
                        <div className={styles['player-ranking']}>
                          #{rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`].rank} {rankings[`${player.playerId}-${player.title.toLowerCase().replace('leading ', '').replace('er', 'ing')}`].category}
                        </div>
                      )}
                    </div>
                    <div className={styles['player-info']}>
                      <Link 
                        to={`/player/${player.playerId}`} 
                        className={styles['player-name']}
                      >
                        {player.playerName || player.playerId}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards Section */}
            <div className={styles['awards-section']}>
              <div className={`${styles['many-awards-list']} ${isCompact ? styles['compact'] : ''}`}>
                {/* Award Winners First (with gold outline) */}
                {awardWinners.map((winner, index) => (
                  <div 
                    key={winner.playerId || `award-${index}`} 
                    className={`${styles['many-award-row']} ${styles['award-winner-row']}`}
                  >
                    <div className={styles['award-name-container']}>
                      <span className={styles['award-name']}>{winner.title}</span>
                    </div>
                    <div className={styles['award-player-container']}>
                      <Link 
                        to={`/player/${winner.playerId}`} 
                        className={styles['award-player-name']}
                      >
                        {winner.playerName || winner.playerId}
                      </Link>
                    </div>
                    <div className={styles['award-position-container']}>
                      <span className={styles['award-position']}>{winner.position}</span>
                    </div>
                  </div>
                ))}

                {/* 1st Team All-Pro */}
                {apTeamVotes
                  .filter(vote => vote.apTeam === 1)
                  .map((vote, index) => (
                    <div 
                      key={vote.id || `ap-1st-${index}`} 
                      className={styles['many-award-row']}
                    >
                      <div className={styles['award-name-container']}>
                        <span className={styles['award-name']}>1st Team All-Pro</span>
                      </div>
                      <div className={styles['award-player-container']}>
                        <Link 
                          to={`/player/${vote.playerId}`} 
                          className={styles['award-player-name']}
                        >
                          {vote.playerName || vote.playerId}
                        </Link>
                      </div>
                      <div className={styles['award-position-container']}>
                        <span className={styles['award-position']}>{vote.position}</span>
                      </div>
                    </div>
                  ))}

                {/* 2nd Team All-Pro */}
                {apTeamVotes
                  .filter(vote => vote.apTeam === 2)
                  .map((vote, index) => (
                    <div 
                      key={vote.id || `ap-2nd-${index}`} 
                      className={styles['many-award-row']}
                    >
                      <div className={styles['award-name-container']}>
                        <span className={styles['award-name']}>2nd Team All-Pro</span>
                      </div>
                      <div className={styles['award-player-container']}>
                        <Link 
                          to={`/player/${vote.playerId}`} 
                          className={styles['award-player-name']}
                        >
                          {vote.playerName || vote.playerId}
                        </Link>
                      </div>
                      <div className={styles['award-position-container']}>
                        <span className={styles['award-position']}>{vote.position}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default KeyPlayers;