from .ingest import extract_game_links, scrape_game_stats_table, scrape_game_info_table
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST

def run():
    for season in SEASONS_TEST:
        for week in WEEKS_TEST:
            url = f'https://www.pro-football-reference.com/years/{season}/week_{week}.htm'
            print(f'Fetching {url}')
            game_urls = extract_game_links(url)
            for url in game_urls:
                df_game_info = scrape_game_info_table(url, season, week)
                game_id = df_game_info['game_id'].iloc[0]
                df_game_stats = scrape_game_stats_table(url, game_id)
                
                print(df_game_stats)
                polite_sleep(7, 8)