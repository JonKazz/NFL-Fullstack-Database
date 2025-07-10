// Utility to fetch team info from the backend
export async function fetchTeamInfo(team, year) {
  const params = new URLSearchParams({ team, year });
  const response = await fetch(`http://localhost:8080/api/teams/info?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team info');
  }
  return response.json();
}

export async function fetchGameInfo(team, year) {
  const params = new URLSearchParams({ team, year });
  const response = await fetch(`http://localhost:8080/api/games/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game info');
  }
  return response.json();
}
