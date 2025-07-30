from .ingest import get_urls_by_week_and_year, GamePageScraper
from .transform import GamePageTransformer
from .load import insert_game_info_df, insert_game_stats_df, insert_game_player_stats_df, insert_player_profile_df, get_all_db_game_urls
from player_page.ingest import PlayerPageScraper 
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST



def run(start_week, end_week):
    logged_urls = get_all_db_game_urls()
    for year in SEASONS_TEST:
        for week in WEEKS_TEST[start_week - 1 : end_week]:
            game_urls = get_urls_by_week_and_year(week, year)
            for url in game_urls:
                if url not in logged_urls:
                    ETL_game_page(url)
                else:    
                    print(f'{url} already logged. Skipping')


def ETL_game_page(url):
    print('Scraping for:', url)
    scraper = GamePageScraper(url)
    df_game_info = scraper.get_game_info()
    df_game_stats = scraper.get_game_stats()
    df_game_player_stats = scraper.get_game_player_stats()
    
    transformer = GamePageTransformer(df_game_info, df_game_stats, df_game_player_stats)
    df_game_info = transformer.transform_game_info_df()
    df_game_stats = transformer.transform_game_stats_df()
    df_game_player_stats = transformer.transform_player_stats_df()
    
    print('Inserting for:', url)
    insert_game_info_df(df_game_info)
    insert_game_stats_df(df_game_stats)
    insert_game_player_stats_df(df_game_player_stats) 
    
    player_ids = scraper.extract_player_ids()
    for player_id in player_ids:
        url = f'https://www.pro-football-reference.com/players/{player_id[0]}/{player_id}.htm'
        print('Scraping for:', url)
        player_scraper = PlayerPageScraper(player_id)
        df_player_profile = player_scraper.get_player_profile()
        insert_player_profile_df(df_player_profile)
        polite_sleep(7, 8)
        
    polite_sleep(7, 8)
    
    
