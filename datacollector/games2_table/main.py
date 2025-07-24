from .ingest import extract_game_links, scrape_game_stats_table, scrape_game_info_table
from utils import polite_sleep
from config import SEASONS_TEST, WEEKS_TEST
from .transform import transform_game_info_table, transform_game_stats_table
from .load import insert_game_info_df, insert_game_stats_df

def scrape_tables(url, season, week):
    df_game_info = scrape_game_info_table(url, season, week)
    game_id = df_game_info['game_id'].iloc[0]
    df_game_stats = scrape_game_stats_table(url, game_id)
    return df_game_info, df_game_stats
    
def run(start_week, end_week):
    for season in SEASONS_TEST:
        for week in WEEKS_TEST[start_week - 1 : end_week - 1]:
            url = f'https://www.pro-football-reference.com/years/{season}/week_{week}.htm'
            print(f'Fetching {url}')
            game_urls = extract_game_links(url)
            for url in game_urls:
                print('Scraping for: ', url)
                df_game_info, df_game_stats = scrape_tables(url, season, week)
                df_game_info = transform_game_info_table(df_game_info)
                df_game_stats = transform_game_stats_table(df_game_stats)
                print('Inserting for: ', url)
                insert_game_info_df(df_game_info)
                insert_game_stats_df(df_game_stats)
                polite_sleep(7, 8)