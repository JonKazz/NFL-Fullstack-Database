import pandas as pd

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
        'Chairman/CEO': 'chairman_ceo',
        'General Manager': 'general_manager',
        'Offensive Scheme': 'off_scheme',
        'Defensive Alignment': 'def_alignment',
        'team': 'team',
        'year': 'year'
    }
    df = df.rename(columns=col_map)
    df = df[list(col_map.values())]
    df = parse_playoffs_column(df)
    df = parse_record_column(df)
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
    def extract_record_parts(record):
        if pd.isna(record):
            return pd.Series([None, None, None])
        
        try:
            record_part = record.split(',')[0]
            wins, losses, ties = map(int, record_part.split('-'))
            return pd.Series([wins, losses, ties])
        except Exception:
            return pd.Series([None, None, None])

    df[['wins', 'losses', 'ties']] = df['record'].apply(extract_record_parts)
    return df

