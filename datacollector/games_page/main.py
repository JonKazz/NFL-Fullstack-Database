from .ingest import get_urls_by_week_and_year, GamePageScraper
from .transform import GamePageTransformer
from load import get_all_db_game_urls, get_all_db_player_urls
from player_page.ingest import PlayerProfilePageScraper 
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST


def extract_player_urls_from_game_page(url):
    scraper = GamePageScraper()
    scraper.load_page(url)
    player_ids = scraper.extract_player_ids_from_game_page()
    urls = [f'https://www.pro-football-reference.com/players/{player_id[0]}/{player_id}.htm' for player_id in player_ids]
    return urls


def ETL_games_season_year(year: int, loader):
    logged_urls = get_all_db_game_urls()
    for week in WEEKS_TEST:
        game_urls = get_urls_by_week_and_year(week, year)
        for url in game_urls:
            if url not in logged_urls:
                ETL_game_page(url, loader)
            else:
                print(f'{url} already logged. Skipping')


def ETL_games_season_year_and_week(year: int, week: int, loader):
    logged_urls = get_all_db_game_urls()
    game_urls = get_urls_by_week_and_year(week, year)
    for url in game_urls:
        if url not in logged_urls:
            ETL_game_page(url, loader)
        else:
            print(f'{url} already logged. Skipping')


def ETL_game_page(url, loader):
    print('Scraping and inserting for:', url)
    scraper = GamePageScraper(url)
    df_game_info = scraper.get_game_info()
    df_team_stats = scraper.get_game_stats()
    df_player_stats = scraper.get_game_player_stats()
    
    transformer = GamePageTransformer(df_game_info, df_team_stats, df_player_stats)
    df_game_info = transformer.transform_game_info_df()
    df_team_stats = transformer.transform_game_stats_df()
    df_player_stats = transformer.transform_player_stats_df()
    
    loader.insert_game_info_df(df_game_info)
    loader.insert_game_stats_df(df_team_stats)
    loader.insert_game_player_stats_df(df_player_stats)     
    

    