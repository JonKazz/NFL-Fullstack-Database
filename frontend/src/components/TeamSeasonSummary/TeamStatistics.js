import React from 'react';
import styles from './TeamStatistics.module.css';
import { calculateTeamRanking } from '../../utils';

function TeamStatistics({ teamInfo, teamStats, teamId }) {
  return (
    <div className={styles.section}>
      <div className={styles['stats-container']}>
        <div className={styles['stats-section']}>
        
        {/* Offensive Statistics */}
        <div className={styles['stats-category']}>
          <h3 className={styles['stats-category-title']}>Offensive Statistics</h3>
          
          {/* Main Stats - Prominent Display */}
          <div className={styles['main-stats-grid']}>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'totalYardsFor', 'desc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'totalYardsFor', 'desc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Total Offense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.totalYardsFor ? `${Math.round(teamInfo.totalYardsFor / 17)} YPG` : 'N/A'}
              </div>
            </div>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'passYardsFor', 'desc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passYardsFor', 'desc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Passing Offense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.passYardsFor ? `${Math.round(teamInfo.passYardsFor / 17)} YPG` : 'N/A'}
              </div>
            </div>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'rushYardsFor', 'desc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushYardsFor', 'desc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Rushing Offense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.rushYardsFor ? `${Math.round(teamInfo.rushYardsFor / 17)} YPG` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Miscellaneous Stats - Table Format */}
          <div className={styles['misc-stats-section']}>
            <table className={styles['misc-stats-table']}>
              <tbody>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'pointsFor', 'desc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'pointsFor', 'desc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Points Per Game</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.pointsFor ? `${Math.round(teamInfo.pointsFor / 17)}` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'passTdFor', 'desc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passTdFor', 'desc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Passing Touchdowns</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.passTdFor || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'rushTdFor', 'desc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushTdFor', 'desc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Rushing Touchdowns</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.rushTdFor || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'turnovers', 'asc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'turnovers', 'asc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Turnovers</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.turnovers || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'penaltiesFor', 'asc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'penaltiesFor', 'asc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Penalties</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.penaltiesFor || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Defensive Statistics */}
        <div className={styles['stats-category']}>
          <h3 className={styles['stats-category-title']}>Defensive Statistics</h3>
          
          {/* Main Stats - Prominent Display */}
          <div className={styles['main-stats-grid']}>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'totalYardsAgainst', 'asc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'totalYardsAgainst', 'asc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Total Defense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.totalYardsAgainst ? `${Math.round(teamInfo.totalYardsAgainst / 17)} YPG` : 'N/A'}
              </div>
            </div>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'passYardsAgainst', 'asc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passYardsAgainst', 'asc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Passing Defense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.passYardsAgainst ? `${Math.round(teamInfo.passYardsAgainst / 17)} YPG` : 'N/A'}
              </div>
            </div>
            <div className={styles['main-stat-item']}>
              <div className={styles['main-stat-header']}>
                <div className={styles['main-stat-rank']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'rushYardsAgainst', 'asc') : null}>
                  {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushYardsAgainst', 'asc')}` : '#N/A'}
                </div>
                <div className={styles['main-stat-name']}>Rushing Defense</div>
              </div>
              <div className={styles['main-stat-value']}>
                {teamInfo?.rushYardsAgainst ? `${Math.round(teamInfo.rushYardsAgainst / 17)} YPG` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Miscellaneous Stats - Table Format */}
          <div className={styles['misc-stats-section']}>
            <table className={styles['misc-stats-table']}>
              <tbody>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'pointsAgainst', 'asc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'pointsAgainst', 'asc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Points Allowed</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.pointsAgainst ? `${Math.round(teamInfo.pointsAgainst / 17)}` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'passTdAgainst', 'asc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passTdAgainst', 'asc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Passing TDs Allowed</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.passTdAgainst || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'rushTdAgainst', 'asc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'rushTdAgainst', 'asc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Rushing TDs Allowed</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.rushTdAgainst || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'passInts', 'desc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'passInts', 'desc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Interceptions</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.passInts || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className={styles['rank-cell']} data-rank={teamStats ? calculateTeamRanking(teamStats, teamId, 'forcedTurnovers', 'desc') : null}>
                    {teamStats ? `#${calculateTeamRanking(teamStats, teamId, 'forcedTurnovers', 'desc')}` : '#N/A'}
                  </td>
                  <td className={styles['stat-name-cell']}>Forced Turnovers</td>
                  <td className={styles['stat-value-cell']}>
                    {teamInfo?.forcedTurnovers || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStatistics;
