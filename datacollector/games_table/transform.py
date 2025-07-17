import numpy as np
from config import PFR_ABR_MAP, TEAM_CITY_MAP

def game_mapping(df):
    col_map = {
        'Gtm': 'game_number',
        'Week': 'season_week',
        'Opp': 'opponent_id',
        'Date': 'date',
        'Rslt': 'result',
        'Pts': 'points_for',
        'PtsO': 'points_against',
        'OT': 'overtime',
        'Cmp': 'passes_completed',
        'Att': 'passes_attempted',
        'Yds': 'passing_yards',
        'TD': 'passing_touchdowns',
        'Sk': 'passing_number_sackes',
        'Yds.1': 'passing_sack_yards',
        'Att.1': 'rushing_attempts',
        'Yds.2': 'rushing_yards',
        'TD.1': 'rushing_touchdowns',
        'Ply': 'total_offensive_plays',
        'Tot': 'total_offensive_yards',
        'FGA': 'field_goals_attempted',
        'FGM': 'field_goals_made',
        'XPA': 'extra_points_attempted',
        'XPM': 'extra_points_made',
        'Pnt': 'punts',
        'Yds.3': 'punt_yards',
        'Pass': 'first_downs_by_passing',
        'Rsh': 'first_downs_by_rushing',
        'Pen': 'first_downs_by_penalty',
        '1stD': 'first_downs_total',
        '3DConv': 'third_down_conversions',
        '3DAtt': 'third_down_attempts',
        '4DConv': 'fourth_down_conversions',
        '4DAtt': 'fourth_down_attempts',
        'Pen.1': 'penalty_total',
        'Yds.4': 'penalty_yards',
        'FL': 'fumbles_lost',
        'Int': 'interceptions_thrown',
        'TO': 'turnovers_total',
        'ToP': 'time_of_possesion',
        'team_id': 'team_id',
        'year': 'year',
        'game_id': 'game_id',
        'Unnamed: 5': 'home_game'
    }
    
    df.rename(columns=col_map, inplace=True)
    df = df[[col for col in df.columns if col in list(col_map.values())]]
    df = df[df['game_number'].notna()]
    df['home_game'] = df['home_game'].apply(lambda x: False if x == "@" else True)
    df['overtime'] = df['overtime'].apply(lambda x: True if x == "OT" else False)
    df['opponent_id'] = df['opponent_id'].map(PFR_ABR_MAP)
    df['game_id'] = np.where(
        df['home_game'],
        df['year'] + "_" + df['team_id'] + "_" + df['opponent_id'] + "_" + df['season_week'].astype(int).astype(str),
        df['year'] + "_" + df['opponent_id'] + "_" + df['team_id'] + "_" + df['season_week'].astype(int).astype(str)
    )
    return df
