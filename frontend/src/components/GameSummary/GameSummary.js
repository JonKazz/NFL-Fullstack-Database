import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './GameSummary.module.css';
import { fetchTeamsBySeason } from '../../api/fetches';
import { getTeamPrimaryColor } from '../../utils';

function GameSummary() {
  const { gameId } = useParams();
  const [gameInfo, setGameInfo] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [gamePlayerStats, setGamePlayerStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        // Fetch data from individual tables
        const [gameInfoResult, gameStatsResult, gamePlayerStatsResult] = await Promise.all([
          fetch(`http://localhost:8080/api/game-info/game?gameId=${gameId}`),
          fetch(`http://localhost:8080/api/gamestats/game-all?gameId=${gameId}`),
          fetch(`http://localhost:8080/api/game-player-stats/players?gameId=${gameId}`)
        ]);

        if (!gameInfoResult.ok || !gameStatsResult.ok || !gamePlayerStatsResult.ok) {
          throw new Error('Failed to fetch game data');
        }

        const gameInfoData = await gameInfoResult.json();
        const gameStatsData = await gameStatsResult.json();
        const gamePlayerStatsData = await gamePlayerStatsResult.json();

        setGameInfo(gameInfoData);
        setGameStats(gameStatsData);
        setGamePlayerStats(gamePlayerStatsData);
        
        // Extract season year from game info to fetch teams
        if (gameInfoData?.seasonYear) {
          const teamsData = await fetchTeamsBySeason(gameInfoData.seasonYear);
          setTeams(teamsData);
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to fetch game info');
      }
    }
    if (gameId) {
      getData();
    }
  }, [gameId]);

  if (error) return <div className={styles['game-summary-container']}>{error}</div>;
  if (!gameInfo || !gameStats.length) return <div className={styles['game-summary-container']}>Loading...</div>;

  const { homeTeamId, awayTeamId } = gameInfo;
  const homeStats = gameStats.find(gs => gs.id.teamId === homeTeamId);
  const awayStats = gameStats.find(gs => gs.id.teamId === awayTeamId);

  if (!homeStats || !awayStats) return <div className={styles['game-summary-container']}>Stats not found for this game.</div>;

  const homeTeam = teams.find(t => t.teamId === homeStats.id.teamId);
  const awayTeam = teams.find(t => t.teamId === awayStats.id.teamId);
  const homeName = homeTeam?.name || homeStats.id.teamId;
  const awayName = awayTeam?.name || awayStats.id.teamId;
  
  const hasOvertime = !!gameInfo.overtime;

  // Process player stats by position
  const processPlayerStats = (players) => {
    const quarterbacks = [];
    const runningBacks = [];
    const receivers = [];
    const defensiveLine = [];
    const linebackers = [];
    const defensiveBacks = [];
    const specialTeams = [];

    players.forEach(player => {
      // Map the backend field names to the expected format
      const mappedPlayer = {
        playerId: player.id?.playerId || player.playerId,
        position: player.position, // Use the position field from the updated entity
        teamId: player.teamId,
        // Passing stats
        passYds: player.passYards || 0,
        passTd: player.passTouchdowns || 0,
        passInt: player.passInterceptions || 0,
        passAtt: player.passAttempts || 0,
        passCmp: player.passCompletions || 0,
        passRating: player.passRating || 0,
        // Rushing stats
        rushYds: player.rushYards || 0,
        rushTd: player.rushTouchdowns || 0,
        rushAtt: player.rushAttempts || 0,
        rushLong: player.rushLong || 0,
        // Receiving stats
        rec: player.receivingReceptions || 0,
        recYds: player.receivingYards || 0,
        recTd: player.receivingTouchdowns || 0,
        targets: player.receivingTargets || 0,
        recLong: player.receivingLong || 0,
        // Defensive stats
        sacks: player.defensiveSacks || 0,
        tacklesTotal: player.defensiveTacklesCombined || 0,
        soloTackles: player.defensiveTacklesSolo || 0,
        defInt: player.defensiveInterceptions || 0,
        passDefended: player.defensivePassesDefended || 0,
        tacklesLoss: player.defensiveTacklesLoss || 0,
        qbHits: player.defensiveQbHits || 0,
        fumblesForced: player.fumblesForced || 0,
        // Kicking stats
        fgm: player.fieldGoalsMade || 0,
        fga: player.fieldGoalsAttempted || 0,
        xpm: player.extraPointsMade || 0,
        xpa: player.extraPointsAttempted || 0,
        // Punting stats
        punt: player.punts || 0,
        puntYds: player.puntYards || 0,
        puntLong: player.puntLong || 0
      };

      const position = mappedPlayer.position;
      if (position === 'QB') {
        quarterbacks.push(mappedPlayer);
      } else if (position === 'RB' || position === 'FB') {
        runningBacks.push(mappedPlayer);
      } else if (position === 'WR' || position === 'TE') {
        receivers.push(mappedPlayer);
      } else if (position === 'DT' || position === 'DE' || position === 'NT') {
        defensiveLine.push(mappedPlayer);
      } else if (position === 'LB' || position === 'OLB' || position === 'ILB' || position === 'MLB') {
        linebackers.push(mappedPlayer);
      } else if (position === 'CB' || position === 'S' || position === 'FS' || position === 'SS') {
        defensiveBacks.push(mappedPlayer);
      } else if (position === 'K' || position === 'P' || position === 'LS') {
        specialTeams.push(mappedPlayer);
      }
    });

    return {
      quarterbacks,
      runningBacks,
      receivers,
      defensiveLine,
      linebackers,
      defensiveBacks,
      specialTeams
    };
  };

  // Process the player stats
  const playerStats = processPlayerStats(gamePlayerStats);

  // Proportional bar calculations
  const statBarData = [
    {
      label: 'Total Yards',
      home: homeStats.totalYards,
      away: awayStats.totalYards,
    },
    {
      label: 'Passing Yards',
      home: homeStats.passingYards,
      away: awayStats.passingYards,
    },
    {
      label: 'Rushing Yards',
      home: homeStats.rushingYards,
      away: awayStats.rushingYards,
    },
    {
      label: 'First Downs',
      home: homeStats.firstDownsTotal,
      away: awayStats.firstDownsTotal,
    },
    {
      label: 'Touchdowns',
      home: (homeStats.passingTouchdowns || 0) + (homeStats.rushingTouchdowns || 0),
      away: (awayStats.passingTouchdowns || 0) + (awayStats.rushingTouchdowns || 0),
    },
  ];

  // Get team names for display
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.teamId === teamId);
    return team?.name || teamId.toUpperCase();
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles['game-info']}>
            <div className={styles['week-info']}>Week {gameInfo.seasonWeek} • Regular Season</div>
            <div className={styles['date-time']}>{gameInfo.date}</div>
          </div>
        </div>

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

        <div className={styles['quarter-scores']}>
          <h3>Quarter Scores</h3>
          <table className={styles['quarter-table']}>
            <thead>
              <tr>
                <th>Team</th>
                <th>1st</th>
                <th>2nd</th>
                <th>3rd</th>
                <th>4th</th>
                {hasOvertime && <th>OT</th>}
                <th>Final</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{homeName}</td>
                <td>{homeStats.pointsQ1 || 0}</td>
                <td>{homeStats.pointsQ2 || 0}</td>
                <td>{homeStats.pointsQ3 || 0}</td>
                <td>{homeStats.pointsQ4 || 0}</td>
                {hasOvertime && <td>{homeStats.pointsOvertime || 0}</td>}
                <td className={styles.winner}>{homeStats.pointsTotal}</td>
              </tr>
              <tr>
                <td>{awayName}</td>
                <td>{awayStats.pointsQ1 || 0}</td>
                <td>{awayStats.pointsQ2 || 0}</td>
                <td>{awayStats.pointsQ3 || 0}</td>
                <td>{awayStats.pointsQ4 || 0}</td>
                {hasOvertime && <td>{awayStats.pointsOvertime || 0}</td>}
                <td>{awayStats.pointsTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles['stats-section']}>
          <div className={styles['section-title']}>Team Statistics</div>
          <div className={styles['visual-comparison']}>
            <h3>Key Stats Comparison</h3>
            <div className={styles['chart-container']}>
              {statBarData.map(({ label, home, away }, idx) => {
                const total = (home || 0) + (away || 0);
                const homePct = total ? (home / total) * 100 : 50;
                const awayPct = total ? (away / total) * 100 : 50;
                return (
                  <div className={styles['stat-comparison']} key={label}>
                    <div className={styles['stat-name']}>{label}</div>
                    <div className={styles['stat-bars']}>
                      <div className={styles['bar-row']}>
                        <div
                          className={styles.bar}
                          style={{ 
                            width: `${homePct}%`,
                            backgroundColor: getTeamPrimaryColor(homeStats.id.teamId)
                          }}
                        >
                          {homeStats.id.teamId}: {home}
                        </div>
                        <div
                          className={styles.bar}
                          style={{ 
                            width: `${awayPct}%`,
                            backgroundColor: getTeamPrimaryColor(awayStats.id.teamId)
                          }}
                        >
                          {awayStats.id.teamId}: {away}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${styles['visual-comparison']} ${styles['third-down-bars']}`}>
            <h3>Third Down Conversion Rate</h3>
            <div className={styles['chart-container']}>
              {(() => {
                const maxAttempts = Math.max(homeStats.thirdDownAttempts || 0, awayStats.thirdDownAttempts || 0);
                const homeBarWidth = maxAttempts > 0 ? ((homeStats.thirdDownAttempts || 0) / maxAttempts * 100) : 0;
                const awayBarWidth = maxAttempts > 0 ? ((awayStats.thirdDownAttempts || 0) / maxAttempts * 100) : 0;
                
                return (
                  <>
                    <div className={styles['stat-comparison']}>
                      <div className={styles['stat-name']}>{homeStats.id.teamId}</div>
                      <div className={styles['stat-bars']}>
                        <div 
                          className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                          data-team-id={homeStats.id.teamId}
                          style={{ 
                            '--team-primary-color': getTeamPrimaryColor(homeStats.id.teamId),
                            width: `${homeBarWidth}%`
                          }}
                        >
                          <div
                            className={styles.bar}
                            style={{ 
                              width: `${(homeStats.thirdDownAttempts || 0) > 0 ? ((homeStats.thirdDownConversions || 0) / (homeStats.thirdDownAttempts || 0) * 100) : 0}%`
                            }}
                            data-team-id={homeStats.id.teamId}
                          >
                            {homeStats.thirdDownConversions || 0}/{homeStats.thirdDownAttempts || 0} ({homeStats.thirdDownAttempts > 0 ? Math.round((homeStats.thirdDownConversions / homeStats.thirdDownAttempts * 100)) : 0}%)
                          </div>
                          {/* Division lines for each segment based on home team's attempts */}
                          {Array.from({ length: (homeStats.thirdDownAttempts || 0) - 1 }, (_, index) => (
                            <div
                              key={index}
                              className={styles['division-line']}
                              style={{
                                left: `${((index + 1) / (homeStats.thirdDownAttempts || 0)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles['stat-comparison']}>
                      <div className={styles['stat-name']}>{awayStats.id.teamId}</div>
                      <div className={styles['stat-bars']}>
                        <div 
                          className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                          data-team-id={awayStats.id.teamId}
                          style={{ 
                            '--team-primary-color': getTeamPrimaryColor(awayStats.id.teamId),
                            width: `${awayBarWidth}%`
                          }}
                        >
                          <div
                            className={styles.bar}
                            style={{ 
                              width: `${(awayStats.thirdDownAttempts || 0) > 0 ? ((awayStats.thirdDownConversions || 0) / (awayStats.thirdDownAttempts || 0) * 100) : 0}%`
                            }}
                            data-team-id={awayStats.id.teamId}
                          >
                            {awayStats.thirdDownConversions || 0}/{awayStats.thirdDownAttempts || 0} ({awayStats.thirdDownAttempts > 0 ? Math.round((awayStats.thirdDownConversions / awayStats.thirdDownAttempts * 100)) : 0}%)
                          </div>
                          {/* Division lines for each segment based on away team's attempts */}
                          {Array.from({ length: (awayStats.thirdDownAttempts || 0) - 1 }, (_, index) => (
                            <div
                              key={index}
                              className={styles['division-line']}
                              style={{
                                left: `${((index + 1) / (awayStats.thirdDownAttempts || 0)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className={`${styles['visual-comparison']} ${styles['fourth-down-bars']}`}>
            <h3>Fourth Down Conversion Rate</h3>
            <div className={styles['chart-container']}>
              {(() => {
                const maxAttempts = Math.max(homeStats.fourthDownAttempts || 0, awayStats.fourthDownAttempts || 0);
                const homeBarWidth = maxAttempts > 0 ? ((homeStats.fourthDownAttempts || 0) / maxAttempts * 100) : 0;
                const awayBarWidth = maxAttempts > 0 ? ((awayStats.fourthDownAttempts || 0) / maxAttempts * 100) : 0;
                
                return (
                  <>
                    <div className={styles['stat-comparison']}>
                      <div className={styles['stat-name']}>{homeStats.id.teamId}</div>
                      <div className={styles['stat-bars']}>
                        <div 
                          className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                          data-team-id={homeStats.id.teamId}
                          style={{ 
                            '--team-primary-color': getTeamPrimaryColor(homeStats.id.teamId),
                            width: `${homeBarWidth}%`
                          }}
                        >
                          <div
                            className={styles.bar}
                            style={{ 
                              width: `${(homeStats.fourthDownAttempts || 0) > 0 ? ((homeStats.fourthDownConversions || 0) / (homeStats.fourthDownAttempts || 0) * 100) : 0}%`
                            }}
                            data-team-id={homeStats.id.teamId}
                          >
                            {homeStats.fourthDownConversions || 0}/{homeStats.fourthDownAttempts || 0} ({homeStats.fourthDownAttempts > 0 ? Math.round((homeStats.fourthDownConversions / homeStats.fourthDownAttempts * 100)) : 0}%)
                          </div>
                          {/* Division lines for each segment based on home team's attempts */}
                          {Array.from({ length: (homeStats.fourthDownAttempts || 0) - 1 }, (_, index) => (
                            <div
                              key={index}
                              className={styles['division-line']}
                              style={{
                                left: `${((index + 1) / (homeStats.fourthDownAttempts || 0)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles['stat-comparison']}>
                      <div className={styles['stat-name']}>{awayStats.id.teamId}</div>
                      <div className={styles['stat-bars']}>
                        <div 
                          className={`${styles['bar-row']} ${styles['team-bar-bg']}`} 
                          data-team-id={awayStats.id.teamId}
                          style={{ 
                            '--team-primary-color': getTeamPrimaryColor(awayStats.id.teamId),
                            width: `${awayBarWidth}%`
                          }}
                        >
                          <div
                            className={styles.bar}
                            style={{ 
                              width: `${(awayStats.fourthDownAttempts || 0) > 0 ? ((awayStats.fourthDownConversions || 0) / (awayStats.fourthDownAttempts || 0) * 100) : 0}%`
                            }}
                            data-team-id={awayStats.id.teamId}
                          >
                            {awayStats.fourthDownConversions || 0}/{awayStats.fourthDownAttempts || 0} ({awayStats.fourthDownAttempts > 0 ? Math.round((awayStats.fourthDownConversions / awayStats.fourthDownAttempts * 100)) : 0}%)
                          </div>
                          {/* Division lines for each segment based on away team's attempts */}
                          {Array.from({ length: (awayStats.fourthDownAttempts || 0) - 1 }, (_, index) => (
                            <div
                              key={index}
                              className={styles['division-line']}
                              style={{
                                left: `${((index + 1) / (awayStats.fourthDownAttempts || 0)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>



          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h3>Offensive Statistics</h3>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{homeStats.id.teamId}</th>
                    <th>{awayStats.id.teamId}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Third Down Efficiency</strong></td>
                    <td>{homeStats.thirdDownConversions || 0}/{homeStats.thirdDownAttempts || 0}</td>
                    <td>{awayStats.thirdDownConversions || 0}/{awayStats.thirdDownAttempts || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Red Zone Efficiency</strong></td>
                    <td>{homeStats.redZoneConversions || 0}/{homeStats.redZoneAttempts || 0}</td>
                    <td>{awayStats.redZoneConversions || 0}/{awayStats.redZoneAttempts || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Time of Possession</strong></td>
                    <td>{homeStats.timeOfPossession || '00:00'}</td>
                    <td>{awayStats.timeOfPossession || '00:00'}</td>
                  </tr>
                  <tr>
                    <td><strong>Passing Touchdowns</strong></td>
                    <td>{homeStats.passingTouchdowns || 0}</td>
                    <td>{awayStats.passingTouchdowns || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing Touchdowns</strong></td>
                    <td>{homeStats.rushingTouchdowns || 0}</td>
                    <td>{awayStats.rushingTouchdowns || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Field Goals</strong></td>
                    <td>{homeStats.fieldGoalsMade || 0}/{homeStats.fieldGoalsAttempted || 0}</td>
                    <td>{awayStats.fieldGoalsMade || 0}/{awayStats.fieldGoalsAttempted || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h3>Defensive Statistics</h3>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{homeStats.id.teamId}</th>
                    <th>{awayStats.id.teamId}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Yards Allowed</strong></td>
                    <td>{awayStats.totalYards || 0}</td>
                    <td>{homeStats.totalYards || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Passing Yards Allowed</strong></td>
                    <td>{awayStats.passingYards || 0}</td>
                    <td>{homeStats.passingYards || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Rushing Yards Allowed</strong></td>
                    <td>{awayStats.rushingYards || 0}</td>
                    <td>{homeStats.rushingYards || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>First Downs Allowed</strong></td>
                    <td>{awayStats.firstDownsTotal || 0}</td>
                    <td>{homeStats.firstDownsTotal || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Third Down Defense</strong></td>
                    <td>{awayStats.thirdDownConversions || 0}/{awayStats.thirdDownAttempts || 0}</td>
                    <td>{homeStats.thirdDownConversions || 0}/{homeStats.thirdDownAttempts || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Red Zone Defense</strong></td>
                    <td>{awayStats.redZoneConversions || 0}/{awayStats.redZoneAttempts || 0}</td>
                    <td>{homeStats.redZoneConversions || 0}/{homeStats.redZoneAttempts || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Sacks</strong></td>
                    <td>{homeStats.sacksTotal || 0}</td>
                    <td>{awayStats.sacksTotal || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Interceptions</strong></td>
                    <td>{homeStats.interceptions || 0}</td>
                    <td>{awayStats.interceptions || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Fumbles Forced</strong></td>
                    <td>{homeStats.fumblesForced || 0}</td>
                    <td>{awayStats.fumblesForced || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Fumbles Recovered</strong></td>
                    <td>{homeStats.fumblesRecovered || 0}</td>
                    <td>{awayStats.fumblesRecovered || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles['player-stats']}>
          <h3>Player Statistics</h3>
          
          {playerStats.quarterbacks.length > 0 && (
            <>
              <h4>Passing</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Cmp/Att</th>
                    <th>Yards</th>
                    <th>TD</th>
                    <th>INT</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.quarterbacks.map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.passCmp}/{player.passAtt}</td>
                      <td>{player.passYds}</td>
                      <td>{player.passTd}</td>
                      <td>{player.passInt}</td>
                      <td>{player.passRating || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {playerStats.runningBacks.length > 0 && (
            <>
              <h4>Rushing</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Att</th>
                    <th>Yards</th>
                    <th>TD</th>
                    <th>Long</th>
                    <th>YPC</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.runningBacks.map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.rushAtt}</td>
                      <td>{player.rushYds}</td>
                      <td>{player.rushTd}</td>
                      <td>{player.rushLong || 'N/A'}</td>
                      <td>{player.rushAtt > 0 ? (player.rushYds / player.rushAtt).toFixed(1) : '0.0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {playerStats.receivers.length > 0 && (
            <>
              <h4>Receiving</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Rec</th>
                    <th>Yards</th>
                    <th>TD</th>
                    <th>Long</th>
                    <th>YPR</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.receivers.map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.rec}</td>
                      <td>{player.recYds}</td>
                      <td>{player.recTd}</td>
                      <td>{player.recLong || 'N/A'}</td>
                      <td>{player.rec > 0 ? (player.recYds / player.rec).toFixed(1) : '0.0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {(playerStats.defensiveLine.length > 0 || playerStats.linebackers.length > 0 || playerStats.defensiveBacks.length > 0) && (
            <>
              <h4>Defense</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Tackles</th>
                    <th>Solo</th>
                    <th>Sacks</th>
                    <th>INT</th>
                    <th>PD</th>
                    <th>TFL</th>
                    <th>QB Hits</th>
                    <th>FF</th>
                  </tr>
                </thead>
                <tbody>
                  {[...playerStats.defensiveLine, ...playerStats.linebackers, ...playerStats.defensiveBacks].map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.tacklesTotal}</td>
                      <td>{player.soloTackles || 0}</td>
                      <td>{player.sacks}</td>
                      <td>{player.defInt}</td>
                      <td>{player.passDefended}</td>
                      <td>{player.tacklesLoss || 0}</td>
                      <td>{player.qbHits || 0}</td>
                      <td>{player.fumblesForced}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {playerStats.specialTeams.filter(player => player.position === 'K').length > 0 && (
            <>
              <h4>Kicking</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>FG Made</th>
                    <th>FG Attempted</th>
                    <th>FG Percentage</th>
                    <th>XP Made</th>
                    <th>XP Attempted</th>
                    <th>XP Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.specialTeams.filter(player => player.position === 'K').map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.fgm}</td>
                      <td>{player.fga}</td>
                      <td>{player.fga > 0 ? ((player.fgm / player.fga) * 100).toFixed(1) : '0.0'}%</td>
                      <td>{player.xpm}</td>
                      <td>{player.xpa}</td>
                      <td>{player.xpa > 0 ? ((player.xpm / player.xpa) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {playerStats.specialTeams.filter(player => player.position === 'P').length > 0 && (
            <>
              <h4>Punting</h4>
              <table className={styles['player-table']}>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Punts</th>
                    <th>Total Yards</th>
                    <th>Average</th>
                    <th>Long</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.specialTeams.filter(player => player.position === 'P').map((player, index) => (
                    <tr key={index}>
                      <td>{player.playerId}</td>
                      <td>{getTeamName(player.teamId)}</td>
                      <td>{player.punt}</td>
                      <td>{player.puntYds}</td>
                      <td>{player.punt > 0 ? (player.puntYds / player.punt).toFixed(1) : '0.0'}</td>
                      <td>{player.puntLong || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {Object.values(playerStats).every(array => array.length === 0) && (
            <p>No player statistics available for this game.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
