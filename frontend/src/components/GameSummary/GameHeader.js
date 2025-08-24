import React from 'react';
import styles from './GameHeader.module.css';

function GameHeader({ gameInfo }) {
  return (
    <div className={styles.header}>
      <div className={styles['game-info']}>
        <div className={styles['week-info']}>Week {gameInfo.seasonWeek} • Regular Season</div>
        <div className={styles['date-time']}>{gameInfo.date}</div>
      </div>
    </div>
  );
}

export default GameHeader;
