import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Standings.module.css';

function Standings({ teams, year }) {
  const navigate = useNavigate();

  // Helper function to render a single division
  const renderDivision = (divisionName, conference) => {
    const fullDivisionName = `${conference} ${divisionName}`;
    const divisionTeams = teams
      .filter(team => team.division === fullDivisionName)
      .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins);

    return (
      <div className={styles['division']}>
        <div className={styles['standings-table']}>
          {divisionTeams.map((team, index) => (
            <div 
              key={team.teamId} 
              className={styles['standings-row']}
              onClick={() => navigate(`/team-season/${year}/${team.teamId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles['team-info']}>
                <span className={styles['rank']}>{index + 1}</span>
                <img 
                  src={team.logo || ''} 
                  alt="" 
                  className={styles['team-logo-small']}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>{team.name || team.teamId}</span>
              </div>
              <div className={styles['team-record']}>
                {team.wins}-{team.losses}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render division label
  const renderDivisionLabel = (divisionName) => (
    <div className={styles['division-label']}>
      {divisionName.split('').map((letter, index) => (
        <span key={index}>{letter}</span>
      ))}
    </div>
  );

  // Helper function to render a complete division group (AFC + NFC)
  const renderDivisionGroup = (divisionName) => (
    <div className={styles['division-group']}>
      {renderDivision(divisionName, 'AFC')}
      {renderDivisionLabel(divisionName)}
      {renderDivision(divisionName, 'NFC')}
    </div>
  );

  return (
    <div className={styles.section}>
      <div className={styles['standings-container']}>
        {/* Conference Labels */}
        <div className={styles['conference-labels']}>
          <div className={styles['conference-label']}>AFC</div>
          <div className={styles['conference-label']}>NFC</div>
        </div>

        {/* All Division Groups */}
        {['East', 'West', 'North', 'South'].map(division => (
          <div key={division}>
            {renderDivisionGroup(division)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Standings; 