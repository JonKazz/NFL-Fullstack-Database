import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamsBySeason, fetchPlayoffGames } from '../../api/fetches';
import styles from './SeasonSummary.module.css';

function SeasonSummary() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [playoffs, setPlayoffs] = useState([]);
  const [awards, setAwards] = useState([]);
  const [statLeaders, setStatLeaders] = useState({});
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
                // Fetch teams from backend
        const teamsData = await fetchTeamsBySeason(year);
        setTeams(teamsData);
        
        // Fetch playoff games from backend
        const playoffGamesData = await fetchPlayoffGames(year);
        setPlayoffs(playoffGamesData);

      setAwards([
        { award: 'MVP', winner: 'Patrick Mahomes', team: 'Kansas City Chiefs' },
        { award: 'Offensive Player of the Year', winner: 'Tyreek Hill', team: 'Miami Dolphins' },
        { award: 'Defensive Player of the Year', winner: 'Myles Garrett', team: 'Cleveland Browns' },
        { award: 'Offensive Rookie of the Year', winner: 'C.J. Stroud', team: 'Houston Texans' },
        { award: 'Defensive Rookie of the Year', winner: 'Will Anderson Jr.', team: 'Houston Texans' },
        { award: 'Coach of the Year', winner: 'Dan Campbell', team: 'Detroit Lions' }
      ]);

      setStatLeaders({
        passing: { leader: 'Patrick Mahomes', team: 'Kansas City Chiefs', yards: 4183, tds: 31 },
        rushing: { leader: 'Christian McCaffrey', team: 'San Francisco 49ers', yards: 1459, tds: 14 },
        receiving: { leader: 'Tyreek Hill', team: 'Miami Dolphins', yards: 1799, tds: 13 },
        sacks: { leader: 'T.J. Watt', team: 'Pittsburgh Steelers', sacks: 19 },
        interceptions: { leader: 'DaRon Bland', team: 'Dallas Cowboys', ints: 9 }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  fetchData();
}, [year]);

  const handleTeamSelect = (teamId) => {
    if (teamId) {
      navigate(`/team-season/${year}/${teamId}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading {year} Season Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            ← Back to Home
          </button>
          <h1>{year} NFL Season</h1>
          <p>League Overview, Standings, and Statistics</p>
        </div>

        {/* Team Selection */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Explore Team Season</h2>
          <div className={styles['team-selection']}>
            <label className={styles.label}>Select a team to view detailed season analysis:</label>
            <div className={styles['team-grid']}>
              {teams.map((team) => (
                <div
                  key={team.teamId}
                  className={`${styles['team-logo-item']} ${selectedTeam === team.teamId ? styles.selected : ''}`}
                  onClick={() => setSelectedTeam(team.teamId)}
                >
                  <div className={styles['team-logo-container']}>
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`}
                      className={styles['team-logo']}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className={styles['team-logo-fallback']}>
                      {team.city ? team.city.slice(0, 2).toUpperCase() : 'TM'}
                    </div>
                  </div>
                  <div className={styles['team-name']}>{team.city || team.name}</div>
                </div>
              ))}
            </div>
            {selectedTeam && (
              <button 
                onClick={() => handleTeamSelect(selectedTeam)}
                className={styles.exploreButton}
              >
                Explore {teams.find(t => t.teamId === selectedTeam)?.name || 'Team'} Season
              </button>
            )}
          </div>
        </div>

        {/* Standings */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Season Standings</h2>
          <div className={styles['standings-container']}>
            {/* AFC Divisions */}
            <div className={styles['conference']}>
              <h3>AFC</h3>
              
              {/* AFC East */}
              <div className={styles['division']}>
                <h4>AFC East</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'AFC East')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* AFC North */}
              <div className={styles['division']}>
                <h4>AFC North</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'AFC North')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* AFC South */}
              <div className={styles['division']}>
                <h4>AFC South</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'AFC South')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* AFC West */}
              <div className={styles['division']}>
                <h4>AFC West</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'AFC West')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

            {/* NFC Divisions */}
            <div className={styles['conference']}>
              <h3>NFC</h3>
              
              {/* NFC East */}
              <div className={styles['division']}>
                <h4>NFC East</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'NFC East')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* NFC North */}
              <div className={styles['division']}>
                <h4>NFC North</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'NFC North')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* NFC South */}
              <div className={styles['division']}>
                <h4>NFC South</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'NFC South')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

              {/* NFC West */}
              <div className={styles['division']}>
                <h4>NFC West</h4>
                <div className={styles['standings-table']}>
                  {teams
                    .filter(team => team.division === 'NFC West')
                    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins)
                    .map((team, index) => (
                    <div key={team.teamId} className={styles['standings-row']}>
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

        {/* Playoffs */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Playoff Results</h2>
          <div className={styles['playoffs-container']}>
            {(() => {
              // Group playoff games by week
              const playoffRounds = {
                19: { name: 'Wild Card', games: [] },
                20: { name: 'Divisional', games: [] },
                21: { name: 'Conference Championship', games: [] },
                22: { name: 'Super Bowl', games: [] }
              };
              
              // Group games by week
              playoffs.forEach(game => {
                if (playoffRounds[game.seasonWeek]) {
                  playoffRounds[game.seasonWeek].games.push(game);
                }
              });
              
              // Filter out empty rounds and render
              const roundsWithGames = Object.entries(playoffRounds)
                .filter(([week, round]) => round.games.length > 0);
              
              if (roundsWithGames.length === 0) {
                return <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                  No playoff games found for this season.
                </p>;
              }
              
              return roundsWithGames.map(([week, round]) => (
                <div key={week} className={styles['playoff-round']}>
                  <h3>{round.name}</h3>
                  <div className={styles['playoff-games']}>
                    {round.games.map((game, gameIndex) => (
                      <div key={gameIndex} className={styles['playoff-game']}>
                        <div className={styles['team']}>
                          <img 
                            src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                            alt="" 
                            className={styles['team-logo-small']}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span>{teams.find(t => t.teamId === game.homeTeamId)?.name || game.homeTeamId}</span>
                          <span className={styles['score']}>{game.homePoints}</span>
                        </div>
                        <div className={styles['team']}>
                          <img 
                            src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                            alt="" 
                            className={styles['team-logo-small']}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span>{teams.find(t => t.teamId === game.awayTeamId)?.name || game.awayTeamId}</span>
                          <span className={styles['score']}>{game.awayPoints}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Awards */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Award Winners</h2>
          <div className={styles['awards-grid']}>
            {awards.map((award, index) => (
              <div key={index} className={styles['award-card']}>
                <h3>{award.award}</h3>
                <div className={styles['award-winner']}>{award.winner}</div>
                <div className={styles['award-team']}>{award.team}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat Leaders */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Stat Leaders</h2>
          <div className={styles['stats-grid']}>
            {Object.entries(statLeaders).map(([category, leader]) => (
              <div key={category} className={styles['stat-card']}>
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className={styles['stat-leader']}>{leader.leader}</div>
                <div className={styles['stat-team']}>{leader.team}</div>
                <div className={styles['stat-value']}>
                  {category === 'passing' && `${leader.yards} yards, ${leader.tds} TDs`}
                  {category === 'rushing' && `${leader.yards} yards, ${leader.tds} TDs`}
                  {category === 'receiving' && `${leader.yards} yards, ${leader.tds} TDs`}
                  {category === 'sacks' && `${leader.sacks} sacks`}
                  {category === 'interceptions' && `${leader.ints} INTs`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonSummary;