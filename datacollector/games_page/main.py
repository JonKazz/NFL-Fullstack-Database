from .ingest import get_urls_by_week_and_year, GameScraper
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST
from .transform import transform_game_info_table, transform_game_stats_table, transform_game_player_stats_table
from .load import insert_game_info_df, insert_game_stats_df, insert_game_player_stats_df, get_all_db_game_urls


def run(start_week, end_week):
    logged_urls = get_all_db_game_urls()
    for year in SEASONS_TEST:
        for week in WEEKS_TEST[start_week - 1 : end_week]:
            game_urls = get_urls_by_week_and_year(week, year)
            for url in game_urls:
                if url in logged_urls:
                    print(f'{url} already logged. Skipping')
                    continue
                
                print('Scraping for:', url)
                scraper = GameScraper(url)
                df_game_info = scraper.get_game_info()
                df_game_stats = scraper.get_game_stats()
                df_game_player_stats = scraper.get_game_player_stats()
                
                df_game_info = transform_game_info_table(df_game_info)
                df_game_stats = transform_game_stats_table(df_game_stats)
                df_game_player_stats = transform_game_player_stats_table(df_game_player_stats)
                
                print('Inserting for:', url)
                insert_game_info_df(df_game_info)
                insert_game_stats_df(df_game_stats)
                insert_game_player_stats_df(df_game_player_stats) 
                polite_sleep(7, 8)


def run(url):
    logged_urls = get_all_db_game_urls()
    if url in logged_urls:
        print(f'{url} already logged. Skipping')
        return

    print('Scraping for:', url)
    scraper = GameScraper(url)
    df_game_info = scraper.get_game_info()
    df_game_stats = scraper.get_game_stats()
    df_game_player_stats = scraper.get_game_player_stats()
    
    df_game_info = transform_game_info_table(df_game_info)
    df_game_stats = transform_game_stats_table(df_game_stats)
    df_game_player_stats = transform_game_player_stats_table(df_game_player_stats)
    
    print('Inserting for:', url)
    insert_game_info_df(df_game_info)
    insert_game_stats_df(df_game_stats)
    insert_game_player_stats_df(df_game_player_stats) 
    polite_sleep(7, 8)
