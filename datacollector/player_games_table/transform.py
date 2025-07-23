import numpy as np
from config import TEAMABR_TO_TEAMID_MAP

def playergame_mapping(df):
    
    column_map = dict(enumerate(['default' if 'Unnamed' in col else col for col in df.columns]))
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)
         
    new_columns = []
    for idx, col_name in enumerate(df.columns):
        stat_type = column_map[idx]
        mapped = stat_name_mapping(stat_type, col_name, new_columns)
        new_columns.append(mapped if mapped else None)
    
    df.columns = new_columns
    df = df.loc[:, df.columns.notna()]
    df = df[~df['career_game_number'].isin(['Gcar', None, np.nan])]
    
    df['home_game'] = df['home_game'].apply(lambda x: False if x == '@' else True)
    df['game_started'] = df['game_started'].apply(lambda x: True if x == '*' else False)
    df['opponent_id'] = df['opponent_id'].map(TEAMABR_TO_TEAMID_MAP)
    df['team_id'] = df['team_id'].map(TEAMABR_TO_TEAMID_MAP)
    df['game_id'] = np.where(
        df['home_game'],
        df['date'].str.split('-').str[0] + "_" + df['team_id'] + '_' + df['opponent_id'] + '_' + df['week'].astype(int).astype(str),
        df['date'].str.split('-').str[0] + "_" + df['opponent_id'] + '_' + df['team_id'] + '_' + df['week'].astype(int).astype(str)
    )
    
    return df


def stat_name_mapping(stat_type, stat_name, existing_columns):
    if isinstance(stat_name, str):
        stat_name = stat_name.split('.')[0]
    stat_type = stat_type.split('.')[0]

    mappings = {
        'Tackles': {
            'Comb': 'tackles_combined',
            'Solo': 'tackles_solo',
            'Ast': 'tackles_assist',
            'TFL': 'tackles_for_loss',
            'QBHits': 'tackles_qb_hits',
        },
        'Def Interceptions': {
            'Int': 'defensive_interceptions',
            'Yds': 'defensive_interception_yards',
            'IntTD': 'defensive_interception_touchdowns',
            'PD': 'defensive_passes_defended',
        },
        'Punting': {
            'Pnt': 'punting_total_amount',
            'Yds': 'punting_yards',
            'RetYds': 'punting_return_yards',
            'NetYds': 'punting_net_yards',
            'TB': 'punting_touch_backs',
            'Pnt20': 'punting_inside_20',
            'Blck': 'punting_blocks',
        },
        'Rushing': {
            'Att': 'rushing_attempts',
            'Yds': 'rushing_yards',
            'TD': 'rushing_touchdowns',
        },
        'Snap Counts': {
            'OffSnp': 'snapcount_total_offense',
            'Off%': 'snapcount_offense_percentage',
            'DefSnp': 'snapcount_total_defence',
            'Def%': 'snapcount_defence_percentage',
            'STSnp': 'snapcount_total_st',
            'ST%': 'snapcount_st_percentage',
        },
        'Fumbles': {
            'Fmb': 'fumbles_total',
            'FL': 'fumbles_lost',
            'FF': 'fumbles_forced',
            'FR': 'fumbles_recovered',
            'Yds': 'fumbles_recovered_yards',
            'FRTD': 'fumbles_recovered_touchdowns',
        },
        'Receiving': {
            'Tgt': 'receiving_targets',
            'Rec': 'receiving_receptions',
            'Yds': 'receiving_yards',
            'TD': 'receiving_touchdowns',
        },
        'Passing': {
            'Cmp': 'passing_completions',
            'Att': 'passing_attempts',
            'Yds': 'passing_yards' if 'passing_yards' not in existing_columns else 'passing_sack_yards',
            'TD': 'passing_touchdowns',
            'Int': 'passing_interceptions',
            'Rate': 'passing_rating',
            'Sk': 'passing_sacks',
        },
        'default': {
            'Gcar': 'career_game_number',
            'Week': 'week',
            'Team': 'team_id',
            'Opp': 'opponent_id',
            'GS': 'game_started',
            'Date': 'date',
            'Result': 'result',
            'Sfty': 'safties',
            'player_id': 'player_id',
            np.nan: 'home_game',
        },
    }

    map_group = mappings.get(stat_type, mappings['default'])
    return map_group.get(stat_name, None)
