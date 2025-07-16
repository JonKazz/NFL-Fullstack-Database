// Utility to fetch team info from the backend
export async function fetchTeamInfo(team, year) {
  const params = new URLSearchParams({ team, year });
  const response = await fetch(`http://localhost:8080/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info (api)');
  }
  return response.json();
}

export async function fetchGames(team, year) {
  const params = new URLSearchParams({ team, year });
  const response = await fetch(`http://localhost:8080/api/games/fullseason?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info (api)');
  }
  return response.json();
}

