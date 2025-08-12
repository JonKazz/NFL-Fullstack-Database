export const TEAM_MAP = {
    'crd': { name: 'Arizona Cardinals', city: 'Arizona' },
    'atl': { name: 'Atlanta Falcons', city: 'Atlanta' },
    'rav': { name: 'Baltimore Ravens', city: 'Baltimore' },
    'buf': { name: 'Buffalo Bills', city: 'Buffalo' },
    'car': { name: 'Carolina Panthers', city: 'Carolina' },
    'chi': { name: 'Chicago Bears', city: 'Chicago' },
    'cin': { name: 'Cincinnati Bengals', city: 'Cincinnati' },
    'cle': { name: 'Cleveland Browns', city: 'Cleveland' },
    'dal': { name: 'Dallas Cowboys', city: 'Dallas' },
    'den': { name: 'Denver Broncos', city: 'Denver' },
    'det': { name: 'Detroit Lions', city: 'Detroit' },
    'gnb': { name: 'Green Bay Packers', city: 'Green Bay' },
    'htx': { name: 'Houston Texans', city: 'Houston' },
    'clt': { name: 'Indianapolis Colts', city: 'Indianapolis' },
    'jax': { name: 'Jacksonville Jaguars', city: 'Jacksonville' },
    'kan': { name: 'Kansas City Chiefs', city: 'Kansas City' },
    'sdg': { name: 'Los Angeles Chargers', city: 'Los Angeles' },
    'ram': { name: 'Los Angeles Rams', city: 'Los Angeles' },
    'rai': { name: 'Las Vegas Raiders', city: 'Las Vegas' },
    'mia': { name: 'Miami Dolphins', city: 'Miami' },
    'min': { name: 'Minnesota Vikings', city: 'Minnesota' },
    'nwe': { name: 'New England Patriots', city: 'New England' },
    'nor': { name: 'New Orleans Saints', city: 'New Orleans' },
    'nyg': { name: 'New York Giants', city: 'New York' },
    'nyj': { name: 'New York Jets', city: 'New York' },
    'phi': { name: 'Philadelphia Eagles', city: 'Philadelphia' },
    'pit': { name: 'Pittsburgh Steelers', city: 'Pittsburgh' },
    'sea': { name: 'Seattle Seahawks', city: 'Seattle' },
    'sfo': { name: 'San Francisco 49ers', city: 'San Francisco' },
    'tam': { name: 'Tampa Bay Buccaneers', city: 'Tampa Bay' },
    'oti': { name: 'Tennessee Titans', city: 'Tennessee' },
    'was': { name: 'Washington Commanders', city: 'Washington' }
};


// Format numbers for display
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

// Calculate yards per carry
export function calculateYPC(rushYds, rushAtt) {
  if (!rushAtt || rushAtt === 0) return '0.0';
  return (rushYds / rushAtt).toFixed(1);
}

// Calculate yards per catch
export function calculateYPCatch(recYds, rec) {
  if (!rec || rec === 0) return '0.0';
  return (recYds / rec).toFixed(1);
}

// Calculate field goal percentage
export function calculateFGPercentage(fgm, fga) {
  if (!fga || fga === 0) return '0.0%';
  return ((fgm / fga) * 100).toFixed(1) + '%';
}

// Calculate extra point percentage
export function calculateXPPercentage(xpm, xpa) {
  if (!xpa || xpa === 0) return '0.0%';
  return ((xpm / xpa) * 100).toFixed(1) + '%';
}

// Calculate punt average
export function calculatePuntAverage(puntYds, punt) {
  if (!punt || punt === 0) return '0.0';
  return (puntYds / punt).toFixed(1);
}

