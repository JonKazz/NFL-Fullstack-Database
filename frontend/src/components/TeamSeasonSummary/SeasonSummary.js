import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SeasonSummary.module.css';
import { fetchTeamSeasonGamesInfo, fetchTeam, fetchTeamPlayerStats, fetchTeamsBySeason } from '../../api/fetches';
import { TEAM_MAP, getTeamPrimaryColor } from '../../utils';
import Games from './Games';
import SeasonHeader from './SeasonHeader';
import TeamStatistics from './TeamStatistics';
import TeamRoster from './TeamRoster';



function SeasonSummaryVisualization() {
  const params = useParams();
  const teamId = params.teamId;
  const year = parseInt(params.year);
  const [teamInfo, setTeamInfo] = useState(null);
  const [games, setGames] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort games by season week for chronological order
  const sortedGames = useMemo(() => {
    if (!games) return [];
    
    return [...games].sort((a, b) => {
      const weekA = a.gameInfo?.seasonWeek;
      const weekB = b.gameInfo?.seasonWeek;
      
      // Handle playoff weeks (they come after regular season)
      if (weekA === 'WC' || weekA === 'DIV' || weekA === 'CONF' || weekA === 'SB') {
        if (weekB === 'WC' || weekB === 'DIV' || weekB === 'CONF' || weekB === 'SB') {
          // Sort playoff weeks in order: WC -> DIV -> CONF -> SB
          const playoffOrder = { 'WC': 1, 'DIV': 2, 'CONF': 3, 'SB': 4 };
          return playoffOrder[weekA] - playoffOrder[weekB];
        }
        return 1; // Playoff games come after regular season
      }
      
      if (weekB === 'WC' || weekB === 'DIV' || weekB === 'CONF' || weekB === 'SB') {
        return -1; // Regular season comes before playoff
      }
      
      // Regular season weeks - convert to numbers and sort
      const numWeekA = parseInt(weekA);
      const numWeekB = parseInt(weekB);
      
      if (isNaN(numWeekA) || isNaN(numWeekB)) {
        return 0; // Keep original order if parsing fails
      }
      
      return numWeekA - numWeekB;
    });
  }, [games]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teamInfoResult, gamesResult, playerStatsResult, teamStatsResult] = await Promise.allSettled([
          fetchTeam(teamId, year),
          fetchTeamSeasonGamesInfo(teamId, year),
          fetchTeamPlayerStats(teamId, year),
          fetchTeamsBySeason(year)
        ]);

        if (teamInfoResult.status === 'fulfilled') {
          setTeamInfo(teamInfoResult.value);
        } else {
          setError('Failed to fetch team info');
        }

        if (gamesResult.status === 'fulfilled') {
          console.log('Games fetched successfully:', gamesResult.value);
          setGames(gamesResult.value);
        } else {
          console.error('Failed to fetch games:', gamesResult.reason);
          setError('Failed to fetch game info');
        }

        if (playerStatsResult.status === 'fulfilled') {
          setPlayerStats(playerStatsResult.value);
        } else {
          console.warn('Failed to fetch player stats, using fallback data');
        }

        if (teamStatsResult.status === 'fulfilled') {
          setTeamStats(teamStatsResult.value);
        } else {
          console.warn('Failed to fetch team stats, using fallback data');
        }

      } finally {
        setLoading(false);
      }
    };

    if (teamId && year) {
      fetchData();
      // Set team primary color for the header
      const teamColor = getTeamPrimaryColor(teamId);
      document.documentElement.style.setProperty('--team-primary-color', teamColor);
    }
  }, [teamId, year]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles['season-summary-error']}>{error}</p>;
  if (!teamInfo || !games) return <p>No data available</p>;

  // Team info is available for use in child components

  // Process player stats



  
  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Season Header */}
        <SeasonHeader teamInfo={teamInfo} teamId={teamId} year={year} />

        {/* Games Section */}
        <Games sortedGames={sortedGames} teamId={teamId} />

        {/* Team Statistics Section */}
        <TeamStatistics teamInfo={teamInfo} teamStats={teamStats} teamId={teamId} />
        
        {/* Team Roster Section */}
        <TeamRoster playerStats={playerStats} />
      </div>
    </div>
  );
}

export default SeasonSummaryVisualization;