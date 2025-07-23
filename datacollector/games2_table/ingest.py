import pandas as pd
import utils
import requests
from config import SEASONS_TEST, WEEKS_TEST, TEAMNAME_TO_TEAMID_MAP, TEAMABR_TO_TEAMID_MAP
from bs4 import BeautifulSoup, Comment

LINESCORE_TABLE_CLASSID = 'linescore nohover stats_table no_freeze'
GAME_INFO_TABLE_ID = 'game_info'
TEAM_STATS_TABLE_ID = 'team_stats'
GAME_SUMMARIES_CLASSID = 'game_summaries'
GAME_LINK_CLASSID = 'right gamelink'
GAME_SUMMARIES_COMPRESSED_CLASSID = 'game_summaries compressed'
SCOREBOX_META_CLASSID = 'scorebox_meta'

def scrape_game_stats_table(url, game_id):
    html = requests.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    df_team_stats = parse_team_stats_table(soup)
    df_linescore = parse_linescore_table(soup)
    df_game_stats = pd.merge(df_team_stats, df_linescore, on='team_id')
    df_game_stats['game_id'] = game_id
    return df_game_stats


def scrape_game_info_table(url, season, week):
    html = requests.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    df_game_info = parse_game_info_table(soup)
    df_game_info = create_game_id(df_game_info, season, week)
    return df_game_info


def extract_game_links(url):
    res = requests.get(url)
    soup = BeautifulSoup(res.content, 'html.parser')

    links = []
    game_summaries = soup.find('div', class_=GAME_SUMMARIES_CLASSID)
    if game_summaries:
        game_links = game_summaries.find_all('td', class_=GAME_LINK_CLASSID)
        for td in game_links:
            a_tag = td.find('a')
            if a_tag and 'href' in a_tag.attrs:
                full_url = 'https://www.pro-football-reference.com' + a_tag['href']
                links.append(full_url)
    return links


def parse_team_stats_table(soup):
    comments = soup.find_all(string=lambda text: isinstance(text, Comment))
    table = None
    for c in comments:
        if 'table' in c and TEAM_STATS_TABLE_ID in c:
            try:
                comment_soup = BeautifulSoup(c, 'html.parser')
                table = comment_soup.find('table', id=TEAM_STATS_TABLE_ID)
                if table:
                    break
            except Exception:
                continue

    if table is None:
        raise ValueError(f"[!] {TEAM_STATS_TABLE_ID} table not found in comments.")

    rows = table.find_all('tr')
    headers = rows[0].find_all('th')
    team_ids = [TEAMABR_TO_TEAMID_MAP[th.get_text(strip=True)] for th in headers[1:3]]

    data = []
    for idx, team_id in enumerate(team_ids):
        team_data = {'team_id': team_id}
        for row in rows[1:]:
            stat_name = row.find('th', {'data-stat': 'stat'}).get_text(strip=True)
            stat_val = row.find_all('td')[idx].get_text(strip=True)
            team_data[stat_name] = stat_val
        data.append(team_data)

    df_team_stats = pd.DataFrame(data)
    return df_team_stats


def parse_linescore_table(soup):
    table = soup.find('table', class_=LINESCORE_TABLE_CLASSID)
    if not table:
        raise ValueError(f"[!] linescore table not found.")

    rows = table.find('tbody').find_all('tr')
    data = []

    for i, row in enumerate(rows):
        cells = row.find_all('td')
        if len(cells) < 7:
            raise ValueError(f"[!]Malformed row at index {i} in linescore table.")

        team_name_raw = cells[1].get_text(strip=True)
        team_name = TEAMNAME_TO_TEAMID_MAP[team_name_raw]
        q1 = cells[2].get_text(strip=True)
        q2 = cells[3].get_text(strip=True)
        q3 = cells[4].get_text(strip=True)
        q4 = cells[5].get_text(strip=True)
        total = cells[6].get_text(strip=True)

        for label, val in zip(['Q1', 'Q2', 'Q3', 'Q4', 'Total'], [q1, q2, q3, q4, total]):
            if not val.isdigit():
                raise ValueError(f"[!] {label} value '{val}' for team '{team_name_raw}' is not a digit in linescore table.")

        data.append({
            'team_id': team_name,
            'points_q1': int(q1),
            'points_q2': int(q2),
            'points_q3': int(q3),
            'points_q4': int(q4),
            'points_total': int(total)
        })

    return pd.DataFrame(data)



def parse_game_info_table(soup):
    comments = soup.find_all(string=lambda text: isinstance(text, Comment))
    table = None
    for c in comments:
        if 'table' in c and GAME_INFO_TABLE_ID in c:
            try:
                comment_soup = BeautifulSoup(c, 'html.parser')
                table = comment_soup.find('table', id=GAME_INFO_TABLE_ID)
                if table:
                    break
            except Exception:
                continue

    if table is None:
        raise ValueError(f"[!] {GAME_INFO_TABLE_ID} table not found in comments.")

    rows = table.find_all('tr')
    game_info = {}

    for row in rows:
        header = row.find('th')
        value = row.find('td')
        if header and value:
            key = header.get_text(strip=True)
            val = value.get_text(strip=True)
            game_info[key] = val

    # Extract additional info from scorebox_meta
    scorebox_meta = soup.find('div', class_=SCOREBOX_META_CLASSID)
    if scorebox_meta:
        meta_divs = scorebox_meta.find_all('div')
        meta_labels = ['date', 'start_time', 'stadium']
        for i, label in enumerate(meta_labels):
            if i < len(meta_divs):
                game_info[label] = meta_divs[i].get_text(strip=True)


    # Extract home and away team IDs from linescore table
    linescore_table = soup.find('table', class_=LINESCORE_TABLE_CLASSID)
    if linescore_table:
        rows = linescore_table.find('tbody').find_all('tr')
        if len(rows) >= 2:
            away_team_raw = rows[0].find_all('td')[1].get_text(strip=True)
            home_team_raw = rows[1].find_all('td')[1].get_text(strip=True)
            away_team = TEAMNAME_TO_TEAMID_MAP[away_team_raw]
            home_team = TEAMNAME_TO_TEAMID_MAP[home_team_raw]
            game_info['away_team_id'] = away_team
            game_info['home_team_id'] = home_team

            # Get points_total for each team
            away_points = int(rows[0].find_all('td')[6].get_text(strip=True))
            home_points = int(rows[1].find_all('td')[6].get_text(strip=True))
            if home_points > away_points:
                game_info['winning_team_id'] = home_team
            elif away_points > home_points:
                game_info['winning_team_id'] = away_team
            else:
                game_info['winning_team_id'] = None 

    df_game_info = pd.DataFrame([game_info])
    return df_game_info


def create_game_id(df: pd.DataFrame, season, week) -> pd.DataFrame:
    df['season_year'] = season
    df['season_week'] = week
    required_columns = {'season_week', 'season_year', 'home_team_id', 'away_team_id'}
    missing = required_columns - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    
    week = df['season_week'].astype(str)
    year = df['season_year'].astype(str)
    home_team_id = df['home_team_id']
    away_team_id = df['away_team_id']
    df['game_id'] = year + "_" + home_team_id + "_" + away_team_id + "_" + week
    return df