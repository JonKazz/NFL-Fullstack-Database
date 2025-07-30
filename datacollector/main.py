import warnings
from pandas.errors import PerformanceWarning

warnings.simplefilter(action='ignore', category=PerformanceWarning)

from games_page.main import run as run_games_page

if __name__ == "__main__":
    run_games_page(start_week=1, end_week=18)