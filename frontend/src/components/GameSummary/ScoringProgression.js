import React, { useState, useEffect, useRef } from 'react';
import styles from './ScoringProgression.module.css';
import { getTeamPrimaryColor } from '../../utils';

function ScoringProgression({ gameId, homeTeamId, awayTeamId }) {
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
        const response = await fetch(`http://localhost:8080/api/game-drives/game?gameId=${gameId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch drive data');
        }
        
        const drivesData = await response.json();
        
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
  const topPadding = 0; // Minimum space above the highest score
  const fixedMaxScore = Math.max(finalHomeScore, finalAwayScore) + 3; // Dynamic max based on winning team's score

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
      <h3>Scoring Progression</h3>
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
                  top: popupPosition.y
                }}
              >
                <h4>Drive {popupData.drive.driveNum} - Q{popupData.drive.quarter}</h4>
                <div className={styles['drive-popup-row']}>
                  <span className={styles['drive-popup-label']}>Team:</span>
                  <span className={styles['drive-popup-team']}>{popupData.drive.teamId}</span>
                </div>
                <div className={styles['drive-popup-row']}>
                  <span className={styles['drive-popup-label']}>Time Start:</span>
                  <span className={styles['drive-popup-value']}>{popupData.drive.timeStart}</span>
                </div>
                <div className={styles['drive-popup-row']}>
                  <span className={styles['drive-popup-label']}>Time Total:</span>
                  <span className={styles['drive-popup-value']}>{popupData.drive.timeTotal}</span>
                </div>
                <div className={styles['drive-popup-row']}>
                  <span className={styles['drive-popup-label']}>Net Yards:</span>
                  <span className={styles['drive-popup-value']}>{popupData.drive.netYds}</span>
                </div>
                <div className={styles['drive-popup-row']}>
                  <span className={styles['drive-popup-label']}>End Event:</span>
                  <span className={styles['drive-popup-value']}>{popupData.drive.endEvent}</span>
                </div>
                {popupData.pointsScored > 0 && (
                  <div className={styles['drive-popup-row']}>
                    <span className={styles['drive-popup-label']}>Points Scored:</span>
                    <span className={styles['drive-popup-value']}>{popupData.pointsScored}</span>
                  </div>
                )}
                {popupData.drive.opposingTouchdown && popupData.pointsScored > 0 && (
                  <div className={styles['drive-popup-row']}>
                    <span className={styles['drive-popup-label']}>Scoring Team:</span>
                    <span className={styles['drive-popup-team']}>{popupData.scoringTeam} (Opposing TD)</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Scoring lines */}
            <svg className={styles['scoring-svg']} viewBox={`0 0 ${maxTimeSeconds * 0.5 + 100} ${chartHeight + chartPadding + topPadding}`}>
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
                  let awayPrevY = topPadding + chartHeight - (prevData.awayScore / fixedMaxScore) * chartHeight;
                  let awayCurrentY = topPadding + chartHeight - (d.awayScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`away-line-under-${i}`}>
                      {/* Away team line - dotted, underneath */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke={getTeamPrimaryColor(awayTeamId)}
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line']}
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer', filter: 'brightness(1.5)' }}
                      />
                      
                      {/* Vertical line if score increased */}
                      {d.awayScore > prevData.awayScore && (
                        <line
                          x1={d.timeEnd * 0.5}
                          y1={awayPrevY}
                          x2={d.timeEnd * 0.5}
                          y2={awayCurrentY}
                          stroke={getTeamPrimaryColor(awayTeamId)}
                          strokeWidth="6"
                          strokeDasharray="none"
                          opacity="1"
                          className={styles['scoring-line']}
                        />
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
                  let homePrevY = topPadding + chartHeight - (prevData.homeScore / fixedMaxScore) * chartHeight;
                  let homeCurrentY = topPadding + chartHeight - (d.homeScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`home-line-under-${i}`}>
                      {/* Home team line - dotted, underneath */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke={getTeamPrimaryColor(homeTeamId)}
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        opacity="1"
                        className={styles['scoring-line']}
                        onMouseEnter={(e) => handleMouseEnter(d, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: 'pointer', filter: 'brightness(1.5)' }}
                      />
                      
                      {/* Vertical line if score increased */}
                      {d.homeScore > prevData.homeScore && (
                        <line
                          x1={d.timeEnd * 0.5}
                          y1={homePrevY}
                          x2={d.timeEnd * 0.5}
                          y2={homeCurrentY}
                          stroke={getTeamPrimaryColor(homeTeamId)}
                          strokeWidth="6"
                          strokeDasharray="none"
                          opacity="1"
                          className={styles['scoring-line']}
                        />
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
                  let homePrevY = topPadding + chartHeight - (prevData.homeScore / fixedMaxScore) * chartHeight;
                  let homeCurrentY = topPadding + chartHeight - (d.homeScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`home-line-over-${i}`} className={styles['scoring-line-group']} data-drive-index={i}>
                      {/* Home team line - solid, on top */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={homePrevY}
                        x2={d.timeEnd * 0.5}
                        y2={homePrevY}
                        stroke={getTeamPrimaryColor(homeTeamId)}
                        strokeWidth="6"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line']}
                      />
                      
                      {/* Vertical line if home team scored */}
                      {d.homeScore > prevData.homeScore && (
                        <line
                          x1={d.timeEnd * 0.5}
                          y1={homePrevY}
                          x2={d.timeEnd * 0.5}
                          y2={homeCurrentY}
                          stroke={getTeamPrimaryColor(homeTeamId)}
                          strokeWidth="6"
                          strokeDasharray="none"
                          opacity="1"
                          className={styles['scoring-line']}
                        />
                      )}
                      
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
                  let awayPrevY = topPadding + chartHeight - (prevData.awayScore / fixedMaxScore) * chartHeight;
                  let awayCurrentY = topPadding + chartHeight - (d.awayScore / fixedMaxScore) * chartHeight;
                  
                  return (
                    <g key={`away-line-over-${i}`} className={styles['scoring-line-group']} data-drive-index={i}>
                      {/* Away team line - solid, on top */}
                      <line
                        x1={prevData.timeEnd * 0.5}
                        y1={awayPrevY}
                        x2={d.timeEnd * 0.5}
                        y2={awayPrevY}
                        stroke={getTeamPrimaryColor(awayTeamId)}
                        strokeWidth="6"
                        strokeDasharray="none"
                        opacity="1"
                        className={styles['scoring-line']}
                      />
                      
                      {/* Vertical line if away team scored */}
                      {d.awayScore > prevData.awayScore && (
                        <line
                          x1={d.timeEnd * 0.5}
                          y1={awayPrevY}
                          x2={d.timeEnd * 0.5}
                          y2={awayCurrentY}
                          stroke={getTeamPrimaryColor(awayTeamId)}
                          strokeWidth="6"
                          strokeDasharray="none"
                          opacity="1"
                          className={styles['scoring-line']}
                        />
                      )}
                      
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
                
                const finalHomeY = topPadding + chartHeight - (finalHomeScore / fixedMaxScore) * chartHeight;
                const finalAwayY = topPadding + chartHeight - (finalAwayScore / fixedMaxScore) * chartHeight;
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
                      fill={getTeamPrimaryColor(homeTeamId)}
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
                      fill={getTeamPrimaryColor(homeTeamId)}
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
                      fill={getTeamPrimaryColor(awayTeamId)}
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
                      fill={getTeamPrimaryColor(awayTeamId)}
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
              style={{ backgroundColor: getTeamPrimaryColor(homeTeamId) }}
            />
            <span>{homeTeamId}</span>
          </div>
          <div className={styles['legend-item']}>
            <div 
              className={styles['legend-color']} 
              style={{ backgroundColor: getTeamPrimaryColor(awayTeamId) }}
            />
            <span>{awayTeamId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoringProgression;
