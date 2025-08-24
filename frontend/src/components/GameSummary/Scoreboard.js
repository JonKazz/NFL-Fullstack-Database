import React from 'react';
import styles from './Scoreboard.module.css';

function Scoreboard({ homeTeam, awayTeam, homeStats, awayStats, gameInfo, homeName, awayName }) {
  const hasOvertime = !!gameInfo.overtime;

  return (
    <div className={styles.scoreboard}>
      <div className={styles.team}>
        <div className={styles['team-logo']}>
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
        <div className={styles['team-name']}>{homeName}</div>
        <div className={styles['team-record']}>({gameInfo.homeTeamRecord || 'N/A'})</div>
        <div className={styles.score}>{homeStats.pointsTotal}</div>
      </div>

      <div className={styles.vs}>
        <div className={styles['team-record']}>VS</div>
        {hasOvertime && <div className={styles.overtime}>OT</div>}
      </div>

      <div className={styles.team}>
        <div className={styles['team-logo']}>
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
        <div className={styles['team-name']}>{awayName}</div>
        <div className={styles['team-record']}>({gameInfo.awayTeamRecord || 'N/A'})</div>
        <div className={styles.score}>{awayStats.pointsTotal}</div>
      </div>
    </div>
  );
}

export default Scoreboard;
