// Utility to fetch team info from the backend
export async function fetchTeamInfo(teamId, year) {
  const params = new URLSearchParams({ teamId, year });
  const response = await fetch(`http://localhost:8080/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info (api)');
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