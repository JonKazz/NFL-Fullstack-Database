import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Games.module.css';
import { TEAM_MAP } from '../../utils';

function Games({ sortedGames, teamId }) {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Filter regular season games
  const regularSeasonGames = sortedGames.filter(game => {
    return game?.playoffGame === null || game?.playoffGame === undefined;
  });

  // Filter playoff games
  const playoffGames = sortedGames.filter(game => {
    return game?.playoffGame !== null && game?.playoffGame !== undefined;
  });

  const renderGameCard = (game, idx, isPlayoff = false) => {
    // Safety check - ensure game has required properties
    if (!game) {
      return null;
    }
    
    // For basic game info, we'll show the game but without detailed stats
    const isHome = game.homeTeamId === teamId;
    const isWin = game.homeTeamId === teamId ? 
      (game.homePoints > game.awayPoints) : 
      (game.awayPoints > game.homePoints);

    const gameCardClass = `${styles['game-card']} ${isPlayoff ? styles.playoff : ''} ${isWin ? styles.win : styles.loss}`;

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
                  {game.playoffGame === 'Conference Championship' ? 'Conference' : game.playoffGame}
                </div>
              ) : (
                <div className={styles.week}>
                  Week {game.seasonWeek}
                </div>
              )}
              <div className={styles['game-date']}>{game.date}</div>
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
                {TEAM_MAP[teamId]?.city}
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
                {TEAM_MAP[isHome ? game.awayTeamId : game.homeTeamId]?.city}
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

  return (
    <>
      {/* Regular Season Section */}
      {regularSeasonGames.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Regular Season</h2>
          <div className={styles['games-grid']}>
            {regularSeasonGames.map((game, idx) => renderGameCard(game, idx, false)).filter(Boolean)}
          </div>
        </div>
      )}

      {/* Playoffs Section - Only show if there are playoff games */}
      {playoffGames.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Playoffs</h2>
          <div className={styles['games-grid']}>
            {playoffGames.map((game, idx) => renderGameCard(game, idx, true)).filter(Boolean)}
          </div>
        </div>
      )}
    </>
  );
}

export default Games;
