import pandas as pd
import requests
import re
from config import TEAMABR_TO_TEAMID_MAP
from bs4 import BeautifulSoup, Comment, Tag

SEASON_WEEK_SCORES_DIV_ID = 'div_other_scores'
SCOREBOX_DIV_ID = 'scorebox_meta'

LINESCORE_TABLE_CLASSID = 'linescore nohover stats_table no_freeze'
GAME_INFO_TABLE_ID = 'game_info'
TEAM_STATS_TABLE_ID = 'team_stats'
GAME_SUMMARIES_CLASSID = 'game_summaries'
GAME_LINK_CLASSID = 'right gamelink'

GENERAL_OFFENSIVE_STATS_TABLE_ID = 'player_offense'
GENERAL_DEFENSIVE_STATS_TABLE_ID = 'player_defense'
RETURN_STATS_TABLE_ID = 'returns'
KICKING_STATS_TABLE_ID = 'kicking'
PASSING_ADVANCED_TABLE_ID = 'passing_advanced'
RUSHING_ADVANCED_TABLE_ID = 'rushing_advanced'
RECEIVING_ADVANCED_TABLE_ID = 'receiving_advanced'
DEFENSIVE_ADVANCED_TABLE_ID = 'defense_advanced'
SNAPCOUNT_HOME_TEAM_TABLE_ID = 'home_snap_counts'
SNAPCOUNT_VISITING_TEAM_TABLE_ID = 'vis_snap_counts'

PLAYER_GENERAL_STATS_TABLE_IDS_LIST = [GENERAL_OFFENSIVE_STATS_TABLE_ID, GENERAL_DEFENSIVE_STATS_TABLE_ID, RETURN_STATS_TABLE_ID, 
                                       KICKING_STATS_TABLE_ID]

