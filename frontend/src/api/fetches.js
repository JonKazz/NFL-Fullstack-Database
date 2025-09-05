import { API_BASE_URL } from '../config/api.js';

/*
------------------------------------------------------------------------------------------------
SEASON TEAM INFO
------------------------------------------------------------------------------------------------
*/
export async function fetchTeam(teamId, year) {
  const params = new URLSearchParams({ teamId, year });
  const response = await fetch(`${API_BASE_URL}/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info (api)');
  }
  return response.json();
}

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
export async function fetchAvailableSeasons() {
  const response = await fetch(`${API_BASE_URL}/api/season/years-list`);
  if (!response.ok) {
    throw new Error('Failed to fetch available seasons (api)');
  }
  return response.json();
}

export async function fetchSeasonInfo(year) {
  const response = await fetch(`${API_BASE_URL}/api/season/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch season info (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
GAME INFO
------------------------------------------------------------------------------------------------
*/
export async function fetchPlayoffGamesInfo(seasonYear) {
  const params = new URLSearchParams({ seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-info/playoffs?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playoff games (api)');
  }
  return response.json();
}

export async function fetchGameInfo(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`${API_BASE_URL}/api/game-info/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info (api)');
  }
  return response.json();
}

export async function fetchTeamSeasonGamesInfo(teamId, seasonYear) {
  const params = new URLSearchParams({ teamId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-info/fullseason?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team season games (api)');
  }
  return response.json();
}

export async function fetchGameInfoCount() {
  const response = await fetch(`${API_BASE_URL}/api/game-info/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info count (api)');
  }
  return response.json();
}



/*
------------------------------------------------------------------------------------------------
GAME PLAYER STATS
------------------------------------------------------------------------------------------------
*/
export async function fetchPlayerStatsFromGame(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats (api)');
  }
  return response.json();
}

export async function fetchPlayerGameStats(gameId, playerId) {
  const params = new URLSearchParams({ gameId, playerId });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/player?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player game stats (api)');
  }
  return response.json();
}

export async function fetchPlayerStatsBySeason(playerId, seasonYear) {
  const params = new URLSearchParams({ playerId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/game-player-stats/season?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats by season (api)');
  }
  return response.json();
}

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
export async function fetchTeamPlayerStats(teamId, year) {
  const params = new URLSearchParams({ teamId, seasonYear: year });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/team?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats (api)');
  }
  return response.json();
}

export async function fetchPlayerSeasonStats(playerId, seasonYear) {
  const params = new URLSearchParams({ playerId, seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/player?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player season summary (api)');
  }
  return response.json();
}

export async function fetchSeasonStatsByYear(seasonYear) {
  const params = new URLSearchParams({ seasonYear });
  const response = await fetch(`${API_BASE_URL}/api/season-stats/season?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player season stats (api)');
  }
  return response.json();
}

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
export async function fetchPlayerProfile(playerId) {
  const response = await fetch(`${API_BASE_URL}/api/player-profiles/${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player profile (api)');
  }
  return response.json();
}

export async function fetchPlayerProfilesCount() {
  const response = await fetch(`${API_BASE_URL}/api/player-profiles/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch player profiles count (api)');
  }
  return response.json();
}




