import pandas as pd
import requests
import utils
from bs4 import BeautifulSoup
from config import SEASONS, TEAM_ABR


def scrape_team_summary(team, season):
    url = f'https://www.pro-football-reference.com/teams/{team}/{season}.htm'
    print(f'Fetching: {url}')
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    summary_div = soup.find('div', {'data-template': 'Partials/Teams/Summary'})
    if not summary_div:
        print(f'Summary section not found for {team} {season}')
        return pd.DataFrame()

    logo_img = soup.find('img', class_='teamlogo')
    logo_src = logo_img['src'] if logo_img else None
    
    headers = {'Coach', 'Points For', 'Points Against', 'Record', 'Playoffs', 'Offensive Coordinator', 
               'Defensive Coordinator', 'Stadium', 'Offensive Scheme', 'Defensive Alignment'}
    data = {header: None for header in headers}
    
    for p in summary_div.find_all('p'):
        strong = p.find('strong')
        if strong:
            key = strong.text.strip(':')
            if key in headers:
                strong.extract()
                value = p.get_text(strip=True)
                data[key] = value

    data['logo'] = logo_src
    data['team_id'] = team
    data['year'] = season
    return pd.DataFrame([data])


def scrape_teams():
    teams_df = pd.DataFrame()
    for season in SEASONS:
        for team in TEAM_ABR:
            df = scrape_team_summary(team, season)
            teams_df = pd.concat([teams_df, df], ignore_index=True)
            utils.polite_sleep(7, 8)
            
    return teams_df
