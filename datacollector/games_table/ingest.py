import pandas as pd
import utils
from config import SEASONS, TEAM_ABR

def scrape_team_game_logs():
    games_df = pd.DataFrame()
    for season in SEASONS:
        for team in TEAM_ABR:
            url = f'https://www.pro-football-reference.com/teams/{team}/{season}/gamelog/'
            print(f'Fetching {url}')
            table_id_rs = 'table_pfr_team-year_game-logs_team-year-regular-season-game-log'
            table_id_playofss = 'table_pfr_team-year_game-logs_team-year-playoffs-game-log'
            try:
                df_rs = pd.read_html(url, header=1, attrs={'id': table_id_rs})[0]
                df_playoffs = pd.read_html(url, header=1, attrs={'id': table_id_playofss})[0]
                df = pd.concat([df_rs, df_playoffs], ignore_index=True)
                
                df['team_id'] = team
                df['year'] = season
                games_df = pd.concat([games_df, df], ignore_index=True)
            except Exception as e:
                print(f"Failed to fetch {url}: {e}")
                continue
            utils.polite_sleep(7, 8)
    return games_df
