export const TEAM_MAP = {
    'crd': { name: 'Arizona Cardinals', city: 'Arizona', name_short: 'Cardinals' },
    'atl': { name: 'Atlanta Falcons', city: 'Atlanta', name_short: 'Falcons' },
    'rav': { name: 'Baltimore Ravens', city: 'Baltimore', name_short: 'Ravens' },
    'buf': { name: 'Buffalo Bills', city: 'Buffalo', name_short: 'Bills' },
    'car': { name: 'Carolina Panthers', city: 'Carolina', name_short: 'Panthers' },
    'chi': { name: 'Chicago Bears', city: 'Chicago', name_short: 'Bears' },
    'cin': { name: 'Cincinnati Bengals', city: 'Cincinnati', name_short: 'Bengals' },
    'cle': { name: 'Cleveland Browns', city: 'Cleveland', name_short: 'Browns' },
    'dal': { name: 'Dallas Cowboys', city: 'Dallas', name_short: 'Cowboys' },
    'den': { name: 'Denver Broncos', city: 'Denver', name_short: 'Broncos' },
    'det': { name: 'Detroit Lions', city: 'Detroit', name_short: 'Lions' },
    'gnb': { name: 'Green Bay Packers', city: 'Green Bay', name_short: 'Packers' },
    'htx': { name: 'Houston Texans', city: 'Houston', name_short: 'Texans' },
    'clt': { name: 'Indianapolis Colts', city: 'Indianapolis', name_short: 'Colts' },
    'jax': { name: 'Jacksonville Jaguars', city: 'Jacksonville', name_short: 'Jaguars' },
    'kan': { name: 'Kansas City Chiefs', city: 'Kansas City', name_short: 'Chiefs' },
    'sdg': { name: 'Los Angeles Chargers', city: 'Los Angeles', name_short: 'Chargers' },
    'ram': { name: 'Los Angeles Rams', city: 'Los Angeles', name_short: 'Rams' },
    'rai': { name: 'Las Vegas Raiders', city: 'Las Vegas', name_short: 'Raiders' },
    'mia': { name: 'Miami Dolphins', city: 'Miami', name_short: 'Dolphins' },
    'min': { name: 'Minnesota Vikings', city: 'Minnesota', name_short: 'Vikings' },
    'nwe': { name: 'New England Patriots', city: 'New England', name_short: 'Patriots' },
    'nor': { name: 'New Orleans Saints', city: 'New Orleans', name_short: 'Saints' },
    'nyg': { name: 'New York Giants', city: 'New York', name_short: 'Giants' },
    'nyj': { name: 'New York Jets', city: 'New York', name_short: 'Jets' },
    'phi': { name: 'Philadelphia Eagles', city: 'Philadelphia', name_short: 'Eagles' },
    'pit': { name: 'Pittsburgh Steelers', city: 'Pittsburgh', name_short: 'Steelers' },
    'sea': { name: 'Seattle Seahawks', city: 'Seattle', name_short: 'Seahawks' },
    'sfo': { name: 'San Francisco 49ers', city: 'San Francisco', name_short: '49ers' },
    'tam': { name: 'Tampa Bay Buccaneers', city: 'Tampa Bay', name_short: 'Buccaneers' },
    'oti': { name: 'Tennessee Titans', city: 'Tennessee', name_short: 'Titans' },
    'was': { name: 'Washington Commanders', city: 'Washington', name_short: 'Commanders' }
};