// Process player stats for display in SeasonSummary
export function processPlayerStats(playerStats) {
  if (!playerStats || !Array.isArray(playerStats)) {
    return {
      quarterbacks: [],
      runningBacks: [],
      receivers: [],
      defensiveLine: [],
      linebackers: [],
      defensiveBacks: [],
      specialTeams: []
    };
  }

  const processed = {
    quarterbacks: [],
    runningBacks: [],
    receivers: [],
    defensiveLine: [],
    linebackers: [],
    defensiveBacks: [],
    specialTeams: []
  };

  playerStats.forEach(player => {
    // Map the backend field names to the expected format
    const mappedPlayer = {
      playerId: player.id?.playerId || player.playerId,
      position: player.position,
      // Passing stats
      passYds: player.passingYards || 0,
      passTd: player.passingTouchdowns || 0,
      passInt: player.passingInterceptions || 0,
      passAtt: player.passingAttempts || 0,
      passCmp: player.passingCompletions || 0,
      // Rushing stats
      rushYds: player.rushingYards || 0,
      rushTd: player.rushingTouchdowns || 0,
      rushAtt: player.rushingAttempts || 0,
      // Receiving stats
      rec: player.receivingReceptions || 0,
      recYds: player.receivingYards || 0,
      recTd: player.receivingTouchdowns || 0,
      targets: player.receivingTargets || 0,
      // Defensive stats
      sacks: player.defensiveSacks || 0,
      tacklesTotal: player.defensiveTacklesCombined || 0,
      tacklesLoss: player.defensiveTacklesLoss || 0,
      defInt: player.defensiveInterceptions || 0,
      passDefended: player.defensivePassesDefended || 0,
      // Kicking stats
      fgm: player.fieldGoalsMade || 0,
      fga: player.fieldGoalsAttempted || 0,
      xpm: player.extraPointsMade || 0,
      xpa: player.extraPointsAttempted || 0,
      // Punting stats
      punt: player.punts || 0,
      puntYds: player.puntYards || 0
    };

    // Categorize players by exact position values from database
    const position = player.position;
    
    switch (position) {
      case 'QB':
        processed.quarterbacks.push(mappedPlayer);
        break;
      case 'RB':
      case 'FB':
        processed.runningBacks.push(mappedPlayer);
        break;
      case 'WR':
      case 'TE':
        processed.receivers.push(mappedPlayer);
        break;
      case 'DE':
      case 'DT':
      case 'NT':
        processed.defensiveLine.push(mappedPlayer);
        break;
      case 'LB':
        processed.linebackers.push(mappedPlayer);
        break;
      case 'CB':
      case 'DB':
      case 'FS':
      case 'SS':
        processed.defensiveBacks.push(mappedPlayer);
        break;
      case 'K':
      case 'P':
      case 'LS':
        processed.specialTeams.push(mappedPlayer);
        break;
      case 'C':
      case 'G':
      case 'T':
        // Offensive linemen - could add a separate category if needed
        // For now, skip them as they don't typically have stats
        break;
      default:
        // Unknown position - skip
        break;
    }
  });

  return processed;
}

// Cache for player names to avoid repeated API calls
const playerNameCache = new Map();

// Get player name from player ID using the player_profiles API
export async function getPlayerName(playerId) {
  if (!playerId) return 'Unknown Player';
  
  // Check cache first
  if (playerNameCache.has(playerId)) {
    return playerNameCache.get(playerId);
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/player-profiles/player?playerId=${playerId}`);
    
    if (response.ok) {
      const playerProfile = await response.json();
      if (playerProfile && playerProfile.name) {
        // Cache the name
        playerNameCache.set(playerId, playerProfile.name);
        return playerProfile.name;
      }
    }
    
    // Fallback if API fails or player not found
    const fallbackName = playerId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    playerNameCache.set(playerId, fallbackName);
    return fallbackName;
    
  } catch (error) {
    console.warn(`Failed to fetch player name for ${playerId}:`, error);
    // Fallback to formatted player ID
    const fallbackName = playerId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    playerNameCache.set(playerId, fallbackName);
    return fallbackName;
  }
}