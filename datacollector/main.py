import warnings
from pandas.errors import PerformanceWarning

warnings.simplefilter(action='ignore', category=PerformanceWarning)

from games_page.main import ETL_games_season_year 
from load import DatabaseLoader

if __name__ == "__main__":
    loader = DatabaseLoader()
    for year in [2024]:
        ETL_games_season_year(year, loader)