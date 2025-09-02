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
    return game?.gameInfo?.playoffGame === null || game?.gameInfo?.playoffGame === undefined;
  });

  // Filter playoff games
  const playoffGames = sortedGames.filter(game => {
    return game?.gameInfo?.playoffGame !== null && game?.gameInfo?.playoffGame !== undefined;
  });

  const renderGameCard = (game, idx, isPlayoff = false) => {
    // Safety check - ensure game has required properties
    if (!game || !game.gameInfo || !game.gameStats || !Array.isArray(game.gameStats)) {
      return null;
    }
    
    const { gameInfo, gameStats } = game;
    const myStats = gameStats.find(gs => gs && gs.id && gs.id.teamId === teamId);
    const oppStats = gameStats.find(gs => gs && gs.id && gs.id.teamId !== teamId);
    
    // Safety check - if stats are not found or pointsTotal is undefined, skip this game
    if (!myStats || !oppStats || typeof myStats.pointsTotal === 'undefined' || typeof oppStats.pointsTotal === 'undefined') {
      return null;
    }
    
    const isHome = gameInfo.homeTeamId === teamId;
    const isWin = myStats.pointsTotal > oppStats.pointsTotal;

    const gameCardClass = `${styles['game-card']} ${isPlayoff ? styles.playoff : ''} ${isWin ? styles.win : styles.loss}`;

    return (
      <div
        className={gameCardClass}
        onClick={() => handleGameClick(gameInfo.gameId)}
        key={gameInfo.gameId || idx}
      >
        {/* Game Header */}
        <div className={styles['game-header']}>
          <div className={styles['game-meta']}>
            <div className={styles['week-date-row']}>
              {isPlayoff ? (
                <div className={styles['playoff-game-text']}>
                  {gameInfo.playoffGame === 'Conference Championship' ? 'Conference' : gameInfo.playoffGame}
                </div>
              ) : (
                <div className={styles.week}>
                  Week {gameInfo.seasonWeek}
                </div>
              )}
              <div className={styles['game-date']}>{gameInfo.date}</div>
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
                {TEAM_MAP[myStats.id.teamId]?.city}
              </div>
              <div className={styles['team-record']}>
                {/* Could add team record here if available */}
              </div>
            </div>
            <div className={`${styles['team-score']} ${isWin ? styles['winner-score'] : ''}`}>
              {myStats.pointsTotal}
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
                {TEAM_MAP[oppStats.id.teamId]?.city}
              </div>
              <div className={styles['team-record']}>
                {/* Could add team record here if available */}
              </div>
            </div>
            <div className={`${styles['team-score']} ${!isWin ? styles['winner-score'] : ''}`}>
              {oppStats.pointsTotal}
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
