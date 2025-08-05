import warnings
from pandas.errors import PerformanceWarning
warnings.simplefilter(action='ignore', category=PerformanceWarning)

from utils import polite_sleep
from games_page.main import extract_player_urls_from_game_page
from teams_table.main import extract_game_links
from player_page.main import ETL_player_profile
from load import DatabaseLoader

if __name__ == "__main__":
    loader = DatabaseLoader()
    kan_2024_game_urls = extract_game_links('https://www.pro-football-reference.com/teams/kan/2024.htm')
    for game_url in kan_2024_game_urls:
        player_urls = extract_player_urls_from_game_page(game_url)
        for player_url in player_urls:
            ETL_player_profile(player_url, loader)
            polite_sleep(7,8)