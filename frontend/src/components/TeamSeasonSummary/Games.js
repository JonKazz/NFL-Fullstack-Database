import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Games.module.css';
import { TEAM_MAP, getNeonTeamColor } from '../../utils';

function Games({ sortedGames, teamId }) {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  /**
   * Formats a date string from "Sunday Dec 8, 2024" to "12/8/2024"
   * @param {string} dateString - The date string to format
   * @returns {string} - The formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Parse the date string and create a Date object
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      // Format as M/D/YYYY
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const day = date.getDate();
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if there's an error
    }
  };


  // Filter regular season games only
  const regularSeasonGames = sortedGames.filter(game => {
    return game?.playoffGame === null || game?.playoffGame === undefined;
  });

  // Filter all playoff games (including Super Bowl)
  const playoffGames = sortedGames.filter(game => {
    return game?.playoffGame !== null && game?.playoffGame !== undefined;
  });

  const renderGameCard = (game, idx, isPlayoff = false, isSuperBowl = false) => {
    // Safety check - ensure game has required properties
    if (!game) {
      return null;
    }
    
    // For basic game info, we'll show the game but without detailed stats
    const isHome = game.homeTeamId === teamId;
    const isWin = game.homeTeamId === teamId ? 
      (game.homePoints > game.awayPoints) : 
      (game.awayPoints > game.homePoints);

    const gameCardClass = `${styles['game-card']} ${isPlayoff ? styles.playoff : ''} ${isSuperBowl ? styles.superbowl : ''} ${isWin ? styles.win : styles.loss}`;

    return (
      <div
        className={gameCardClass}
        onClick={() => handleGameClick(game.gameId)}
        key={game.gameId || idx}
      >
        {/* Game Header */}
        <div className={styles['game-header']}>
          <div className={styles['game-meta']}>
            <div className={styles['week-date-row']}>
              {isPlayoff ? (
                <div className={styles['playoff-game-text']}>
                  {isSuperBowl ? 'Super Bowl' : (game.playoffGame === 'Conference Championship' ? 'Conference' : game.playoffGame)}
                </div>
              ) : (
                <div className={styles.week}>
                  Week {game.seasonWeek}
                </div>
              )}
              <div className={styles['game-date']}>{formatDate(game.date)}</div>
            </div>
          </div>
          <div className={styles['game-result']}>
            {isWin ? 'W' : 'L'}
          </div>
        </div>

        {/* Game Matchup */}
        <div className={styles['game-matchup']}>
          {/* My Team */}
          <div className={styles['team-section']}>
            <div className={styles['team-info']}>
              <div className={`${styles['team-name']} ${isWin ? styles['winner-text'] : ''}`}>
                {TEAM_MAP[teamId]?.name_short}
              </div>
              <div className={styles['team-record']}>
                {/* Could add team record here if available */}
              </div>
            </div>
            <div className={`${styles['team-score']} ${isWin ? styles['winner-score'] : ''}`}>
              {isHome ? game.homePoints : game.awayPoints}
            </div>
          </div>

          {/* Game Status */}
          <div className={styles['game-status']}>
            <div className={styles['vs-indicator']}>{isHome ? 'vs' : '@'}</div>
          </div>

          {/* Opponent Team */}
          <div className={styles['team-section']}>
            <div className={styles['team-info']}>
              <div className={`${styles['team-name']} ${!isWin ? styles['winner-text'] : ''}`}>
                {TEAM_MAP[isHome ? game.awayTeamId : game.homeTeamId]?.name_short}
              </div>
              <div className={styles['team-record']}>
                {/* Could add team record here if available */}
              </div>
            </div>
            <div className={`${styles['team-score']} ${!isWin ? styles['winner-score'] : ''}`}>
              {isHome ? game.awayPoints : game.homePoints}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const neonColor = getNeonTeamColor(teamId);

  return (
    <>
      {/* Regular Season and Playoffs Section */}
      {regularSeasonGames.length > 0 && (
        <div className={styles.section}>
          <div 
            className={styles['regular-season-container']}
            style={{ '--team-neon-color': neonColor }}
          >
            <h2 className={styles['regular-season-title']}>Games</h2>
            <div className={styles['games-wrapper']}>
              <div className={styles['games-grid']}>
                {regularSeasonGames.map((game, idx) => {
                  const isPlayoff = game?.playoffGame !== null && game?.playoffGame !== undefined;
                  return renderGameCard(game, idx, isPlayoff);
                }).filter(Boolean)}
              </div>
              
              {/* Playoff games - outside the grid but inside the wrapper */}
              {playoffGames.length > 0 && (
                <div className={styles['playoff-container']}>
                  {playoffGames.map((game, idx) => {
                    const isSuperBowl = game?.playoffGame === 'Superbowl';
                    return renderGameCard(game, idx, true, isSuperBowl); // true for isPlayoff, isSuperBowl based on game type
                  }).filter(Boolean)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Games;
