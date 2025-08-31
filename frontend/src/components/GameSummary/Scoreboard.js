import React from 'react';
import styles from './Scoreboard.module.css';

function Scoreboard({ homeTeam, awayTeam, homeStats, awayStats, gameInfo, homeName, awayName, homeTeamColor, awayTeamColor }) {
  const homeScore = homeStats.pointsTotal;
  const awayScore = awayStats.pointsTotal;
  const homeWon = homeScore > awayScore;
  const awayWon = awayScore > homeScore;

  // Determine what to display based on playoff status
  let displayText = '';
  if (gameInfo.playoffGame) {
    displayText = `${gameInfo.playoffGame} • ${gameInfo.date}`;
  } else {
    displayText = `Week ${gameInfo.seasonWeek} • ${gameInfo.date}`;
  }

  return (
    <div className={styles.scoreboard}>
      {/* Game Info Header */}
      <div className={styles['game-info-header']}>
        {displayText}
      </div>
      
      {/* Home Team (Left Side) */}
      <div className={styles.team}>
        <div 
          className={styles['team-logo']}
          style={{ border: `4px solid ${homeTeamColor}` }}
        >
          {homeTeam?.logo ? (
            <img 
              src={homeTeam.logo} 
              alt={`${homeName} logo`}
              className={styles['team-logo-img']}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={styles['team-logo-fallback']}>
            {homeStats.id.teamId.toUpperCase()}
          </div>
        </div>
        <div className={styles['team-info']}>
          <div className={styles['team-name']}>{homeName}</div>
          <div className={styles['team-record']}>({gameInfo.homeTeamRecord || 'N/A'})</div>
        </div>
        <div className={`${styles.score} ${homeWon ? styles.winner : styles.loser}`}>{homeStats.pointsTotal}</div>
      </div>

      {/* VS Section */}
      <div className={styles.vs}>
        <div className={styles['vs-text']}>VS</div>
        {gameInfo.overtime && <div className={styles.overtime}>OT</div>}
      </div>

      {/* Away Team (Right Side) */}
      <div className={styles.team}>
        <div className={`${styles.score} ${awayWon ? styles.winner : styles.loser}`}>{awayStats.pointsTotal}</div>
        <div className={styles['team-info']}>
          <div className={styles['team-name']}>{awayName}</div>
          <div className={styles['team-record']}>({gameInfo.awayTeamRecord || 'N/A'})</div>
        </div>
        <div 
          className={styles['team-logo']}
          style={{ border: `4px solid ${awayTeamColor}` }}
        >
          {awayTeam?.logo ? (
            <img 
              src={awayTeam.logo} 
              alt={`${awayName} logo`}
              className={styles['team-logo-img']}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={styles['team-logo-fallback']}>
            {awayStats.id.teamId.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;

