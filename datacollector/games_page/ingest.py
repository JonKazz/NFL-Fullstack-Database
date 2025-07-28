import pandas as pd
import requests
from config import TEAMNAME_TO_TEAMID_MAP, TEAMABR_TO_TEAMID_MAP
from bs4 import BeautifulSoup, Comment, Tag

LINESCORE_TABLE_CLASSID = 'linescore nohover stats_table no_freeze'
GAME_INFO_TABLE_ID = 'game_info'
TEAM_STATS_TABLE_ID = 'team_stats'
GAME_SUMMARIES_CLASSID = 'game_summaries'
GAME_LINK_CLASSID = 'right gamelink'
GAME_SUMMARIES_COMPRESSED_CLASSID = 'game_summaries compressed'
SCOREBOX_META_CLASSID = 'scorebox_meta'

GENERAL_OFFENSIVE_STATS_TABLE_ID = 'player_offense'
GENERAL_DEFENSIVE_STATS_TABLE_ID = 'player_defense'
RETURN_STATS_TABLE_ID = 'returns'
KICKING_STATS_TABLE_ID = 'kicking'
PASSING_ADVANCED_TABLE_ID = 'passing_advanced'
RUSHING_ADVANCED_TABLE_ID = 'rushing_advanced'
RECEIVING_ADVANCED_TABLE_ID = 'receiving_advanced'
DEFENSIVE_ADVANCED_TABLE_ID = 'defense_advanced'

PLAYER_STATS_TABLE_IDS_LIST = ['player_offense', 'player_defense', 'returns', 'kicking', 'passing_advanced', 
                              'rushing_advanced', 'receiving_advanced', 'defense_advanced']

def get_urls_by_week_and_year(week, year) -> list[str]:
    url = f'https://www.pro-football-reference.com/years/{year}/week_{week}.htm'
    res = requests.get(url)
    soup = BeautifulSoup(res.content, 'html.parser')

    links = []
    game_summaries = soup.find('div', class_=GAME_SUMMARIES_CLASSID)
    if not game_summaries:
        raise ValueError(f'[!] Cannot find div of class={GAME_SUMMARIES_CLASSID} at {url}')
    
    game_links = game_summaries.find_all('td', class_=GAME_LINK_CLASSID)
    if game_links is None:
        raise ValueError(f'Cannot find table-data of class={GAME_LINK_CLASSID} at {url}')
    
    for td in game_links:
        a_tag = td.find('a')
        if not a_tag or not 'href' in a_tag.attrs:
            raise ValueError(f'Cannot find link at table-data class={GAME_LINK_CLASSID}')
        full_url = 'https://www.pro-football-reference.com' + a_tag['href']
        links.append(full_url)
    return links
    
    
