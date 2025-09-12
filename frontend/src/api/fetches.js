import { API_BASE_URL } from '../config/api.js';

/*
------------------------------------------------------------------------------------------------
SEASON TEAM INFO
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch team information for a specific team and year
 * @param {string} teamId - The ID of the team
 * @param {number} year - The year to get team info for
 * @returns {Promise<Object>} Team information object
 */
export async function fetchTeam(teamId, year) {
  const params = new URLSearchParams({ teamId, year });
  const response = await fetch(`${API_BASE_URL}/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info (api)');
  }
  return response.json();
}

/**
 * Fetch all teams for a specific season
 * @param {number} year - The year to get teams for
 * @returns {Promise<Array>} Array of team objects for the season
 */
export async function fetchTeamsBySeason(year) {
  const response = await fetch(`${API_BASE_URL}/api/teams/season/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams by season (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
SEASON INFO
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch all available seasons in the database
 * @returns {Promise<Array<number>>} Array of available season years
 */
export async function fetchAvailableSeasons() {
  const response = await fetch(`${API_BASE_URL}/api/season/years-list`);
  if (!response.ok) {
    throw new Error('Failed to fetch available seasons (api)');
  }
  return response.json();
}

/**
 * Fetch detailed season information for a specific year
 * @param {number} year - The year to get season info for
 * @returns {Promise<Object>} Season information object including awards and stats
 */
export async function fetchSeasonInfo(year) {
  const response = await fetch(`${API_BASE_URL}/api/season/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch season info (api)');
  }
  return response.json();
}

/**
 * Check if a season exists in the database
 * @param {number} year - The year to check
 * @returns {Promise<boolean>} True if season exists, false otherwise
 */
export async function checkSeasonExists(year) {
  const response = await fetch(`${API_BASE_URL}/api/season/exists/${year}`);
  if (!response.ok) {
    throw new Error('Failed to check season existence (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
GAME INFO
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch playoff games information for a specific season
 * @param {number} seasonYear - The year of the season
 * @returns {Promise<Array>} Array of playoff game objects
 */
export async function fetchPlayoffGamesInfo(seasonYear) {
  const params = new URLSearchParams({ seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-info/playoffs?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playoff games (api)');
  }
  return response.json();
}

/**
 * Fetch game information for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Object>} Game information object
 */
export async function fetchGameInfo(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`${API_BASE_URL}/api/game-info/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info (api)');
  }
  return response.json();
}

/**
 * Fetch all games for a specific team and season
 * @param {string} teamId - The ID of the team
 * @param {number} seasonYear - The year of the season
 * @returns {Promise<Array>} Array of game objects for the team's season
 */
export async function fetchTeamSeasonGamesInfo(teamId, seasonYear) {
  const params = new URLSearchParams({ teamId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-info/fullseason?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team season games (api)');
  }
  return response.json();
}

/**
 * Fetch the total count of game info records in the database
 * @returns {Promise<number>} Total number of game info records
 */
export async function fetchGameInfoCount() {
  const response = await fetch(`${API_BASE_URL}/api/game-info/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info count (api)');
  }
  return response.json();
}

/**
 * Check if a game exists in the database
 * @param {string} gameId - The ID of the game to check
 * @returns {Promise<boolean>} True if game exists, false otherwise
 */
export async function checkGameExists(gameId) {
  const response = await fetch(`${API_BASE_URL}/api/game-info/exists/${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to check game existence (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
GAME PLAYER STATS
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch all player stats for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Array>} Array of player stats objects for the game
 */
export async function fetchPlayerStatsFromGame(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats (api)');
  }
  return response.json();
}

/**
 * Fetch player stats for a specific player in a specific game
 * @param {string} gameId - The ID of the game
 * @param {string} playerId - The ID of the player
 * @returns {Promise<Object>} Player stats object for the specific game
 */
export async function fetchPlayerGameStats(gameId, playerId) {
  const params = new URLSearchParams({ gameId, playerId });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/player?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player game stats (api)');
  }
  return response.json();
}

/**
 * Fetch all games and stats for a player in a specific season
 * @param {string} playerId - The ID of the player
 * @param {string} seasonYear - The year of the season
 * @returns {Promise<Array>} Array of player stats with game info for the season
 */
export async function fetchPlayerStatsBySeason(playerId, seasonYear) {
  const params = new URLSearchParams({ playerId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/season?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats by season (api)');
  }
  return response.json();
}

/**
 * Fetch the team ID for a player in a specific season
 * @param {string} playerId - The ID of the player
 * @param {number} seasonYear - The year of the season
 * @returns {Promise<string>} Team ID as a string
 */
export async function fetchPlayerTeamBySeason(playerId, seasonYear) {
  const params = new URLSearchParams({ playerId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/player-team?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player team by season (api)');
  }
  return response.text(); // Returns a string (team ID)
}



/*
------------------------------------------------------------------------------------------------
GAME TEAM STATS
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch team stats for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Object>} Team stats object for the game
 */
export async function fetchGameTeamStats(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`${API_BASE_URL}/api/game-team-stats/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game stats (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
REGULAR SEASON PLAYERSTATS
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch all player stats for a specific team and season
 * @param {string} teamId - The ID of the team
 * @param {number} year - The year of the season
 * @returns {Promise<Array>} Array of player stats objects for the team's season
 */
export async function fetchTeamPlayerStats(teamId, year) {
  const params = new URLSearchParams({ teamId, seasonYear: year });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/team?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats (api)');
  }
  return response.json();
}

/**
 * Fetch season summary stats for a specific player
 * @param {string} playerId - The ID of the player
 * @param {number} seasonYear - The year of the season
 * @returns {Promise<Object>} Player season summary stats object
 */
export async function fetchPlayerSeasonStats(playerId, seasonYear) {
  const params = new URLSearchParams({ playerId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/player?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player season summary (api)');
  }
  return response.json();
}

/**
 * Fetch all player stats for a specific season
 * @param {number} seasonYear - The year of the season
 * @returns {Promise<Array>} Array of player stats objects for the season
 */
export async function fetchSeasonStatsByYear(seasonYear) {
  const params = new URLSearchParams({ seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/season?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player season stats (api)');
  }
  return response.json();
}

/**
 * Fetch all available seasons for a specific player
 * @param {string} playerId - The ID of the player
 * @returns {Promise<Array<number>>} Array of available season years for the player
 */
export async function fetchPlayerAvailableSeasons(playerId) {
  const params = new URLSearchParams({ playerId });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/available-seasons?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player available seasons (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
GAME DRIVES
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch all drives for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Array>} Array of drive objects for the game
 */
export async function fetchGameDrives(gameId) {
  const response = await fetch(`${API_BASE_URL}/api/game-drives/game?gameId=${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game drives (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
PLAYER PROFILES
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch player profile information by player ID
 * @param {string} playerId - The ID of the player
 * @returns {Promise<Object>} Player profile object or null if not found
 */
export async function fetchPlayerProfile(playerId) {
  const response = await fetch(`${API_BASE_URL}/api/player-profiles/${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player profile (api)');
  }
  return response.json();
}

/**
 * Fetch the total count of player profiles in the database
 * @returns {Promise<number>} Total number of player profiles
 */
export async function fetchPlayerProfilesCount() {
  const response = await fetch(`${API_BASE_URL}/api/player-profiles/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch player profiles count (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
AP TEAM VOTES
------------------------------------------------------------------------------------------------
*/
/**
 * Fetch AP team votes for a specific season and team
 * @param {number} seasonYear - The year of the season
 * @param {string} teamId - The ID of the team
 * @returns {Promise<Array>} Array of AP team vote objects for the specified season and team
 */
export async function fetchApTeamVotes(seasonYear, teamId) {
  const response = await fetch(`${API_BASE_URL}/api/ap-team-votes/${seasonYear}/${teamId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch AP team votes (api)');
  }
  return response.json();
}