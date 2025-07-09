# Database configuration
HOSTNAME = 'localhost'
DATABASE = 'postgres'
USERNAME = 'postgres'
PASSWORD = '2005'
PORT = 1234

# Scraping configuration
SEASONS = [str(season) for season in range(2024, 2025)]
TEAM_ABR = ['kan','atl']

# TEAM_ABR = [
#     'crd','atl','rav','buf','car','chi','cin','cle','dal','den','det','gnb','htx','clt','jax','kan',
#     'sdg','ram','rai','mia','min','nwe','nor','nyg','nyj','phi','pit','sea','sfo','tam','oti','was'
# ]

TEAM_NAME_MAP = {
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

TEAM_CITY_MAP = {
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