class GameScraper:
    def __init__(self, url: str):
        self.url = url
        self.html = requests.get(url)
        self.soup = BeautifulSoup(self.html.text, 'html.parser')
        self.game_stats_df = pd.DataFrame()
        self.game_info_df = dict()
        self.game_player_stats_df = pd.DataFrame()
        
        
    def get_game_info(self, season, week) -> pd.DataFrame:
        self._parse_game_info_table()
        self._parse_scorebox()
        self._parse_linescore_general_info()
        self._create_game_id(season, week) 
        return pd.DataFrame([self.game_info_df])


    def get_game_stats(self) -> pd.DataFrame:
        self._parse_team_stats_table()
        self._parse_linescore_stats()
        self.game_stats_df['game_id'] = self.game_info_df['game_id']
        return self.game_stats_df
    
    
    def get_game_player_stats(self) -> pd.DataFrame:
        self._parse_general_offensive_stats()
        self._parse_general_defensive_stats()
        self._parse_advanced_passing_player_stats()
        self._parse_advanced_rushing_player_stats()
        self._parse_advanced_defensive_player_stats()
        self.game_player_stats_df['game_id'] = self.game_info_df['game_id']
        return self.game_player_stats_df
    
    
    def _scrape_comments_for_table(self, table_id: str) -> Tag:    
        comments = self.soup.find_all(string=lambda text: isinstance(text, Comment))
        for c in comments:
            if 'table' in c and table_id in c:
                table = BeautifulSoup(c, 'html.parser').find('table', id=table_id)
                if table:
                    break
        else:
            raise ValueError(f'[!] Table with id: ({table_id}) not found in comments.')
        return table
    
    
    def _extract_table(self, table_id: str) -> Tag:    
        table = self.soup.find('table', id=table_id)
        if table:
            return table
        
        # Table might be concealed in comments
        comments = self.soup.find_all(string=lambda text: isinstance(text, Comment))
        for c in comments:
            if 'table' in c and table_id in c:
                table = BeautifulSoup(c, 'html.parser').find('table', id=table_id)
                if table:
                    break
        else:
            raise ValueError(f'[!] Table with id: ({table_id}) not found in comments.')
        return table


    def _create_game_id(self, season, week) -> None:
        self.game_info_df['season_year'] = season
        self.game_info_df['season_week'] = week
        self.game_info_df['game_id'] = (
            str(self.game_info_df['season_year']) + "_" +
            self.game_info_df['home_team_id'] + "_" +
            self.game_info_df['away_team_id'] + "_" +
            str(self.game_info_df['season_week'])
        )
        
        
    def _parse_team_stats_table(self) -> None:
        table = self._scrape_comments_for_table(TEAM_STATS_TABLE_ID)
        rows = table.find_all('tr')
        if not rows:
            raise ValueError('[!] Malformed TeamStats table: No rows found')
        
        headers = rows[0].find_all('th')
        team_ids = [
            TEAMABR_TO_TEAMID_MAP[th.get_text(strip=True)]
            for th in headers[1:3]
        ]
        
        self.game_stats_df = pd.DataFrame({'team_id': team_ids})

        for idx, team_id in enumerate(team_ids):
            for row in rows[1:]:
                stat_name = row.find('th', {'data-stat': 'stat'}).get_text(strip=True)
                stat_val = row.find_all('td')[idx].get_text(strip=True)
                self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, stat_name] = stat_val


    def _parse_linescore_stats(self) -> None:
        table = self.soup.find('table', class_=LINESCORE_TABLE_CLASSID)
        if table is None:
            raise ValueError(f'[!] Linescore table with id: ({LINESCORE_TABLE_CLASSID}) not found.')
            
        rows = table.find('tbody').find_all('tr')
        if len(rows) != 2:
            raise ValueError(f'[!] Malformed linescore table: {len(rows)} rows found.')
        
        for i, row in enumerate(rows):
            cells = row.find_all('td')
            if len(cells) not in [7, 8]:
                raise ValueError(f'[!] Malformed linescore table: {len(cells)} cells found at row {i}.')

            team_name_raw = cells[1].get_text(strip=True)
            team_id = TEAMNAME_TO_TEAMID_MAP.get(team_name_raw)
            if not team_id:
                raise ValueError(f"[!] Malformed linescore table: Unknown team: {team_name_raw}")

            scores = [cells[i].get_text(strip=True) for i in range(2, len(cells))]
            scores = [int(val) if val.isdigit() else None for val in scores]

            self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_q1'] = scores[0]
            self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_q2'] = scores[1]
            self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_q3'] = scores[2]
            self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_q4'] = scores[3]
            self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_total'] = scores[-1]

            if len(scores) == 6: # Only triggers if linescore table shows overtime
                self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_overtime'] = scores[4]
            else:
                self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, 'points_overtime'] = 0


    def _parse_game_info_table(self) -> None:
        table = self._scrape_comments_for_table(GAME_INFO_TABLE_ID)
        
        rows = table.find_all('tr')
        if not rows:
            raise ValueError(f'[!] Malformed GameInfo table: No rows found at id: {GAME_INFO_TABLE_ID}')
        
        for i, row in enumerate(rows[1:]):
            header_raw = row.find('th')
            value_raw = row.find('td')
            
            if header_raw is None or value_raw is None:
                raise ValueError(f'[!] Malformed GameInfo table: Value missing at row {i}')
            
            header = header_raw.get_text(strip=True)
            value = value_raw.get_text(strip=True)
            self.game_info_df[header] = value


    def _parse_scorebox(self) -> None:
        scorebox_div = self.soup.find('div', class_=SCOREBOX_META_CLASSID)
        if scorebox_div is None:
            raise ValueError(f'[!] Scorebox not found at id: {SCOREBOX_META_CLASSID}')
        
        meta_divs = scorebox_div.find_all('div')
        if not meta_divs:
            raise ValueError(f'[!] Malformed scorebox: missing all divs')
        
        meta_labels = ['date', 'start_time', 'stadium']
        for i, label in enumerate(meta_labels):
            if i < len(meta_divs):
                self.game_info_df[label] = meta_divs[i].get_text(strip=True)
    
    
    def _parse_linescore_general_info(self) -> None:
        table = self.soup.find('table', class_=LINESCORE_TABLE_CLASSID)
        if table is None:
            raise ValueError(f'[!] Linescore table with id: ({LINESCORE_TABLE_CLASSID}) not found.')
        
        rows = table.find('tbody').find_all('tr')
        if len(rows) != 2:
            raise ValueError(f'[!] Malformed linescore table: {len(rows)} rows found.')
        
        away_team_row = rows[0].find_all('td')
        home_team_row = rows[1].find_all('td')
        away_team_name = away_team_row[1].get_text(strip=True)
        home_team_name = home_team_row[1].get_text(strip=True)
        away_team_id = TEAMNAME_TO_TEAMID_MAP.get(away_team_name)
        home_team_id = TEAMNAME_TO_TEAMID_MAP.get(home_team_name)

        if not away_team_id or not home_team_id:
            raise ValueError(f"[!] Unknown team name(s): away='{away_team_name}', home='{home_team_name}'")

        self.game_info_df['away_team_id'] = away_team_id
        self.game_info_df['home_team_id'] = home_team_id

        away_points = away_team_row[-1].get_text(strip=True)
        home_points = home_team_row[-1].get_text(strip=True)
        if not away_points.isdigit() or not home_points.isdigit():
            raise ValueError(f"[!] Invalid final scores: away='{away_points}', home='{home_points}'")

        self.game_info_df['winning_team_id'] = (
            home_team_id if int(home_points) > int(away_points) else away_team_id
        )
        self.game_info_df['overtime'] = len(away_team_row) == 8
    
    
    def _validate_and_insert_player_stat(self, player_id: str, stat_name: str, stat_value: str) -> None:
        # If player_id doesn't exist, add a new row with player_id
        if ('player_id' not in self.game_player_stats_df.columns or 
             player_id not in self.game_player_stats_df['player_id'].values):
            self.game_player_stats_df = pd.concat(
                [self.game_player_stats_df, pd.DataFrame([{'player_id': player_id}])],
                ignore_index=True
            )

        # If stat_name column doesn't exist, create it (fill with NA)
        if stat_name not in self.game_player_stats_df.columns:
            self.game_player_stats_df[stat_name] = pd.NA

        existing_value_series = self.game_player_stats_df.loc[
            self.game_player_stats_df['player_id'] == player_id, stat_name
        ]

        # If value already exists and is not NA, validate that its the same value
        if not existing_value_series.empty:
            existing_value = existing_value_series.iloc[0]
            if pd.isna(existing_value):
                self.game_player_stats_df.loc[
                    self.game_player_stats_df['player_id'] == player_id, stat_name
                ] = stat_value
            elif existing_value != stat_value:
                raise ValueError(
                    f"[!] Mismatched value for player_id={player_id}, stat='{stat_name}': "
                    f"existing='{existing_value}' vs new='{stat_value}'"
                )    
    
    
    def _parse_player_stats_table(self, table: Tag) -> None:
        rows = table.find_all('tr')
        if not rows:
            raise ValueError('[!] Malformed PlayerStats table: No rows found')

        for row in rows:
            player_cell = row.find('th')
            player_id = player_cell.get('data-append-csv')
            if not player_id: # Likely a header row
                continue

            stats = row.find_all('td')
            for stat in stats:
                stat_name = stat.get('data-stat')
                stat_value = stat.get_text(strip=True)
                self._validate_and_insert_player_stat(player_id, stat_name, stat_value)

    
    def _parse_general_offensive_stats(self) -> None:
        table = self._extract_table(GENERAL_OFFENSIVE_STATS_TABLE_ID)
        self._parse_player_stats_table(table)
        
    def _parse_general_defensive_stats(self) -> None:
        table = self._extract_table(GENERAL_DEFENSIVE_STATS_TABLE_ID)
        self._parse_player_stats_table(table)
    
    def _parse_return_stats(self) -> None:
        table = self._extract_table(RETURN_STATS_TABLE_ID)
        self._parse_player_stats_table(table)
    
    def _parse_kicking_stats(self) -> None:
        table = self._extract_table(KICKING_STATS_TABLE_ID)
        self._parse_player_stats_table(table)
    
    def _parse_advanced_passing_player_stats(self) -> None:
        table = self._extract_table(PASSING_ADVANCED_TABLE_ID)
        self._parse_player_stats_table(table)
        
    def _parse_advanced_rushing_player_stats(self) -> None:
        table = self._extract_table(RUSHING_ADVANCED_TABLE_ID)
        self._parse_player_stats_table(table)
    
    def _parse_advanced_receiving_player_stats(self) -> None:
        table = self._extract_table(RECEIVING_ADVANCED_TABLE_ID)
        self._parse_player_stats_table(table)
    
    def _parse_advanced_defensive_player_stats(self) -> None:
        table = self._extract_table(DEFENSIVE_ADVANCED_TABLE_ID)
        self._parse_player_stats_table(table)
    
        
    