import pandas as pd
import requests
from bs4 import BeautifulSoup, Comment
from config import SEASONS, TEAM_ABR
from .transform import playergame_mapping, stat_name_mapping
import utils

def get_team_roster_ids(team, season):
    url = f'https://www.pro-football-reference.com/teams/{team}/{season}_roster.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    player_ids = []

    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        table = BeautifulSoup(comment, 'html.parser').find('table', {'id': 'roster'})
        if table:
            for row in table.find('tbody').find_all('tr'):
                cell = row.find('td', {'data-stat': 'player'})
                if cell:
                    player_ids.append(cell.get('data-append-csv'))

    return player_ids


def scrape_player_game_logs(limit=None):
    player_ids = []
    for season in SEASONS:
        for team in TEAM_ABR:
            player_ids += get_team_roster_ids(team, season)
    if limit:
        player_ids = player_ids[:limit]
        player_ids = player_ids[::-1]
    
    
    df = pd.DataFrame()
    for player_id in player_ids:
        url = f'https://www.pro-football-reference.com/players/{player_id[0]}/{player_id}/gamelog/'
        print(f"Fetching {url}")
        try:
            player_df = pd.read_html(url, header=0, attrs={'id': 'stats'})[0]
            player_df['player_id'] = player_id
            transformed_df = playergame_mapping(player_df)
            df = pd.concat([df, transformed_df], ignore_index=True)
        except Exception as e:
            print(f"Error fetching {url}: {e}")
        utils.polite_sleep(7, 8)
    
    return df
