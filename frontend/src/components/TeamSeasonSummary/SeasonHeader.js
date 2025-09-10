import React from 'react';
import styles from './SeasonHeader.module.css';
import { TEAM_MAP } from '../../utils';

/**
 * SeasonHeader component displays the team's season information with logo and team name
 * @param {Object} props - Component props
 * @param {Object} props.teamInfo - Team information object
 * @param {string} props.teamId - Team identifier
 * @param {string} props.year - Season year
 * @returns {JSX.Element} SeasonHeader component
 */
function SeasonHeader({ teamInfo, teamId, year }) {
  const { logo, wins, losses, division, divisionRank, playoffs, coach, offCoordinator, defCoordinator } = teamInfo;
  const teamName = TEAM_MAP[teamId]?.name;

  return (
    <>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          {logo ? (
            <img src={logo} alt={teamName} className={styles.teamLogo} />
          ) : (
            <div className={styles.logoPlaceholder}>{teamName?.slice(0,2)}</div>
          )}
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamName}>
            {year} {teamName}
          </div>
          <div className={styles.teamRecord}>
            {wins}-{losses}
          </div>
          <div className={styles.teamPlayoffs}>
            {playoffs || '-'}
          </div>
        </div>
      </div>

    </>
  );
}

export default SeasonHeader;