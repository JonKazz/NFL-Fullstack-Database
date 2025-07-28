from .ingest import get_urls_by_week_and_year, GameScraper
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST
from .transform import transform_game_info_table, transform_game_stats_table
from .load import insert_game_info_df, insert_game_stats_df

def scrape_tables(url, year , week):
    scraper = GameScraper(url)
    df_game_info = scraper.get_game_info(year, week)
    df_game_stats = scraper.get_game_stats()
    df_game_player_stats = scraper.get_game_player_stats()
    return df_game_info, df_game_stats, df_game_player_stats

def run(start_week, end_week):
    for year in SEASONS_TEST:
        for week in WEEKS_TEST[start_week - 1 : end_week]:
            game_urls = get_urls_by_week_and_year(week, year)
            for url in game_urls:
                print('Scraping for:', url)
                df_game_info, df_game_stats, df_game_player_stats = scrape_tables(url, year, week)
                df_game_info = transform_game_info_table(df_game_info)
                df_game_stats = transform_game_stats_table(df_game_stats)
            
                print(f'PlayerStats columns: {df_game_player_stats.columns}')
                print(df_game_player_stats)
                
                print('Inserting for:', url)
                insert_game_info_df(df_game_info)
                insert_game_stats_df(df_game_stats)
                polite_sleep(7, 8)
