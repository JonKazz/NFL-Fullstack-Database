import React from 'react';
import styles from './TeamRoster.module.css';
import SortableTable from './SortableTable';

function TeamRoster({ playerStats }) {
  if (!playerStats || !Array.isArray(playerStats)) {
    return null;
  }

  // Filter players by position
  const quarterbacks = playerStats.filter(player => player.position === 'QB');
  const runningBacks = playerStats.filter(player => ['RB', 'FB'].includes(player.position));
  const receivers = playerStats.filter(player => ['WR', 'TE'].includes(player.position));
  const defensiveLine = playerStats.filter(player => ['DE', 'DT', 'NT'].includes(player.position));
  const linebackers = playerStats.filter(player => player.position === 'LB');
  const defensiveBacks = playerStats.filter(player => ['CB', 'DB', 'FS', 'SS'].includes(player.position));
  const specialTeams = playerStats.filter(player => ['K', 'P', 'LS'].includes(player.position));

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Team Roster</h2>
      <div className={styles['players-section']}>
        
        {/* Quarterbacks */}
        {quarterbacks.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Quarterbacks</h3>
            <SortableTable 
              players={quarterbacks} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'passingCompletions', label: 'Cmp' },
                { key: 'passingAttempts', label: 'Att' },
                { key: 'passingYards', label: 'Yards' },
                { key: 'passingTouchdowns', label: 'TD' },
                { key: 'passingInterceptions', label: 'INT' },
                { key: 'passerRating', label: 'Rating' },
                { key: 'fumblesLost', label: 'Fumbles Lost' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Running Backs */}
        {runningBacks.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Running Backs</h3>
            <SortableTable 
              players={runningBacks} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'rushingYards', label: 'Yards' },
                { key: 'rushingAttempts', label: 'Attempts' },
                { key: 'rushingYardsPerAttempt', label: 'YPA' },
                { key: 'rushingTouchdowns', label: 'TD' },
                { key: 'fumblesLost', label: 'Fumbles Lost' },
                { key: 'receivingReceptions', label: 'REC' },
                { key: 'receivingYards', label: 'Rec YDS' },
                { key: 'receivingTouchdowns', label: 'Rec TD' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Receivers */}
        {receivers.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Receivers</h3>
            <SortableTable 
              players={receivers} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'position', label: 'Pos' },
                { key: 'receivingYards', label: 'Yards' },
                { key: 'receivingTouchdowns', label: 'TD' },
                { key: 'receivingTargets', label: 'Targets' },
                { key: 'receivingReceptions', label: 'REC' },
                { key: 'receivingYardsPerReception', label: 'YPR' },
                { key: 'fumblesLost', label: 'Fumbles Lost' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Defensive Line */}
        {defensiveLine.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Defensive Line</h3>
            <SortableTable 
              players={defensiveLine} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'position', label: 'Pos' },
                { key: 'defensiveTacklesCombined', label: 'Tackles' },
                { key: 'defensiveTacklesLoss', label: 'TFL' },
                { key: 'defensiveSacks', label: 'Sacks' },
                { key: 'defensiveQbHits', label: 'QB Hits' },
                { key: 'defensivePressures', label: 'Pressures' },
                { key: 'defensivePassesDefended', label: 'PD' },
                { key: 'defensiveInterceptions', label: 'INT' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Linebackers */}
        {linebackers.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Linebackers</h3>
            <SortableTable 
              players={linebackers} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'position', label: 'Pos' },
                { key: 'defensiveTacklesCombined', label: 'Tackles' },
                { key: 'defensiveTacklesLoss', label: 'TFL' },
                { key: 'defensiveSacks', label: 'Sacks' },
                { key: 'defensiveQbHits', label: 'QB Hits' },
                { key: 'defensivePressures', label: 'Pressures' },
                { key: 'defensivePassesDefended', label: 'PD' },
                { key: 'defensiveInterceptions', label: 'INT' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Defensive Backs */}
        {defensiveBacks.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Defensive Backs</h3>
            <SortableTable 
              players={defensiveBacks} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'position', label: 'Pos' },
                { key: 'defensiveTacklesCombined', label: 'Tackles' },
                { key: 'defensiveInterceptions', label: 'INT' },
                { key: 'defensivePassesDefended', label: 'PD' },
                { key: 'defensiveSacks', label: 'Sacks' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}

        {/* Special Teams */}
        {specialTeams.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Special Teams</h3>
            <SortableTable 
              players={specialTeams} 
              columns={[
                { key: 'playerId', label: 'Player' },
                { key: 'position', label: 'Position' },
                { key: 'fieldGoalsMade', label: 'FG Made' },
                { key: 'fieldGoalsAttempted', label: 'FG Att' },
                { key: 'extraPointsMade', label: 'XP Made' },
                { key: 'extraPointsAttempted', label: 'XP Att' },
                { key: 'punts', label: 'Punts' },
                { key: 'puntYards', label: 'Punt Yds' },
                { key: 'puntYardsPerPunt', label: 'Punt Avg' },
                { key: 'gamesPlayed', label: 'Games' }
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamRoster;
