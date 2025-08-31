import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './GameSummary.module.css';
import Scoreboard from './Scoreboard';
import TeamStatsComparison from './TeamStatsComparison';
import ScoringProgression from './ScoringProgression';
import PlayerStats from './PlayerStats';
import DownConversionRates from './DownConversionRates';
import { fetchTeamsBySeason } from '../../api/fetches';
import { getTeamColorsForGame } from '../../utils';

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
  
  // Get contrasting team colors for the game
  const { homeTeamColor, awayTeamColor } = getTeamColorsForGame(homeTeamId, awayTeamId);
  
  const hasOvertime = !!gameInfo.overtime;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <Scoreboard 
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeStats={homeStats}
          awayStats={awayStats}
          gameInfo={gameInfo}
          homeName={homeName}
          awayName={awayName}
          homeTeamColor={homeTeamColor}
          awayTeamColor={awayTeamColor}
        />

        <ScoringProgression 
          gameId={gameId} 
          homeTeamId={homeTeamId} 
          awayTeamId={awayTeamId}
          homeStats={homeStats}
          awayStats={awayStats}
          homeName={homeName}
          awayName={awayName}
          hasOvertime={hasOvertime}
          homeTeamColor={homeTeamColor}
          awayTeamColor={awayTeamColor}
        />

        <div className={styles['stats-section']}>
          <div className={styles['section-title']}>Team Statistics</div>
          
          <TeamStatsComparison 
            homeStats={homeStats} 
            awayStats={awayStats} 
            homeTeamColor={homeTeamColor}
            awayTeamColor={awayTeamColor}
          />
          <DownConversionRates 
            homeStats={homeStats} 
            awayStats={awayStats} 
            homeTeamColor={homeTeamColor}
            awayTeamColor={awayTeamColor}
          />
          
        </div>

        <PlayerStats 
          gamePlayerStats={gamePlayerStats} 
          teams={teams}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
        />
      </div>
    </div>
  );
}

export default GameSummary;
