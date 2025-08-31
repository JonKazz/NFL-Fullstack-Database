import React, { useState, useEffect, useRef } from 'react';
import styles from './ScoringProgression.module.css';
import { fetchGameDrives } from '../../api/fetches';
import { TEAM_MAP } from '../../utils';

function ScoringProgression({ 
  gameId, 
  homeTeamId, 
  awayTeamId, 
  homeStats, 
  awayStats, 
  homeName, 
  awayName, 
  hasOvertime,
  homeTeamColor,
  awayTeamColor
}) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const chartAreaRef = useRef(null);

  useEffect(() => {
    async function fetchDrives() {
      try {
        setLoading(true);
        const drivesData = await fetchGameDrives(gameId);
        
        // Helper function to convert time string to seconds for sorting
        const timeStringToSecondsForSort = (timeStr) => {
          if (!timeStr || timeStr === '') return 0;
          
          const parts = timeStr.split(':');
          if (parts.length === 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            return minutes * 60 + seconds;
          }
          return 0;
        };
        
        // Sort drives by quarter and timeStart for proper chronological order
        const sortedDrives = drivesData.sort((a, b) => {
          const quarterOrder = { '1': 1, '2': 2, '3': 3, '4': 4, 'OT': 5 };
          const quarterA = quarterOrder[a.quarter] || 999;
          const quarterB = quarterOrder[b.quarter] || 999;
          
          if (quarterA !== quarterB) {
            return quarterA - quarterB;
          }
          
          // If same quarter, sort by timeStart (earlier time first)
          const timeA = a.timeStart || '';
          const timeB = b.timeStart || '';
          
          if (timeA && timeB) {
            // Convert time strings to seconds for comparison
            const timeASeconds = timeStringToSecondsForSort(timeA);
            const timeBSeconds = timeStringToSecondsForSort(timeB);
            return timeBSeconds - timeASeconds; // Higher seconds first (earlier in quarter)
          }
          
          // Fallback to drive number if timeStart is missing
          const driveA = parseInt(a.driveNum) || 0;
          const driveB = parseInt(b.driveNum) || 0;
          return driveA - driveB;
        });
        
        setDrives(sortedDrives);
      } catch (err) {
        console.error('Error fetching drives:', err);
        setError('Failed to load drive information');
      } finally {
        setLoading(false);
      }
    }

    if (gameId) {
      fetchDrives();
    }
  }, [gameId]);

  if (loading) return <div className={styles['scoring-loading']}>Loading scoring progression...</div>;
  if (error) return <div className={styles['scoring-error']}>{error}</div>;
  if (!drives.length) return <div className={styles['no-scoring']}>No drive information available for this game.</div>;

  // Convert time string (e.g., "7:18") to seconds
  const timeStringToSeconds = (timeStr) => {
    if (!timeStr || timeStr === '') return 0;
    
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  // Calculate game progression with cumulative scores and proper timeline
  const calculateGameProgression = () => {
    let homeScore = 0;
    let awayScore = 0;
    let currentTime = 0;
    
    const progression = [];
    
    drives.forEach((drive, index) => {
      // Calculate drive duration in seconds
      const driveTimeSeconds = timeStringToSeconds(drive.timeTotal) || 1;
      
      // Store the start time of this drive
      const driveStartTime = currentTime;
      currentTime += driveTimeSeconds;
      
      // Determine which team scored and how many points
      let scoringTeamId = null;
      let pointsScored = 0;
      
      if (drive.pointsScored > 0) {
        if (drive.opposingTouchdown) {
          // Opposing team scored - points go to the other team
          scoringTeamId = drive.teamId === homeTeamId ? awayTeamId : homeTeamId;
          pointsScored = drive.pointsScored;
        } else {
          // Driving team scored
          scoringTeamId = drive.teamId;
          pointsScored = drive.pointsScored;
        }
        
        // Add points to the appropriate team
        if (scoringTeamId === homeTeamId) {
          homeScore += pointsScored;
        } else {
          awayScore += pointsScored;
        }
      }
      
      progression.push({
        drive,
        homeScore,
        awayScore,
        timeStart: driveStartTime,
        timeEnd: currentTime,
        teamWithBall: drive.teamId,
        scoringTeam: scoringTeamId,
        pointsScored,
        isScoring: pointsScored > 0
      });
    });
    
    return progression;
  };

  const gameData = calculateGameProgression();
  const maxTimeSeconds = gameData.length > 0 ? gameData[gameData.length - 1].timeEnd : 0;
  
  // Calculate final scores for logo positioning
  const finalHomeScore = gameData.length > 0 ? gameData[gameData.length - 1].homeScore : 0;
  const finalAwayScore = gameData.length > 0 ? gameData[gameData.length - 1].awayScore : 0;
  
  // Ensure minimum chart height and add padding for logos and labels
  const chartHeight = 400; // Fixed height for consistent Y-axis
  const chartPadding = 0; // Reduced padding for logos, labels, and quarter lines
  const fixedMaxScore = Math.max(finalHomeScore, finalAwayScore) + 3; // Dynamic max based on winning team's score

  // Helper function to get icon path based on endEvent
  const getIconPath = (event) => {
    switch (event) {
      case 'Touchdown': return '/icons/td.png';
      case 'Field Goal': return '/icons/fg.png';
      case 'Missed FG': return '/icons/fg_miss.png';
      case 'Fumble': return '/icons/fmb.png';
      case 'Interception': return '/icons/int.png';
      case 'Punt': return '/icons/punt.png';
      default: return '/icons/td.png';
    }
  };

  // Helper function to get CSS class based on endEvent
  const getCssClass = (event) => {
    switch (event) {
      case 'Touchdown': return 'touchdown-indicator';
      case 'Field Goal': return 'field-goal-indicator';
      case 'Missed FG': return 'missed-field-goal-indicator';
      case 'Fumble': return 'fumble-indicator';
      case 'Interception': return 'interception-indicator';
      case 'Punt': return 'punt-indicator';
      default: return 'touchdown-indicator';
    }
  };

  // Function to calculate staggered positions for key play indicators
  const calculateKeyPlayPosition = (driveIndex, teamId) => {
    const baseExtension = 100;
    const staggerExtension = 35;
    const minSecondsForStagger = 120;
    const maxExtension = 300;
    
    // Determine if this team is winning
    const isWinningTeam = (teamId === homeTeamId && finalHomeScore > finalAwayScore) || 
                          (teamId === awayTeamId && finalAwayScore > finalHomeScore);
    
    // Find previous key plays from the same team AND opposing team turnovers that led to touchdowns
    const previousKeyPlays = gameData
      .slice(0, driveIndex)
      .filter((d, i) => {
        const drive = drives[i];
        if (!drive) return false;
        
        // Check if this was a key play (touchdown, field goal, fumble, or interception) for the same team
        const isSameTeamKeyPlay = (drive.endEvent === 'Touchdown' || drive.endEvent === 'Field Goal' || 
                                  drive.endEvent === 'Fumble' || drive.endEvent === 'Interception') && 
          d.teamWithBall === teamId;
        
        // Check if this was an opposing team turnover that led to a touchdown
        const isOpposingTeamTurnoverWithTouchdown = (drive.endEvent === 'Fumble' || drive.endEvent === 'Interception') && 
          d.teamWithBall !== teamId && drive.opposingTouchdown;
        
        return isSameTeamKeyPlay || isOpposingTeamTurnoverWithTouchdown;
      });
    
    // First key play for this team - use base extension
    if (previousKeyPlays.length === 0) {
      return {
        x: gameData[driveIndex].timeEnd * 0.5,
        circleY: isWinningTeam ? -baseExtension : chartHeight + baseExtension,
        opposingCircleY: null
      };
    }
    
    // Check if we need to stagger this scoring play
    const lastKeyPlay = previousKeyPlays[previousKeyPlays.length - 1];
    const timeDifference = Math.abs(gameData[driveIndex].timeEnd - lastKeyPlay.timeEnd);
    
    if (timeDifference < minSecondsForStagger) { 
      // Stagger this scoring play by extending the line further, but cap at maxExtension
      const staggerCount = Math.min(previousKeyPlays.length, 2); // Limit to max 2 staggers
      const totalExtension = Math.min(baseExtension + (staggerCount * staggerExtension), maxExtension);
      
      return {
        x: gameData[driveIndex].timeEnd * 0.5,
        circleY: isWinningTeam ? -totalExtension : chartHeight + totalExtension,
        opposingCircleY: null
      };
    }
    
    // No staggering needed - use base extension
    return {
      x: gameData[driveIndex].timeEnd * 0.5,
      circleY: isWinningTeam ? -baseExtension : chartHeight + baseExtension,
      opposingCircleY: null
    };
  };

  // Function to render key play indicators
  const renderKeyPlayIndicator = (driveIndex, teamId, endEvent, currentY, position) => {
    const iconPath = getIconPath(endEvent);
    const cssClass = getCssClass(endEvent);
    const teamColor = teamId === homeTeamId ? homeTeamColor : awayTeamColor;
    
    // For turnovers, calculate opposing team position
    let opposingPosition = null;
    if ((endEvent === 'Fumble' || endEvent === 'Interception') && drives[driveIndex]?.opposingTouchdown) {
      const opposingTeamId = teamId === homeTeamId ? awayTeamId : homeTeamId;
      const isOpposingTeamWinning = (opposingTeamId === homeTeamId && finalHomeScore > finalAwayScore) || 
                                   (opposingTeamId === awayTeamId && finalAwayScore > finalHomeScore);
      opposingPosition = {
        x: position.x,
        circleY: isOpposingTeamWinning ? -100 : chartHeight + 100
      };
    }
    
    return (
      <g 
        key={`key-play-${driveIndex}`} 
        className={styles[`${cssClass}-group`]}
        onMouseEnter={(e) => handleMouseEnter(gameData[driveIndex], e)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main line and circle for the team that performed the action */}
        <line
          x1={position.x}
          y1={currentY}
          x2={position.x}
          y2={position.circleY}
          stroke={teamColor}
          strokeWidth="2"
          className={styles[cssClass]}
        />
        <circle
          cx={position.x}
          cy={position.circleY}
          r="35"
          fill="white"
          stroke={teamColor}
          strokeWidth="10"
          className={styles[cssClass]}
        />
        <image
          href={iconPath}
          x={position.x - 20}
          y={position.circleY - 20}
          width="40"
          height="40"
          className={styles['key-play-icon']}
        />
        
        {/* Additional line and circle for opposing team if this is a turnover that led to a touchdown */}
        {opposingPosition && (
          <>
            <line
              x1={position.x}
              y1={currentY}
              x2={position.x}
              y2={opposingPosition.circleY}
              stroke={teamId === homeTeamId ? awayTeamColor : homeTeamColor}
              strokeWidth="2"
              className={styles[cssClass]}
            />
            <circle
              cx={position.x}
              cy={opposingPosition.circleY}
              r="35"
              fill="white"
              stroke={teamId === homeTeamId ? awayTeamColor : homeTeamColor}
              strokeWidth="10"
              className={styles[cssClass]}
            />
            <image
              href="/icons/td.png"
              x={position.x - 20}
              y={opposingPosition.circleY - 20}
              width="40"
              height="40"
              className={styles['key-play-icon']}
            />
          </>
        )}
      </g>
    );
  };

  // Handle mouse events for popup
  const handleMouseEnter = (driveData, event) => {
    try {
      if (!chartAreaRef.current) {
        console.warn('Chart area ref not available');
        return;
      }
      
      // Position popup in top left of chart area
      const x = 20;
      const y = 20;
      
      setPopupData(driveData);
      setPopupPosition({ x, y });
      
    } catch (error) {
      console.error('Error handling mouse enter:', error);
    }
  };

  const handleMouseLeave = () => {
    setPopupData(null);
  };

  return (
    <div className={styles['scoring-progression']}>
      {/* Quarter Scores Table */}
      <div className={styles['quarter-scores']}>
        <table className={styles['quarter-table']}>
          <thead>
            <tr>
              <th>Team</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
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

      <div className={styles['scoring-chart']}>
        <div className={styles['chart-container']}>
          {/* Chart area */}
          <div className={styles['chart-area']} ref={chartAreaRef}>
            {/* Drive info popup */}
            {popupData && (
              <div 
                className={styles['drive-popup']}
                style={{
                  left: popupPosition.x,
                  top: popupPosition.y,
                  borderColor: popupData.drive.teamId === homeTeamId ? homeTeamColor : awayTeamColor
                }}
              >
                <h4>Q{popupData.drive.quarter} - {TEAM_MAP[popupData.drive.teamId]?.name || popupData.drive.teamId}</h4>
                <div className={styles['drive-popup-main-event']}>
                  {popupData.drive.endEvent}
                  {popupData.pointsScored > 0 && (
                    <span className={styles['drive-popup-points-inline']}>
                      {' '}- {popupData.pointsScored} points
                    </span>
                  )}
                </div>
                <div className={styles['drive-popup-summary']}>
                  {popupData.drive.plays} plays for {popupData.drive.netYds} yards
                </div>
                <div className={styles['drive-popup-details']}>
                  <div className={styles['drive-popup-row']}>
                    <span className={styles['drive-popup-label']}>Time Total:</span>
                    <span className={styles['drive-popup-value']}>{popupData.drive.timeTotal}</span>
                  </div>
                  <div className={styles['drive-popup-row']}>
                    <span className={styles['drive-popup-label']}>Started At:</span>
                    <span className={styles['drive-popup-value']}>{popupData.drive.startAt}</span>
                  </div>
                  {popupData.drive.opposingTouchdown && popupData.pointsScored > 0 && (
                    <div className={styles['drive-popup-row']}>
                      <span className={styles['drive-popup-label']}>Scoring Team:</span>
                      <span className={styles['drive-popup-team']}>{TEAM_MAP[popupData.scoringTeam]?.name || popupData.scoringTeam} (Opposing TD)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Scoring lines */}
            <svg className={styles['scoring-svg']} viewBox={`0 0 ${maxTimeSeconds * 0.5 + 100} ${chartHeight}`}>
              {/* Quarter boundary lines */}
              {(() => {
                const quarterLines = [];
                const quarterIntervals = [0, 900, 1800, 2700, 3600]; // 0, 15, 30, 45, 60 minutes
                const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4', 'OT'];
                
                quarterIntervals.forEach((seconds, index) => {
                  if (seconds <= maxTimeSeconds) {
                    quarterLines.push(
                      <g key={`quarter-line-${index}`}>
                        {/* Quarter boundary line */}
                        <line
                          x1={seconds * 0.5}
                          y1="0"
                          x2={seconds * 0.5}
                          y2={chartHeight + 40}
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.8"
                        />
                      </g>
                    );
                  }
                });
                
                // Add quarter labels between the lines
                for (let i = 0; i < quarterIntervals.length - 1; i++) {
                  if (quarterIntervals[i] <= maxTimeSeconds && quarterIntervals[i + 1] <= maxTimeSeconds) {
                    const midPoint = (quarterIntervals[i] + quarterIntervals[i + 1]) / 2;
                    quarterLines.push(
                                              <text
                          key={`quarter-label-${i}`}
                          x={midPoint * 0.5}
                          y={chartHeight / 2 + 40}
                          textAnchor="middle"
                          fill="#3a3a3a"
                          fontSize="120"
                          fontWeight="bold"
                          opacity="0.9"
                        >
                          {quarterLabels[i]}
                        </text>
                    );
                  }
                }
                
                return quarterLines;
              })()}
              
              {/* Render both team lines - team without possession first, then team with possession */}
              
              {/* First pass: Render all lines for the team without possession (underneath) */}
              {gameData.map((d, i) => {
                const prevData = i === 0 ? { timeEnd: 0, homeScore: 0, awayScore: 0 } : gameData[i - 1];
                const isHomePossession = d.teamWithBall === homeTeamId;
                
                // Only render the line for the team that doesn't have possession
                if (isHomePossession) {
                  // Home has possession, render away team line (dotted, underneath)
                  let awayPrevY = chartHeight - (prevData.awayScore / fixedMaxScore) * chartHeight;
                  let awayCurrentY = chartHeight - (d.awayScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`away-line-under-${i}`}>
                      {/* Away team line - dotted, underneath with white outline */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="6"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line-outline']}
                      />
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke={awayTeamColor}
                        strokeWidth="4"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line']}
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer', filter: 'brightness(1.5)' }}
                      />
                      
                      {/* Vertical line if score increased with white outline */}
                      {d.awayScore > prevData.awayScore && (
                        <>
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={awayPrevY}
                            x2={d.timeEnd * 0.5}
                            y2={awayCurrentY}
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="10"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line-outline']}
                          />
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={awayPrevY}
                            x2={d.timeEnd * 0.5}
                            y2={awayCurrentY}
                            stroke={awayTeamColor}
                            strokeWidth="8"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line']}
                          />
                        </>
                      )}
                      
                      {/* Interactive area for popup - add to all drives */}
                      <rect
                        x={prevData.timeEnd * 0.5}
                        y={Math.min(awayPrevY, awayCurrentY) - 10}
                        width={d.timeEnd * 0.5 - prevData.timeEnd * 0.5}
                        height={Math.abs(awayCurrentY - awayPrevY) + 20}
                        fill="transparent"
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  );
                } else {
                  // Away has possession, render home team line (dotted, underneath)
                  let homePrevY = chartHeight - (prevData.homeScore / fixedMaxScore) * chartHeight;
                  let homeCurrentY = chartHeight - (d.homeScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`home-line-under-${i}`}>
                      {/* Home team line - dotted, underneath with white outline */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="6"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line-outline']}
                      />
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke={homeTeamColor}
                        strokeWidth="4"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line']}
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer', filter: 'brightness(1.5)' }}
                      />
                      
                      {/* Vertical line if score increased with white outline */}
                      {d.homeScore > prevData.homeScore && (
                        <>
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={homePrevY}
                            x2={d.timeEnd * 0.5}
                            y2={homeCurrentY}
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="10"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line-outline']}
                          />
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={homePrevY}
                            x2={d.timeEnd * 0.5}
                            y2={homeCurrentY}
                            stroke={homeTeamColor}
                            strokeWidth="8"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line']}
                          />
                        </>
                      )}
                      
                      {/* Interactive area for popup - add to all drives */}
                      <rect
                        x={prevData.timeEnd * 0.5}
                        y={Math.min(homePrevY, homeCurrentY) - 10}
                        width={d.timeEnd * 0.5 - prevData.timeEnd * 0.5}
                        height={Math.abs(homeCurrentY - homePrevY) + 20}
                        fill="transparent"
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  );
                }
              })}
              
              {/* Second pass: Render all lines for the team with possession (on top) */}
              {gameData.map((d, i) => {
                const prevData = i === 0 ? { timeEnd: 0, homeScore: 0, awayScore: 0 } : gameData[i - 1];
                const isHomePossession = d.teamWithBall === homeTeamId;
                
                // Only render the line for the team that has possession
                if (isHomePossession) {
                  // Home has possession, render home team line (solid, on top)
                  let homePrevY = chartHeight - (prevData.homeScore / fixedMaxScore) * chartHeight;
                  let homeCurrentY = chartHeight - (d.homeScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`home-line-over-${i}`} className={styles['scoring-line-group']} data-drive-index={i}>
                      {/* Home team line - solid, on top with white outline */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="10"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line-outline']}
                      />
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke={homeTeamColor}
                        strokeWidth="8"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line']}
                      />
                      
                      {/* Vertical line if home team scored with white outline */}
                      {d.homeScore > prevData.homeScore && (
                        <>
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={homePrevY}
                            x2={d.timeEnd * 0.5}
                            y2={homeCurrentY}
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="10"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line-outline']}
                          />
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={homePrevY}
                            x2={d.timeEnd * 0.5}
                            y2={homeCurrentY}
                            stroke={homeTeamColor}
                            strokeWidth="8"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line']}
                          />
                        </>
                      )}
                      
                      {/* Touchdown indicator line - thin vertical line going upward 100px past max height */}
                      {drives[i]?.endEvent === 'Touchdown' && 
                        renderKeyPlayIndicator(i, homeTeamId, 'Touchdown', homeCurrentY, calculateKeyPlayPosition(i, homeTeamId))
                      }

                      {/* Field Goal indicator line - thin vertical line going upward 100px */}
                      {drives[i]?.endEvent === 'Field Goal' && 
                        renderKeyPlayIndicator(i, homeTeamId, 'Field Goal', homeCurrentY, calculateKeyPlayPosition(i, homeTeamId))
                      }

                      {/* Missed Field Goal indicator line - thin vertical line going upward 100px */}
                      {drives[i]?.endEvent === 'Missed FG' && 
                        renderKeyPlayIndicator(i, homeTeamId, 'Missed FG', homeCurrentY, calculateKeyPlayPosition(i, homeTeamId))
                      }

                      {/* Fumble indicator line - thin vertical line going in opposite direction */}
                      {drives[i]?.endEvent === 'Fumble' && 
                        renderKeyPlayIndicator(i, homeTeamId, 'Fumble', homeCurrentY, calculateKeyPlayPosition(i, homeTeamId))
                      }

                      {/* Interception indicator line - thin vertical line going in opposite direction */}
                      {drives[i]?.endEvent === 'Interception' && 
                        renderKeyPlayIndicator(i, homeTeamId, 'Interception', homeCurrentY, calculateKeyPlayPosition(i, homeTeamId))
                      }
                      
                      {/* Interactive area for popup */}
                      <rect
                        x={prevData.timeEnd * 0.5}
                        y={Math.min(homePrevY, homeCurrentY) - 10}
                        width={d.timeEnd * 0.5 - prevData.timeEnd * 0.5}
                        height={Math.abs(homeCurrentY - homePrevY) + 20}
                        fill="transparent"
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  );
                } else {
                  // Away has possession, render away team line (solid, on top)
                  let awayPrevY = chartHeight - (prevData.awayScore / fixedMaxScore) * chartHeight;
                  let awayCurrentY = chartHeight - (d.awayScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`away-line-over-${i}`} className={styles['scoring-line-group']} data-drive-index={i}>
                      {/* Away team line - solid, on top with white outline */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="10"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line-outline']}
                      />
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke={awayTeamColor}
                        strokeWidth="8"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line']}
                      />
                      
                      {/* Vertical line if away team scored with white outline */}
                      {d.awayScore > prevData.awayScore && (
                        <>
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={awayPrevY}
                            x2={d.timeEnd * 0.5}
                            y2={awayCurrentY}
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="10"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line-outline']}
                          />
                          <line
                            x1={d.timeEnd * 0.5}
                            y1={awayPrevY}
                            x2={d.timeEnd * 0.5}
                            y2={awayCurrentY}
                            stroke={awayTeamColor}
                            strokeWidth="8"
                            strokeDasharray="none"
                            opacity="1"
                            className={styles['scoring-line']}
                          />
                        </>
                      )}
                      
                      {/* Touchdown indicator line - thin vertical line going upward 150px past max height */}
                      {drives[i]?.endEvent === 'Touchdown' && 
                        renderKeyPlayIndicator(i, awayTeamId, 'Touchdown', awayCurrentY, calculateKeyPlayPosition(i, awayTeamId))
                      }

                      {/* Field Goal indicator line - thin vertical line going upward 100px */}
                      {drives[i]?.endEvent === 'Field Goal' && 
                        renderKeyPlayIndicator(i, awayTeamId, 'Field Goal', awayCurrentY, calculateKeyPlayPosition(i, awayTeamId))
                      }

                      {/* Missed Field Goal indicator line - thin vertical line going upward 100px */}
                      {drives[i]?.endEvent === 'Missed FG' && 
                        renderKeyPlayIndicator(i, awayTeamId, 'Missed FG', awayCurrentY, calculateKeyPlayPosition(i, awayTeamId))
                      }

                      {/* Fumble indicator line - thin vertical line going in opposite direction */}
                      {drives[i]?.endEvent === 'Fumble' && 
                        renderKeyPlayIndicator(i, awayTeamId, 'Fumble', awayCurrentY, calculateKeyPlayPosition(i, awayTeamId))
                      }

                      {/* Interception indicator line - thin vertical line going in opposite direction */}
                      {drives[i]?.endEvent === 'Interception' && 
                        renderKeyPlayIndicator(i, awayTeamId, 'Interception', awayCurrentY, calculateKeyPlayPosition(i, awayTeamId))
                      }
                      
                      {/* Interactive area for popup */}
                      <rect
                        x={prevData.timeEnd * 0.5}
                        y={Math.min(awayPrevY, awayCurrentY) - 10}
                        width={d.timeEnd * 0.5 - prevData.timeEnd * 0.5}
                        height={Math.abs(awayCurrentY - awayPrevY) + 20}
                        fill="transparent"
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  );
                }
              })}
              
              {/* Team logos and scores at the end */}
              {(() => {
                if (gameData.length === 0) return null;
                
                const finalHomeY = chartHeight - (finalHomeScore / fixedMaxScore) * chartHeight;
                const finalAwayY = chartHeight - (finalAwayScore / fixedMaxScore) * chartHeight;
                const logoX = maxTimeSeconds * 0.5 + 20;
                const logoRadius = 25;
                const scoreX = logoX + 35; // Position score text to the right of logo
                
                return (
                  <>
                    {/* Home team logo */}
                    <circle
                      cx={logoX}
                      cy={finalHomeY}
                      r={logoRadius}
                      fill={homeTeamColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={logoX}
                      y={finalHomeY + 6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {homeTeamId.slice(0, 2)}
                    </text>
                    
                    {/* Home team score */}
                    <text
                      x={scoreX}
                      y={finalHomeY + 6}
                      textAnchor="start"
                      fill={homeTeamColor}
                      fontSize="36"
                      fontWeight="bold"
                    >
                      {finalHomeScore}
                    </text>
                    
                    {/* Away team logo */}
                    <circle
                      cx={logoX}
                      cy={finalAwayY}
                      r={logoRadius}
                      fill={awayTeamColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={logoX}
                      y={finalAwayY + 6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {awayTeamId.slice(0, 2)}
                    </text>
                    
                    {/* Away team score */}
                    <text
                      x={scoreX}
                      y={finalAwayY + 6}
                      textAnchor="start"
                      fill={awayTeamColor}
                      fontSize="36"
                      fontWeight="bold"
                    >
                      {finalAwayScore}
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
        
        {/* Legend */}
        <div className={styles['chart-legend']}>
          <div className={styles['legend-item']}>
            <div 
              className={styles['legend-color']} 
              style={{ backgroundColor: homeTeamColor }}
            />
            <span>{homeTeamId}</span>
          </div>
          <div className={styles['legend-item']}>
            <div 
              className={styles['legend-color']} 
              style={{ backgroundColor: awayTeamColor }}
            />
            <span>{awayTeamId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoringProgression;
