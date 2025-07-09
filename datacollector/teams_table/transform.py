import pandas as pd
import re
from config import TEAM_NAME_MAP, TEAM_CITY_MAP

def team_mapping(df):
    col_map = {
        'Coach': 'coach',
        'Points For': 'points_for',
        'Points Against': 'points_against',
        'Record': 'record',
        'Playoffs': 'playoffs',
        'Offensive Coordinator': 'off_coordinator',
        'Defensive Coordinator': 'def_coordinator',
        'Stadium': 'stadium',
        'Offensive Scheme': 'off_scheme',
        'Defensive Alignment': 'def_alignment',
        'team': 'team',
        'year': 'year'
    }
    df = df.rename(columns=col_map)
    df = df[list(col_map.values())]
    
    df['team_id'] = df['team'] + '_' + df['year']
    df = parse_playoffs_column(df)
    df = parse_record_column(df)
    df['name'] = df['team'].map(TEAM_NAME_MAP)
    df['city'] = df['team'].map(TEAM_CITY_MAP)
    df = df.drop(columns=['record', 'playoffs'])
    return df

def parse_playoffs_column(df):
    df['missed_playoffs'] = df['playoffs'].isna()
    df['lost_wild_card'] = False
    df['lost_divisional'] = False
    df['lost_conference_championship'] = False
    df['lost_superbowl'] = False
    df['won_superbowl'] = False

    def classify_playoffs(playoff_text):
        if pd.isna(playoff_text):
            return {
                'missed_playoffs': True,
                'lost_wild_card': False,
                'lost_divisional': False,
                'lost_conference_championship': False,
                'lost_superbowl': False,
                'won_superbowl': False
            }

        return {
            'missed_playoffs': False,
            'lost_wild_card': 'Lost Wild Card' in playoff_text,
            'lost_divisional': 'Lost Divisional' in playoff_text,
            'lost_conference_championship': 'Lost Conference Championship' in playoff_text,
            'lost_superbowl': 'Lost Super Bowl' in playoff_text,
            'won_superbowl': 'Won Super Bowl' in playoff_text
        }

    playoff_flags = df['playoffs'].apply(classify_playoffs).apply(pd.Series)
    df.update(playoff_flags)

    return df


def parse_record_column(df):
    def extract_all_parts(record):
        if pd.isna(record):
            return pd.Series([None, None, None, None, None])

        match = re.search(r'(\d+)-(\d+)-(\d+),\s*(\d+)(?:st|nd|rd|th)\s+in\s*([A-Z]+ [A-Za-z]+)', record)
        if match:
            wins = int(match.group(1))
            losses = int(match.group(2))
            ties = int(match.group(3))
            division_rank = int(match.group(4))
            division = match.group(5)
            return pd.Series([wins, losses, ties, division_rank, division])
        else:
            return pd.Series([None, None, None, None, None])

    df[['wins', 'losses', 'ties', 'division_rank', 'division']] = df['record'].apply(extract_all_parts)
    return df