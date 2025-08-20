import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeasonSummary.module.css';

function Standings({ teams, year }) {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
              <div className={styles['standings-container']}>

          {/* Conference Labels */}
          <div className={styles['conference-labels']}>
            <div className={styles['conference-label']}>AFC</div>
            <div className={styles['conference-label']}>NFC</div>
          </div>

        {/* East Division Group */}
        <div className={styles['division-group']}>
          {/* AFC East */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'AFC East')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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

          {/* Division Label */}
          <div className={styles['division-label']}>
            {'East'.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>

          {/* NFC East */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'NFC East')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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
        </div>

        {/* West Division Group */}
        <div className={styles['division-group']}>
          {/* AFC West */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'AFC West')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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

          {/* Division Label */}
          <div className={styles['division-label']}>
            {'West'.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>

          {/* NFC West */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'NFC West')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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
        </div>

        {/* North Division Group */}
        <div className={styles['division-group']}>
          {/* AFC North */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'AFC North')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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

          {/* Division Label */}
          <div className={styles['division-label']}>
            {'North'.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>

          {/* NFC North */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'NFC North')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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
        </div>

        {/* South Division Group */}
        <div className={styles['division-group']}>
          {/* AFC South */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'AFC South')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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

          {/* Division Label */}
          <div className={styles['division-label']}>
            {'South'.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>

          {/* NFC South */}
          <div className={styles['division']}>
            <div className={styles['standings-table']}>
              {teams
                .filter(team => team.division === 'NFC South')
                .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                .map((team, index) => (
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
        </div>
      </div>
    </div>
  );
}

export default Standings; 