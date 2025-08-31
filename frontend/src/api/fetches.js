// Utility to fetch team info from the backend
export async function fetchTeamInfo(teamId, year) {
  const params = new URLSearchParams({ teamId, year });
  const response = await fetch(`http://localhost:8080/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info (api)');
  }
  return response.json();
}

// Fetch all teams for a specific season
export async function fetchTeamsBySeason(year) {
  const response = await fetch(`http://localhost:8080/api/teams/season/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams by season (api)');
  }
  return response.json();
}

// Fetch all teams' stats for a specific season (for ranking calculations)
export async function fetchTeamsStatsBySeason(year) {
  const response = await fetch(`http://localhost:8080/api/teams/season/${year}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams stats by season (api)');
  }
  return response.json();
}

// Fetch available seasons from the database
export async function fetchAvailableSeasons() {
  const response = await fetch(`http://localhost:8080/api/season-info/seasons`);
  if (!response.ok) {
    throw new Error('Failed to fetch available seasons (api)');
  }
  return response.json();
}

// Fetch playoff games for a specific season
export async function fetchPlayoffGames(year) {
  const response = await fetch(`http://localhost:8080/api/game-info/playoffs/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playoff games (api)');
  }
  return response.json();
}


export async function fetchGame(gameId) {
  const params = new URLSearchParams({ gameId });
  const response = await fetch(`http://localhost:8080/api/games/game?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch games with stats (api)');
  }
  return response.json();
}

export async function fetchFullSeason(teamId, year) {
  const params = new URLSearchParams({ teamId, seasonYear: year });
  const response = await fetch(`http://localhost:8080/api/games/fullseason?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch games with stats (api)');
  }
  return response.json();
}

// Fetch player statistics for a team in a season (using new regular_season_player_stats)
export async function fetchTeamPlayerStats(teamId, year) {
  const params = new URLSearchParams({ teamId, seasonYear: year });
  const response = await fetch(`http://localhost:8080/api/season-stats/team?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats (api)');
  }
  return response.json();
}

// Fetch individual player stats for a specific game
export async function fetchPlayerGameStats(gameId, playerId) {
  const params = new URLSearchParams({ gameId, playerId });
  const response = await fetch(`http://localhost:8080/api/game-player-stats/player?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player game stats (api)');
  }
  return response.json();
}

// Fetch season information including awards and stat leaders
export async function fetchSeasonInfo(year) {
  const response = await fetch(`http://localhost:8080/api/season-info/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch season info (api)');
  }
  return response.json();
}

// Fetch drive data for a specific game
export async function fetchGameDrives(gameId) {
  const response = await fetch(`http://localhost:8080/api/game-drives/game?gameId=${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game drives (api)');
  }
  return response.json();
}

// Fetch player profile by player ID
export async function fetchPlayerProfile(playerId) {
  const response = await fetch(`http://localhost:8080/api/player-profiles/player?playerId=${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player profile (api)');
  }
  return response.json();
}