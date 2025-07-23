# Database configuration
HOSTNAME = 'localhost'
DATABASE = 'postgres'
USERNAME = 'postgres'
PASSWORD = '2005'
PORT = 1234

# Scraping configuration
SEASONS = [str(season) for season in range(2024, 2025)]
WEEKS = [str(week) for week in range(1,19)]

SEASONS_TEST = ['2024']
WEEKS_TEST = ['1']
TEAM_ABR_TEST = ['kan', 'buf']

TEAM_ABR = [
    'crd','atl','rav','buf','car','chi','cin','cle','dal','den','det','gnb','htx','clt','jax','kan',
    'sdg','ram','rai','mia','min','nwe','nor','nyg','nyj','phi','pit','sea','sfo','tam','oti','was'
]

TEAMABR_TO_TEAMID_MAP = {
    "ARI": "crd",
    "ATL": "atl",
    "BAL": "rav",
    "BUF": "buf",
    "CAR": "car",
    "CHI": "chi",
    "CIN": "cin",
    "CLE": "cle",
    "DAL": "dal",
    "DEN": "den",
    "DET": "det",
    "GNB": "gnb",
    "HOU": "htx",
    "IND": "clt",
    "JAX": "jax",
    "KAN": "kan",
    "LAC": "sdg",
    "LAR": "ram",
    "LVR": "rai",
    "MIA": "mia",
    "MIN": "min",
    "NWE": "nwe",
    "NOR": "nor",
    "NYG": "nyg",
    "NYJ": "nyj",
    "PHI": "phi",
    "PIT": "pit",
    "SEA": "sea",
    "SFO": "sfo",
    "TAM": "tam",
    "TEN": "oti",
    "WAS": "was"
}

TEAMID_TO_TEAMNAME_MAP = {
    'crd': 'Arizona Cardinals',
    'atl': 'Atlanta Falcons',
    'rav': 'Baltimore Ravens',
    'buf': 'Buffalo Bills',
    'car': 'Carolina Panthers',
    'chi': 'Chicago Bears',
    'cin': 'Cincinnati Bengals',
    'cle': 'Cleveland Browns',
    'dal': 'Dallas Cowboys',
    'den': 'Denver Broncos',
    'det': 'Detroit Lions',
    'gnb': 'Green Bay Packers',
    'htx': 'Houston Texans',
    'clt': 'Indianapolis Colts',
    'jax': 'Jacksonville Jaguars',
    'kan': 'Kansas City Chiefs',
    'sdg': 'Los Angeles Chargers',
    'ram': 'Los Angeles Rams',
    'rai': 'Las Vegas Raiders',
    'mia': 'Miami Dolphins',
    'min': 'Minnesota Vikings',
    'nwe': 'New England Patriots',
    'nor': 'New Orleans Saints',
    'nyg': 'New York Giants',
    'nyj': 'New York Jets',
    'phi': 'Philadelphia Eagles',
    'pit': 'Pittsburgh Steelers',
    'sea': 'Seattle Seahawks',
    'sfo': 'San Francisco 49ers',
    'tam': 'Tampa Bay Buccaneers',
    'oti': 'Tennessee Titans',
    'was': 'Washington Commanders'
}

TEAMNAME_TO_TEAMID_MAP = {
    'Arizona Cardinals': 'crd',
    'Atlanta Falcons': 'atl',
    'Baltimore Ravens': 'rav',
    'Buffalo Bills': 'buf',
    'Carolina Panthers': 'car',
    'Chicago Bears': 'chi',
    'Cincinnati Bengals': 'cin',
    'Cleveland Browns': 'cle',
    'Dallas Cowboys': 'dal',
    'Denver Broncos': 'den',
    'Detroit Lions': 'det',
    'Green Bay Packers': 'gnb',
    'Houston Texans': 'htx',
    'Indianapolis Colts': 'clt',
    'Jacksonville Jaguars': 'jax',
    'Kansas City Chiefs': 'kan',
    'Los Angeles Chargers': 'sdg',
    'Los Angeles Rams': 'ram',
    'Las Vegas Raiders': 'rai',
    'Miami Dolphins': 'mia',
    'Minnesota Vikings': 'min',
    'New England Patriots': 'nwe',
    'New Orleans Saints': 'nor',
    'New York Giants': 'nyg',
    'New York Jets': 'nyj',
    'Philadelphia Eagles': 'phi',
    'Pittsburgh Steelers': 'pit',
    'Seattle Seahawks': 'sea',
    'San Francisco 49ers': 'sfo',
    'Tampa Bay Buccaneers': 'tam',
    'Tennessee Titans': 'oti',
    'Washington Commanders': 'was'
}

TEAMID_TO_CITY_MAP = {
    'crd': 'Arizona',
    'atl': 'Atlanta',
    'rav': 'Baltimore',
    'buf': 'Buffalo',
    'car': 'Carolina',
    'chi': 'Chicago',
    'cin': 'Cincinnati',
    'cle': 'Cleveland',
    'dal': 'Dallas',
    'den': 'Denver',
    'det': 'Detroit',
    'gnb': 'Green Bay',
    'htx': 'Houston',
    'clt': 'Indianapolis',
    'jax': 'Jacksonville',
    'kan': 'Kansas City',
    'sdg': 'Los Angeles',
    'ram': 'Los Angeles',
    'rai': 'Las Vegas',
    'mia': 'Miami',
    'min': 'Minnesota',
    'nwe': 'New England',
    'nor': 'New Orleans',
    'nyg': 'New York',
    'nyj': 'New York',
    'phi': 'Philadelphia',
    'pit': 'Pittsburgh',
    'sea': 'Seattle',
    'sfo': 'San Francisco',
    'tam': 'Tampa Bay',
    'oti': 'Tennessee',
    'was': 'Washington'
}

