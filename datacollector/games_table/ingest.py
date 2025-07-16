import pandas as pd
import utils
from config import SEASONS, TEAM_ABR

def scrape_team_game_logs():
    games_df = pd.DataFrame()
    for season in SEASONS:
        for team in TEAM_ABR:
            url = f'https://www.pro-football-reference.com/teams/{team}/{season}/gamelog/'
            print(f"Fetching {url}")
            table_id = "table_pfr_team-year_game-logs_team-year-regular-season-game-log"
            try:
                df = pd.read_html(url, header=1, attrs={'id': table_id})[0]
                df['team_id'] = team
                df['year'] = season
                games_df = pd.concat([games_df, df], ignore_index=True)
            except Exception as e:
                print(f"Failed to fetch {url}: {e}")
                continue
            utils.polite_sleep(7, 8)
    return games_df