// Get team primary color
export function getTeamPrimaryColor(teamId) {
  const teamColors = {
    'crd': '#97233F', // Arizona Cardinals
    'atl': '#A71930', // Atlanta Falcons
    'rav': '#241773', // Baltimore Ravens
    'buf': '#00338D', // Buffalo Bills
    'car': '#0085CA', // Carolina Panthers
    'chi': '#C83803', // Chicago Bears - Official orange
    'cin': '#FB4F14', // Cincinnati Bengals
    'cle': '#311D00', // Cleveland Browns
    'dal': '#003594', // Dallas Cowboys
    'den': '#FB4F14', // Denver Broncos
    'det': '#0076B6', // Detroit Lions
    'gnb': '#203731', // Green Bay Packers
    'htx': '#03202F', // Houston Texans
    'clt': '#002C5F', // Indianapolis Colts
    'jax': '#006778', // Jacksonville Jaguars
    'kan': '#E31837', // Kansas City Chiefs
    'sdg': '#0080C6', // Los Angeles Chargers
    'ram': '#003594', // Los Angeles Rams
    'rai': '#000000', // Las Vegas Raiders
    'mia': '#008E97', // Miami Dolphins
    'min': '#4F2683', // Minnesota Vikings
    'nwe': '#002244', // New England Patriots
    'nor': '#D3BC8D', // New Orleans Saints
    'nyg': '#0B2265', // New York Giants
    'nyj': '#0C371D', // New York Jets
    'phi': '#004C54', // Philadelphia Eagles
    'pit': '#000000', // Pittsburgh Steelers
    'sea': '#002244', // Seattle Seahawks
    'sfo': '#AA0000', // San Francisco 49ers
    'tam': '#D50A0A', // Tampa Bay Buccaneers
    'oti': '#0C2340', // Tennessee Titans
    'was': '#5A1414'  // Washington Commanders
  };

  return teamColors[teamId] || '#dc2626';
}

// Get team neon color - bright, vibrant version of primary color
export function getNeonTeamColor(teamId) {
  const neonTeamColors = {
    'crd': '#FF1A5C', // Arizona Cardinals - Bright neon red
    'atl': '#FF2D4A', // Atlanta Falcons - Bright neon red
    'rav': '#4A2CFF', // Baltimore Ravens - Bright neon purple
    'buf': '#0066FF', // Buffalo Bills - Bright neon blue
    'car': '#00BFFF', // Carolina Panthers - Bright neon blue
    'chi': '#FF6600', // Chicago Bears - Bright neon orange
    'cin': '#FF6600', // Cincinnati Bengals - Bright neon orange
    'cle': '#FF8C00', // Cleveland Browns - Bright neon orange
    'dal': '#0066FF', // Dallas Cowboys - Bright neon blue
    'den': '#FF6600', // Denver Broncos - Bright neon orange
    'det': '#00BFFF', // Detroit Lions - Bright neon blue
    'gnb': '#00FF7F', // Green Bay Packers - Bright neon green
    'htx': '#0066CC', // Houston Texans - Darker neon blue
    'clt': '#0066FF', // Indianapolis Colts - Bright neon blue
    'jax': '#00CCCC', // Jacksonville Jaguars - Less green-shifted teal
    'kan': '#FF1A5C', // Kansas City Chiefs - Bright neon red
    'sdg': '#00BFFF', // Los Angeles Chargers - Bright neon blue
    'ram': '#0066FF', // Los Angeles Rams - Bright neon blue
    'rai': '#FFFFFF', // Las Vegas Raiders - Bright white
    'mia': '#00FFBF', // Miami Dolphins - Bright neon teal
    'min': '#BF00FF', // Minnesota Vikings - Bright neon purple
    'nwe': '#00BFFF', // New England Patriots - Bright neon blue
    'nor': '#F0D090', // New Orleans Saints - Brighter version of primary gold
    'nyg': '#0066FF', // New York Giants - Bright neon blue
    'nyj': '#00FF7F', // New York Jets - Bright neon green
    'phi': '#00FFBF', // Philadelphia Eagles - Bright neon teal
    'pit': '#FFFFFF', // Pittsburgh Steelers - Bright white
    'sea': '#0080CC', // Seattle Seahawks - Darker neon blue
    'sfo': '#FF0000', // San Francisco 49ers - Bright neon red
    'tam': '#FF3333', // Tampa Bay Buccaneers - Bright neon red
    'oti': '#00BFFF', // Tennessee Titans - Bright neon blue
    'was': '#FF6666'  // Washington Commanders - Bright neon red
  };

  return neonTeamColors[teamId] || '#FF1A5C';
}

