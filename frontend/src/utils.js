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