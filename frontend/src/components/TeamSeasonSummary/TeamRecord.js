import React, { useState, useEffect } from 'react';
import styles from './TeamRecord.module.css';
import { TEAM_MAP } from '../../utils';
import { fetchTeamSeeds } from '../../api/fetches';
import KeyPlayers from './KeyPlayers';

/**
 * Component that displays team record, division ranking, conference seeding, and playoff status
 * @param {Object} props - Component props
 * @param {Array} props.games - Array of games for the team (for win/loss circles)
 * @param {Object} props.teamInfo - Team season info object with record and standings
 * @param {Array} props.playerStats - Array of player statistics for the team
 * @param {string} props.teamId - Team ID for the season
 * @param {number} props.year - Season year
 * @returns {JSX.Element} TeamRecord component
 */
function TeamRecord({ games = [], teamInfo, playerStats, teamId, year }) {
  const [teamSeed, setTeamSeed] = useState(null);

  // Sort games by date to ensure proper order
  const sortedGames = [...games].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Filter regular season games only for the win/loss circles
  const regularSeasonGames = sortedGames.filter(game => {
    return game?.playoffGame === null || game?.playoffGame === undefined;
  });

  /**
   * Fetches team seeds and determines the current team's seed
   * @param {string} conference - The team's conference (AFC/NFC)
   * @param {number} seasonYear - The season year
   * @param {string} currentTeamId - The current team's ID
   */
  const fetchAndDetermineTeamSeed = async (conference, seasonYear, currentTeamId) => {
    try {
      const seedsData = await fetchTeamSeeds(conference, seasonYear);
      if (!seedsData) return;

      // Iterate through seed_team_1 to seed_team_16 to find the team's seed
      for (let i = 1; i <= 16; i++) {
        const seedTeamKey = `seedTeam${i}`;
        
        if (seedsData[seedTeamKey] === currentTeamId) {
          setTeamSeed(i);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching team seeds:', error);
    }
  };

  // Fetch team seed when component mounts or when teamInfo changes
  useEffect(() => {
    if (teamInfo?.conference && year && teamId) {
      fetchAndDetermineTeamSeed(teamInfo.conference, year, teamId);
    }
  }, [teamInfo?.conference, year, teamId]);

  // Extract team record and standings from teamInfo
  const teamRecord = {
    wins: teamInfo?.wins || 0,
    losses: teamInfo?.losses || 0,
    ties: teamInfo?.ties || 0
  };

  // Create division ranking string
  const divisionRanking = teamInfo?.divisionRank && teamInfo?.division 
    ? `${teamInfo.division}: #${teamInfo.divisionRank}`
    : "TBD";

  // Create conference ranking string using actual team seed
  const conferenceRanking = teamInfo?.conference 
    ? `${teamInfo.conference.toUpperCase()}: #${teamSeed || 'TBD'}`
    : "TBD";

  // Get playoff status text
  const playoffStatus = teamInfo?.playoffs || '';

  /**
   * Finds the opponent team for the last playoff game played
   * @returns {string} Opponent team name or empty string if no playoff games found
   */
  const getLastOpponent = () => {
    if (!games || games.length === 0 || !teamInfo?.teamId) return '';

    // Only look for playoff games
    const playoffGames = sortedGames.filter(game => 
      game?.playoffGame && game?.playoffGame !== null && game?.playoffGame !== undefined
    );

    // If no playoff games, return empty string
    if (playoffGames.length === 0) return '';

    // Get the last playoff game (highest playoff round)
    const targetGame = playoffGames[playoffGames.length - 1];

    if (!targetGame) return '';

    // Determine the opponent team ID
    const opponentTeamId = targetGame.homeTeamId === teamInfo.teamId 
      ? targetGame.awayTeamId 
      : targetGame.homeTeamId;

    // Get the opponent team name from TEAM_MAP
    const opponentTeam = TEAM_MAP[opponentTeamId];
    return opponentTeam?.name_short || opponentTeamId;
  };

  const lastOpponent = getLastOpponent();

  /**
   * Determines if a game was a win for the team using winningTeamId
   * @param {Object} game - Game object
   * @returns {boolean} True if the team won the game
   */
  const isWin = (game) => {
    if (!game || !teamInfo?.teamId) return false;
    return game.winningTeamId === teamInfo.teamId;
  };

  /**
   * Renders a small circle for each game showing win/loss
   * @param {Object} game - Game object
   * @param {number} index - Game index
   * @returns {JSX.Element} Game circle component
   */
  const renderGameCircle = (game, index) => {
    const won = isWin(game);
    return (
      <div
        key={game.gameId || index}
        className={`${styles['game-circle']} ${won ? styles.win : styles.loss}`}
        title={`${won ? 'Win' : 'Loss'} - ${game.date}`}
      >
        {won ? 'W' : 'L'}
      </div>
    );
  };

  return (
    <div className={styles['team-record-container']}>
      <div className={styles['record-row']}>
        <div className={styles['content-container']}>
          <span className={styles['record-label']}>Record:</span>
          <span className={styles['record-numbers']}>
            {teamRecord.wins}-{teamRecord.losses}
            {teamRecord.ties > 0 && `-${teamRecord.ties}`}
          </span>
          <div className={styles['game-circles']}>
            {regularSeasonGames.map((game, index) => renderGameCircle(game, index))}
          </div>
        </div>
        <div className={styles['content-container']}>
          <span className={styles['division-value']}>{divisionRanking}</span>
        </div>
        <div className={styles['content-container']}>
          <span className={styles['conference-value']}>{conferenceRanking}</span>
        </div>
        <div className={styles['content-container']}>
          <span className={styles['playoff-value']}>
            {playoffStatus}
            {lastOpponent && ` vs. ${lastOpponent}`}
          </span>
        </div>
      </div>

      {/* Key Players Section */}
      <KeyPlayers playerStats={playerStats} teamId={teamId} year={year} />
    </div>
  );
}

export default TeamRecord;
