import pandas as pd
pd.set_option('future.no_silent_downcasting', True)

import warnings
from pandas.errors import PerformanceWarning
warnings.simplefilter(action='ignore', category=PerformanceWarning)


from nfl_datacollector.config import DatabaseConfig
from scrapers.main import ETL_games_season_year
from load import DatabaseLoader

if __name__ == "__main__":
    config = DatabaseConfig.from_env()
    loader = DatabaseLoader(config)
    ETL_games_season_year(2022, loader)