PLAYER_ADVANCED_STATS_TABLE_IDS_LIST = [PASSING_ADVANCED_TABLE_ID, RUSHING_ADVANCED_TABLE_ID, RECEIVING_ADVANCED_TABLE_ID, 
                                        DEFENSIVE_ADVANCED_TABLE_ID, SNAPCOUNT_HOME_TEAM_TABLE_ID, SNAPCOUNT_VISITING_TEAM_TABLE_ID]

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
    
    
    
    
class GamePageScraper:
    def __init__(self, url: str):
        html = requests.get(url)
        self.soup = BeautifulSoup(html.text, 'html.parser')
        self.game_stats_df = pd.DataFrame()
        self.game_info_df = {'url': url}
        self.game_player_stats_df = pd.DataFrame()
        self.game_id = self._create_game_id()
        
    
    def get_game_info(self) -> pd.DataFrame:
        self._parse_game_info_table()
        self._parse_scorebox()
        self._parse_linescore_general_info()
        self.game_info_df['game_id'] = self.game_id
        return pd.DataFrame([self.game_info_df])


    def get_game_stats(self) -> pd.DataFrame:
        self._parse_team_stats_table()
        self._parse_linescore_stats()
        self.game_stats_df['game_id'] = self.game_id
        return self.game_stats_df
    
    
    def get_game_player_stats(self) -> pd.DataFrame:
        self._parse_player_stats() 
        self.game_player_stats_df['game_id'] = self.game_id
        return self.game_player_stats_df
    
    
    
    # ---------------------------------------------
    # Helper Methods
    # ---------------------------------------------
    def _extract_table(self, table_id_or_class: str) -> Tag:
        table = self.soup.find('table', id=table_id_or_class) # Searching for table_id
        if table:
            return table

        table = self.soup.find('table', class_=table_id_or_class) # Searching for table class
        if table:
            return table

        # If not found, look through HTML comments
        comments = self.soup.find_all(string=lambda text: isinstance(text, Comment))
        for c in comments:
            if 'table' in c and table_id_or_class in c:
                parsed = BeautifulSoup(c, 'html.parser')
                table = parsed.find('table', id=table_id_or_class)
                if table:
                    return table
                table = parsed.find('table', class_=table_id_or_class)
                if table:
                    return table

        return None
        

    def _extract_div(self, div_id: str) -> Tag:
        div = self.soup.find('div', id=div_id)
        if div:
            return div

        div = self.soup.find('div', class_=div_id)
        if div:
            return div
        
        # If not found, look through HTML comments
        comments = self.soup.find_all(string=lambda text: isinstance(text, Comment))
        for c in comments:
            if div_id in c:
                comment_soup = BeautifulSoup(c, 'html.parser')
                
                div = comment_soup.find('div', id=div_id)
                if div:
                    return div
                
                div = comment_soup.find('div', class_=div_id)
                if div:
                    return div

        raise ValueError(f'[!] div with id/class = ({div_id}) not found')
    
    
    def _create_game_id(self) -> str:
        home_team_id, away_team_id = self._extract_team_ids()
        season_week, season_year = self._extract_season_week_and_year()
        game_id = str(season_year) + '_' + home_team_id + '_' + away_team_id + '_' + str(season_week)
        return game_id
            
    
    def _extract_season_week_and_year(self) -> tuple[int, int]:
        div = self._extract_div(SEASON_WEEK_SCORES_DIV_ID)
        
        h2 = div.find('h2')
        if not h2:
            raise ValueError(f'No <h2> found inside the div id={SEASON_WEEK_SCORES_DIV_ID}')
        
        a_tag = h2.find('a')
        if not a_tag or not a_tag.has_attr('href'):
            raise ValueError('No <a> tag with href found inside <h2>')
        
        href = a_tag['href'] # e.g., "/years/2022/week_15.htm"
        match = re.search(r'/years/(\d{4})/week_(\d+)\.htm', href)
        if not match:
            raise ValueError(f'Unexpected href format: {href} for season_week_scores div')

        year = int(match.group(1))
        week = int(match.group(2))
        
        return week, year
    
    
    def _extract_team_ids(self) -> tuple[str, str]:
        table = self._extract_table(LINESCORE_TABLE_CLASSID)
        if table is None:
            return
        
        rows = table.find('tbody').find_all('tr')
        if len(rows) != 2:
            raise ValueError(f'[!] Malformed linescore table: {len(rows)} rows found.')
        
        away_team_row = rows[0].find_all('td')
        home_team_row = rows[1].find_all('td')
        
        away_team_link = away_team_row[1].find('a')
        home_team_link = home_team_row[1].find('a')
        
        if not away_team_link or not home_team_link:
            raise ValueError(f"[!] Could not find team links in linescore table")
        
        away_team_href = away_team_link['href']
        home_team_href = home_team_link['href']
        
        away_team_id = away_team_href.split('/')[2].split('.')[0]
        home_team_id = home_team_href.split('/')[2].split('.')[0]
        
        if not away_team_id or not home_team_id:
            raise ValueError(f"[!] Could not extract team IDs from hrefs: away='{away_team_href}', home='{home_team_href}'")
        
        return home_team_id, away_team_id
        
        
    
    # ---------------------------------------------
    # GameInfo Methods
    # ---------------------------------------------
    def _parse_game_info_table(self) -> None:
        table = self._extract_table(GAME_INFO_TABLE_ID)
        if table is None:
            raise ValueError(f'[!] GameInfo table with id/class: ({GAME_INFO_TABLE_ID}) not found')
        
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
        scorebox_div = self._extract_div(SCOREBOX_DIV_ID)
        
        meta_divs = scorebox_div.find_all('div')
        if not meta_divs:
            raise ValueError(f'[!] Malformed scorebox: missing all divs')
        
        meta_labels = ['date', 'start_time', 'stadium']
        for i, label in enumerate(meta_labels):
            if i < len(meta_divs):
                self.game_info_df[label] = meta_divs[i].get_text(strip=True)
    
    
    def _parse_linescore_general_info(self) -> None:
        table = self._extract_table(LINESCORE_TABLE_CLASSID)
        if table is None:
            raise ValueError(f'[!] Linescore table with id/class: ({GAME_INFO_TABLE_ID}) not found')
        
        rows = table.find('tbody').find_all('tr')
        if len(rows) != 2:
            raise ValueError(f'[!] Malformed linescore table: {len(rows)} rows found.')
    
        
        away_team_row = rows[0].find_all('td')
        home_team_row = rows[1].find_all('td')
        away_points = away_team_row[-1].get_text(strip=True)
        home_points = home_team_row[-1].get_text(strip=True)
        self.game_info_df['away_points'] = away_points
        self.game_info_df['home_points'] = home_points

        home_team_id = self.game_id.split('_')[1]
        away_team_id = self.game_id.split('_')[2]
        self.game_info_df['away_team_id'] = away_team_id
        self.game_info_df['home_team_id'] = home_team_id
        
        self.game_info_df['winning_team_id'] = (
            home_team_id if int(home_points) > int(away_points) else away_team_id
        )
        self.game_info_df['overtime'] = len(away_team_row) == 8
        
        parsed_game_id = self.game_id.split("_")
        self.game_info_df['season_week'] = parsed_game_id[3]
        self.game_info_df['season_year'] = parsed_game_id[0]
        
        
        
    
    # ---------------------------------------------
    # TeamStats Methods
    # ---------------------------------------------    
    def _parse_team_stats_table(self) -> None:
        table = self._extract_table(TEAM_STATS_TABLE_ID)
        if table is None:
            raise ValueError(f'[!] TeamStats table with id/class: ({GAME_INFO_TABLE_ID}) not found')
        
        rows = table.find_all('tr')
        if not rows:
            raise ValueError('[!] Malformed TeamStats table: No rows found')
        
        team_ids = self.game_id.split('_')[1:3]
        
        self.game_stats_df = pd.DataFrame({'team_id': team_ids})

        for idx, team_id in enumerate(team_ids):
            for row in rows[1:]:
                stat_name = row.find('th', {'data-stat': 'stat'}).get_text(strip=True)
                stat_val = row.find_all('td')[idx].get_text(strip=True)
                self.game_stats_df.loc[self.game_stats_df['team_id'] == team_id, stat_name] = stat_val


    def _parse_linescore_stats(self) -> None:
        table = self._extract_table(LINESCORE_TABLE_CLASSID)
        if table is None:
            raise ValueError(f'[!] Linescore table with id/class: ({GAME_INFO_TABLE_ID}) not found')    
        
        rows = table.find('tbody').find_all('tr')
        if len(rows) != 2:
            raise ValueError(f'[!] Malformed linescore table: {len(rows)} rows found.')
        
        for i, row in enumerate(rows):
            cells = row.find_all('td')
            if len(cells) not in [7, 8]:
                raise ValueError(f'[!] Malformed linescore table: {len(cells)} cells found at row {i}.')

            team_id = self.game_id.split('_')[2-i]
            
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
    
    
    
    # ---------------------------------------------
    # PlayerStats Methods
    # ---------------------------------------------
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
    
    
    def _parse_player_stats_table(self, table: Tag, table_id: str) -> None:
        rows = table.find_all('tr')
        if not rows:
            raise ValueError(f'[!] Malformed table with id={table_id}: No rows found')

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

    
    def _parse_player_stats(self) -> None:
        for table_id in PLAYER_GENERAL_STATS_TABLE_IDS_LIST:
            table = self._extract_table(table_id)
            if table is None:
                raise ValueError(f'[!] General table not found id = ({table_id})')
            self._parse_player_stats_table(table, table_id)
        
        for table_id in PLAYER_ADVANCED_STATS_TABLE_IDS_LIST:
            table = self._extract_table(table_id)
            if table is None:
                continue
            self._parse_player_stats_table(table, table_id)
    
    
    # ---------------------------------------------
    # Player Methods
    # ---------------------------------------------
    def extract_player_ids(self) -> list[str]:
        player_ids = set()
        
        def _get_player_ids_from_table(table: Tag, table_id) -> list[str]:
            ids = set()
            rows = table.find_all('tr')
            if not rows:
                raise ValueError(f'[!] Malformed table with id={table_id}: No rows found')
            
            for row in rows:
                player_cell = row.find('th')
                if not player_cell:
                    raise ValueError(f'[!] Malformed table with id={table_id}: No table header cells found')
                
                player_id = player_cell.get('data-append-csv')
                if not player_id: # Likely a header row
                    continue
                ids.add(player_id)
            return list(ids)
            
        home_team_table = self._extract_table(SNAPCOUNT_HOME_TEAM_TABLE_ID)
        away_team_table = self._extract_table(SNAPCOUNT_VISITING_TEAM_TABLE_ID)
        
        player_ids.update(_get_player_ids_from_table(home_team_table, SNAPCOUNT_HOME_TEAM_TABLE_ID))
        player_ids.update(_get_player_ids_from_table(away_team_table, SNAPCOUNT_VISITING_TEAM_TABLE_ID))
        
        return list(player_ids)
