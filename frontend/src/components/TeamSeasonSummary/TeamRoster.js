import React from 'react';
import styles from './TeamRoster.module.css';
import SortableTable from './SortableTable';
import { getNeonTeamColor } from '../../utils';

function TeamRoster({ playerStats, teamId }) {
  if (!playerStats || !Array.isArray(playerStats)) {
    return null;
  }

  const neonColor = getNeonTeamColor(teamId);

  // Filter players by position
  const quarterbacks = playerStats.filter(player => player.position === 'QB');
  const runningBacks = playerStats.filter(player => ['RB', 'FB'].includes(player.position));
  const receivers = playerStats.filter(player => ['WR', 'TE'].includes(player.position));
  const defensiveLine = playerStats.filter(player => ['DE', 'DT', 'NT'].includes(player.position));
  const linebackers = playerStats.filter(player => player.position === 'LB');
  const defensiveBacks = playerStats.filter(player => ['CB', 'DB', 'FS', 'SS'].includes(player.position));
  const specialTeams = playerStats.filter(player => ['K', 'P', 'LS'].includes(player.position));

  return (
    <div 
      className={styles.section}
      style={{ '--team-neon-color': neonColor }}
    >
      <h2 className={styles['section-title']}>Team Roster</h2>
      <div className={styles['players-section']}>
        
        {/* Quarterbacks */}
        {quarterbacks.length > 0 && (
          <div className={styles['position-group']}>
            <h3 className={styles['position-title']}>Quarterbacks</h3>
            <SortableTable 
              players={quarterbacks} 
              columns={[
                { key: 'playerName', label: 'Player' },
                { key: 'passingCompletions', label: 'Cmp', fullName: 'Completions' },
                { key: 'passingAttempts', label: 'Att', fullName: 'Attempts' },
                { key: 'passingYards', label: 'YDS', fullName: 'Yards' },
                { key: 'passingTouchdowns', label: 'TD', fullName: 'Touchdowns' },
                { key: 'passingInterceptions', label: 'INT', fullName: 'Interceptions' },
                { key: 'passerRating', label: 'Rating' },
                { key: 'fumblesLost', label: 'FL', fullName: 'Fumbles Lost' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'rushingYards', label: 'YDS', fullName: 'Yards' },
                { key: 'rushingAttempts', label: 'Att', fullName: 'Attempts' },
                { key: 'rushingYardsPerAttempt', label: 'YPA', fullName: 'Yards Per Attempt' },
                { key: 'rushingTouchdowns', label: 'TD', fullName: 'Touchdowns' },
                { key: 'fumblesLost', label: 'FL', fullName: 'Fumbles Lost' },
                { key: 'receivingReceptions', label: 'REC', fullName: 'Receptions' },
                { key: 'receivingYards', label: 'Rec YDS', fullName: 'Receiving Yards' },
                { key: 'receivingTouchdowns', label: 'Rec TD', fullName: 'Receiving Touchdowns' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'position', label: 'Pos', fullName: 'Position' },
                { key: 'receivingYards', label: 'YDS', fullName: 'Yards' },
                { key: 'receivingTouchdowns', label: 'TD', fullName: 'Touchdowns' },
                { key: 'receivingTargets', label: 'TGT', fullName: 'Targets' },
                { key: 'receivingReceptions', label: 'REC', fullName: 'Receptions' },
                { key: 'receivingYardsPerReception', label: 'YPR', fullName: 'Yards Per Reception' },
                { key: 'fumblesLost', label: 'FL', fullName: 'Fumbles Lost' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'position', label: 'Pos', fullName: 'Position' },
                { key: 'defensiveTacklesCombined', label: 'TKL', fullName: 'Tackles' },
                { key: 'defensiveTacklesLoss', label: 'TFL', fullName: 'Tackles For Loss' },
                { key: 'defensiveSacks', label: 'SACK', fullName: 'Sacks' },
                { key: 'defensiveQbHits', label: 'QBH', fullName: 'Quarterback Hits' },
                { key: 'defensivePressures', label: 'PRES', fullName: 'Pressures' },
                { key: 'defensivePassesDefended', label: 'PD', fullName: 'Passes Defended' },
                { key: 'defensiveInterceptions', label: 'INT', fullName: 'Interceptions' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'position', label: 'Pos', fullName: 'Position' },
                { key: 'defensiveTacklesCombined', label: 'TKL', fullName: 'Tackles' },
                { key: 'defensiveTacklesLoss', label: 'TFL', fullName: 'Tackles For Loss' },
                { key: 'defensiveSacks', label: 'SACK', fullName: 'Sacks' },
                { key: 'defensiveQbHits', label: 'QBH', fullName: 'Quarterback Hits' },
                { key: 'defensivePressures', label: 'PRES', fullName: 'Pressures' },
                { key: 'defensivePassesDefended', label: 'PD', fullName: 'Passes Defended' },
                { key: 'defensiveInterceptions', label: 'INT', fullName: 'Interceptions' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'position', label: 'Pos', fullName: 'Position' },
                { key: 'defensiveTacklesCombined', label: 'TKL', fullName: 'Tackles' },
                { key: 'defensiveInterceptions', label: 'INT', fullName: 'Interceptions' },
                { key: 'defensivePassesDefended', label: 'PD', fullName: 'Passes Defended' },
                { key: 'defensiveSacks', label: 'SACK', fullName: 'Sacks' },
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
                { key: 'playerName', label: 'Player' },
                { key: 'position', label: 'Pos', fullName: 'Position' },
                { key: 'fieldGoalsMade', label: 'FGM', fullName: 'Field Goals Made' },
                { key: 'fieldGoalsAttempted', label: 'FGA', fullName: 'Field Goals Attempted' },
                { key: 'extraPointsMade', label: 'XPM', fullName: 'Extra Points Made' },
                { key: 'extraPointsAttempted', label: 'XPA', fullName: 'Extra Points Attempted' },
                { key: 'punts', label: 'Punts' },
                { key: 'puntYards', label: 'Punt YDS', fullName: 'Punt Yards' },
                { key: 'puntYardsPerPunt', label: 'Punt Avg', fullName: 'Punt Average' },
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