// Calculate team ranking for a specific stat
export function calculateTeamRanking(teams, teamId, statField, sortDirection = 'desc') {
  if (!teams || teams.length === 0) return null;
  
  // Sort teams by the specified stat
  const sortedTeams = [...teams].sort((a, b) => {
    const aValue = a[statField] || 0;
    const bValue = b[statField] || 0;
    
    if (sortDirection === 'desc') {
      return bValue - aValue; // Higher values first
    } else {
      return aValue - bValue; // Lower values first
    }
  });
  
  // Find the rank of the specified team
  const rank = sortedTeams.findIndex(team => team.teamId === teamId) + 1;
  return rank;
}

// Format ranking with ordinal suffix
export function formatRanking(rank) {
  if (!rank) return 'N/A';
  
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${rank}th`;
  }
  
  switch (lastDigit) {
    case 1: return `${rank}st`;
    case 2: return `${rank}nd`;
    case 3: return `${rank}rd`;
    default: return `${rank}th`;
  }
}

// Get stat value with proper formatting
export function getStatValue(team, statField, format = 'number') {
  const value = team[statField];
  
  if (value === null || value === undefined) return 'N/A';
  
  switch (format) {
    case 'percentage':
      return `${value}%`;
    case 'time':
      return value; // Already formatted as MM:SS
    case 'yards':
      return `${value} YPG`;
    case 'points':
      return `${value} PPG`;
    default:
      return value;
  }
}

export function getTeamSecondaryColor(teamId) {
  const teamSecondaryColors = {
    'crd': '#FFB612', // Arizona Cardinals - Gold
    'atl': '#000000', // Atlanta Falcons - Black
    'rav': '#000000', // Baltimore Ravens - Black
    'buf': '#C60C30', // Buffalo Bills - Red
    'car': '#101820', // Carolina Panthers - Black
    'chi': '#C83803', // Chicago Bears - Orange
    'cin': '#000000', // Cincinnati Bengals - Black
    'cle': '#FF3C00', // Cleveland Browns - Orange
    'dal': '#869397', // Dallas Cowboys - Silver
    'den': '#002244', // Denver Broncos - Blue
    'det': '#B0B7BC', // Detroit Lions - Silver
    'gnb': '#FFB612', // Green Bay Packers - Gold
    'htx': '#A71930', // Houston Texans - Red
    'clt': '#A5ACAF', // Indianapolis Colts - Gray
    'jax': '#9F2C55', // Jacksonville Jaguars - Teal
    'kan': '#FFB81C', // Kansas City Chiefs - Gold
    'sdg': '#FFC20E', // Los Angeles Chargers - Gold
    'ram': '#FFA300', // Los Angeles Rams - Gold
    'rai': '#C4C4C4', // Las Vegas Raiders - Silver
    'mia': '#FC4C02', // Miami Dolphins - Orange
    'min': '#FFC62F', // Minnesota Vikings - Gold
    'nwe': '#C60C30', // New England Patriots - Red
    'nor': '#101820', // New Orleans Saints - Black
    'nyg': '#A71930', // New York Giants - Red
    'nyj': '#FFFFFF', // New York Jets - White
    'phi': '#A5ACAF', // Philadelphia Eagles - Gray
    'pit': '#FFB612', // Pittsburgh Steelers - Gold
    'sea': '#69BE28', // Seattle Seahawks - Green
    'sfo': '#B3995D', // San Francisco 49ers - Gold
    'tam': '#FF7900', // Tampa Bay Buccaneers - Orange
    'oti': '#4B92DB', // Tennessee Titans - Blue
    'was': '#FFB612'  // Washington Commanders - Gold
  };

  return teamSecondaryColors[teamId] || '#ffffff';
}

// Get two contrasting colors for two teams
export function getTeamColorsForGame(homeTeamId, awayTeamId) {
  const homeTeamPrimary = getTeamPrimaryColor(homeTeamId);
  const awayTeamPrimary = getTeamPrimaryColor(awayTeamId);
  
  // Simple conditional logic for known similar color combinations
  // Home team always keeps primary color, away team switches to secondary if needed
  
  // Check if away team has a similar color to home team
  if (homeTeamId === 'crd' && ['atl', 'kan', 'sfo', 'tam', 'was'].includes(awayTeamId)) {
    // Cardinals vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // Cardinals keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'atl' && ['crd', 'kan', 'sfo', 'tam', 'was'].includes(awayTeamId)) {
    // Falcons vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // Falcons keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'kan' && ['crd', 'atl', 'sfo', 'tam', 'was'].includes(awayTeamId)) {
    // Chiefs vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // Chiefs keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'sfo' && ['crd', 'atl', 'kan', 'tam', 'was'].includes(awayTeamId)) {
    // 49ers vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // 49ers keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'tam' && ['crd', 'atl', 'kan', 'sfo', 'was'].includes(awayTeamId)) {
    // Buccaneers vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // Buccaneers keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'was' && ['crd', 'atl', 'kan', 'sfo', 'tam'].includes(awayTeamId)) {
    // Commanders vs other dark red teams
    return {
      homeTeamColor: homeTeamPrimary, // Commanders keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  // Blue teams
  if (homeTeamId === 'buf' && ['dal', 'ram', 'clt', 'nwe', 'sea', 'oti'].includes(awayTeamId)) {
    // Bills vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Bills keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'dal' && ['buf', 'ram', 'clt', 'nwe', 'sea', 'oti'].includes(awayTeamId)) {
    // Cowboys vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Cowboys keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'ram' && ['buf', 'dal', 'clt', 'nwe', 'sea', 'oti'].includes(awayTeamId)) {
    // Rams vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Rams keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'clt' && ['buf', 'dal', 'ram', 'nwe', 'sea', 'oti'].includes(awayTeamId)) {
    // Colts vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Colts keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'nwe' && ['buf', 'dal', 'ram', 'clt', 'sea', 'oti'].includes(awayTeamId)) {
    // Patriots vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Patriots keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'sea' && ['buf', 'dal', 'ram', 'clt', 'nwe', 'oti'].includes(awayTeamId)) {
    // Seahawks vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Seahawks keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  if (homeTeamId === 'oti' && ['buf', 'dal', 'ram', 'clt', 'nwe', 'sea'].includes(awayTeamId)) {
    // Titans vs other blue teams
    return {
      homeTeamColor: homeTeamPrimary, // Titans keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Other team uses secondary
    };
  }
  
  // Black teams
  if (homeTeamId === 'rai' && awayTeamId === 'pit') {
    // Raiders vs Steelers
    return {
      homeTeamColor: homeTeamPrimary, // Raiders keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Steelers use gold
    };
  }
  
  if (homeTeamId === 'pit' && awayTeamId === 'rai') {
    // Steelers vs Raiders
    return {
      homeTeamColor: homeTeamPrimary, // Steelers keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Raiders use silver
    };
  }
  
  // Dark blue/teal teams
  if (homeTeamId === 'htx' && awayTeamId === 'jax') {
    // Texans vs Jaguars
    return {
      homeTeamColor: homeTeamPrimary, // Texans keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Jaguars use teal
    };
  }
  
  if (homeTeamId === 'jax' && awayTeamId === 'htx') {
    // Jaguars vs Texans
    return {
      homeTeamColor: homeTeamPrimary, // Jaguars keep primary
      awayTeamColor: getTeamSecondaryColor(awayTeamId) // Texans use red
    };
  }
  
  // Default: both teams use primary colors
  return {
    homeTeamColor: homeTeamPrimary,
    awayTeamColor: awayTeamPrimary
  };
}


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