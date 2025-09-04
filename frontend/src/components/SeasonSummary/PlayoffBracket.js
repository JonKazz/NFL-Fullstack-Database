import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlayoffBracket.module.css';
import { getTeamPrimaryColor } from '../../utils';

function PlayoffBracket({ playoffs, teams, year, seasonInfo }) {
  const navigate = useNavigate();
  
  // Filter out non-playoff games (playoffGame === 'None')
  const playoffGames = playoffs.filter(game => game.playoffGame && game.playoffGame !== 'None');
  
  // Get Super Bowl games for the champion display
  const superBowlGames = playoffGames.filter(game => game.playoffGame === 'Superbowl');
  
  if (playoffGames.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles['section-title']}>Super Bowl Champion</h2>
        <div className={styles['no-playoffs']}>
          <p>No playoff games found for the {year} season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles['section-title']}>Super Bowl Champion</h2>
      
      <div className={styles['playoff-bracket']}>
        <div className={styles['bracket-container']}>
          {/* Group playoff games by round using the new playoffGame field */}
          {(() => {
            const wildCardGames = playoffGames.filter(game => game.playoffGame === 'Wild Card');
            const divisionalGames = playoffGames.filter(game => game.playoffGame === 'Divisional');
            const conferenceGames = playoffGames.filter(game => game.playoffGame === 'Conference Championship');
            
            // Filter games by conference using team division
            const afcWildCard = wildCardGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('AFC') || awayTeam?.division?.startsWith('AFC');
            });
            
            const nfcWildCard = wildCardGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('NFC') || awayTeam?.division?.startsWith('NFC');
            });
            
            const afcDivisional = divisionalGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('AFC') || awayTeam?.division?.startsWith('AFC');
            });
            
            const nfcDivisional = divisionalGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('NFC') || awayTeam?.division?.startsWith('NFC');
            });
            
            const afcConference = conferenceGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('AFC') || awayTeam?.division?.startsWith('AFC');
            });
            
            const nfcConference = conferenceGames.filter(game => {
              const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
              const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
              return homeTeam?.division?.startsWith('NFC') || awayTeam?.division?.startsWith('NFC');
            });
            
            return (
              <>
                {/* Top Row: AFC and NFC Sides */}
                <div className={styles['bracket-top-row']}>
                  {/* AFC Side - Left */}
                  <div className={styles['conference-side']}>
                    {/* Wild Card Round - Far Left */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {afcWildCard.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <React.Fragment key={game.gameId}>
                              <div className={`${styles['bracket-matchup']} ${styles['afc-game']}`}>
                                <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                  <div className={styles['team-logo']}>
                                    <img 
                                      src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                      alt={game.homeTeamId}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                  </div>
                                  <div className={styles['team-score']}>{game.homePoints || 0}</div>
                                </div>
                                <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                  <div className={styles['team-logo']}>
                                    <img 
                                      src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                      alt={game.awayTeamId}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                  </div>
                                  <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                                </div>
                              </div>
                              {/* Add placeholder gap after first game when there are only 2 games */}
                              {afcWildCard.length === 2 && index === 0 && <div className={styles['bracket-matchup-placeholder']}></div>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divisional Round - Closer to Center */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {afcDivisional.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <div 
                              key={game.gameId} 
                              className={`${styles['bracket-matchup']} ${styles['afc-game']}`}
                              onClick={() => navigate(`/game/${game.gameId}`)}
                            >
                              <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                    alt={game.homeTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                </div>
                                <div className={styles['team-score']}>{game.homePoints || 0}</div>
                              </div>
                              <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                    alt={game.awayTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                </div>
                                <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Conference Championship - Center Left */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {afcConference.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <div 
                              key={game.gameId} 
                              className={`${styles['bracket-matchup']} ${styles['afc-game']}`}
                              onClick={() => navigate(`/game/${game.gameId}`)}
                            >
                              <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                    alt={game.homeTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                </div>
                                <div className={styles['team-score']}>{game.homePoints || 0}</div>
                              </div>
                              <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                    alt={game.awayTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                </div>
                                <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Super Bowl - Center */}
                  <div className={styles['super-bowl-container']}>
                    {/* Champion Display - Above Super Bowl */}
                    {seasonInfo?.sbChamp && (
                      <div 
                        className={styles['champion-display-compact']}
                        style={{ 
                          borderColor: getTeamPrimaryColor(seasonInfo.sbChamp)
                        }}
                      >
                        <h4>{teams.find(t => t.teamId === seasonInfo.sbChamp)?.name || seasonInfo.sbChamp}</h4>
                      </div>
                    )}
                    
                    <div className={styles['super-bowl']}>
                    {superBowlGames.map((game, index) => {
                      // Determine which team is AFC vs NFC
                      const homeTeam = teams.find(t => t.teamId === game.homeTeamId);
                      const awayTeam = teams.find(t => t.teamId === game.awayTeamId);
                      const isHomeTeamAFC = homeTeam?.division?.startsWith('AFC');
                      
                      // Position AFC team on left, NFC team on right
                      const leftTeam = isHomeTeamAFC ? homeTeam : awayTeam;
                      const rightTeam = isHomeTeamAFC ? awayTeam : homeTeam;
                      const leftTeamScore = isHomeTeamAFC ? game.homePoints : game.awayPoints;
                      const rightTeamScore = isHomeTeamAFC ? game.awayPoints : game.homePoints;
                      
                      // Determine which team lost for fading effect
                      const leftTeamWon = (leftTeamScore || 0) > (rightTeamScore || 0);
                      
                      return (
                        <div 
                          key={game.gameId}
                          onClick={() => navigate(`/game/${game.gameId}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className={styles['super-bowl-matchup']}>
                            {/* AFC Team - Left */}
                            <div className={`${styles['team-section']} ${!leftTeamWon ? styles['losing-team'] : ''}`}>
                              <div className={styles['team-logo']}>
                                <img 
                                  src={leftTeam?.logo || ''} 
                                  alt={leftTeam?.teamId || ''}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className={styles['team-logo-fallback']}>{leftTeam?.teamId || ''}</div>
                              </div>
                            </div>
                            
                            {/* Scores in the center for symmetry */}
                            <div className={styles['super-bowl-scores']}>
                              <div className={`${styles['team-score']} ${!leftTeamWon ? styles['losing-score'] : ''}`}>{leftTeamScore || 0}</div>
                              <div className={`${styles['team-score']} ${leftTeamWon ? styles['losing-score'] : ''}`}>{rightTeamScore || 0}</div>
                            </div>
                            
                            {/* NFC Team - Right */}
                            <div className={`${styles['team-section']} ${leftTeamWon ? styles['losing-team'] : ''}`}>
                              <div className={styles['team-logo']}>
                                <img 
                                  src={rightTeam?.logo || ''} 
                                  alt={rightTeam?.teamId || ''}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className={styles['team-logo-fallback']}>{rightTeam?.teamId || ''}</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles['champion']}>
                            <div 
                              className={styles['champion-logo']}
                              style={{ borderColor: getTeamPrimaryColor(game.winningTeamId) }}
                            >
                              <img 
                                src={teams.find(t => t.teamId === game.winningTeamId)?.logo || ''} 
                                alt={game.winningTeamId || 'Champion'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className={styles['team-logo-fallback']}>{game.winningTeamId || 'CH'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>

                  {/* NFC Side - Right */}
                  <div className={styles['conference-side']}>
                    {/* Conference Championship - Center Right */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {nfcConference.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <div 
                              key={game.gameId} 
                              className={`${styles['bracket-matchup']} ${styles['nfc-game']}`}
                              onClick={() => navigate(`/game/${game.gameId}`)}
                            >
                              <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-score']}>{game.homePoints || 0}</div>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                    alt={game.homeTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                </div>
                              </div>
                              <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                    alt={game.awayTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divisional Round - Closer to Center */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {nfcDivisional.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <div 
                              key={game.gameId} 
                              className={`${styles['bracket-matchup']} ${styles['nfc-game']}`}
                              onClick={() => navigate(`/game/${game.gameId}`)}
                            >
                              <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-score']}>{game.homePoints || 0}</div>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                    alt={game.homeTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                </div>
                              </div>
                              <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                                <div className={styles['team-logo']}>
                                  <img 
                                    src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                    alt={game.awayTeamId}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Wild Card Round - Far Right */}
                    <div className={styles['bracket-round']}>
                      <div className={styles['bracket-matchups']}>
                        {nfcWildCard.map((game, index) => {
                          const homeTeamWon = (game.homePoints || 0) > (game.awayPoints || 0);
                          return (
                            <React.Fragment key={game.gameId}>
                              <div 
                                className={`${styles['bracket-matchup']} ${styles['nfc-game']}`}
                                onClick={() => navigate(`/game/${game.gameId}`)}
                              >
                                <div className={`${styles['team-section']} ${!homeTeamWon ? styles['losing-team'] : ''}`}>
                                  <div className={styles['team-score']}>{game.homePoints || 0}</div>
                                  <div className={styles['team-logo']}>
                                    <img 
                                      src={teams.find(t => t.teamId === game.homeTeamId)?.logo || ''} 
                                      alt={game.homeTeamId}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className={styles['team-logo-fallback']}>{game.homeTeamId}</div>
                                  </div>
                                </div>
                                <div className={`${styles['team-section']} ${homeTeamWon ? styles['losing-team'] : ''}`}>
                                  <div className={styles['team-score']}>{game.awayPoints || 0}</div>
                                  <div className={styles['team-logo']}>
                                    <img 
                                      src={teams.find(t => t.teamId === game.awayTeamId)?.logo || ''} 
                                      alt={game.awayTeamId}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className={styles['team-logo-fallback']}>{game.awayTeamId}</div>
                                  </div>
                                </div>
                              </div>
                              {/* Add placeholder gap after first game when there are only 2 games */}
                              {nfcWildCard.length === 2 && index === 0 && <div className={styles['bracket-matchup-placeholder']}></div>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default PlayoffBracket; 