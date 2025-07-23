import numpy as np
import pandas as pd
from config import TEAMABR_TO_TEAMID_MAP


def transform_game_table(df: pd.DataFrame) -> pd.DataFrame:
    df = column_mapping(df)
    df = modify_features(df)
    df = create_game_id(df)
    return df


def column_mapping(df: pd.DataFrame) -> pd.DataFrame:
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
        'ToP': 'time_of_possession',
        'team_id': 'team_id',
        'year': 'year'
    }

    home_cols = [col for col in df.columns if 'Unnamed' in col]
    if home_cols:
        col_map[home_cols[0]] = 'home_game'

    missing = [col for col in col_map if col not in df.columns]
    if missing:
        raise ValueError(f"Missing expected columns: {missing}")

    df = df.rename(columns=col_map)
    df = df[list(col_map.values())]
    df = df[df['game_number'].notna()]

    return df


def modify_features(df: pd.DataFrame) -> pd.DataFrame:
    df['home_game'] = df['home_game'] != "@"
    df['overtime'] = df['overtime'] == "OT"
    
    df['opponent_id'] = df['opponent_id'].map(TEAMABR_TO_TEAMID_MAP).fillna(df['opponent_id'])

    df['time_of_possession_seconds'] = df['time_of_possession'].str.split(':').apply(
        lambda x: int(x[0]) * 60 + int(x[1])
    )   
    return df


def create_game_id(df: pd.DataFrame) -> pd.DataFrame:
    week = df['season_week'].astype(int).astype(str)
    df['game_id'] = np.where(
        df['home_game'],
        df['year'] + "_" + df['team_id'] + "_" + df['opponent_id'] + "_" + week,
        df['year'] + "_" + df['opponent_id'] + "_" + df['team_id'] + "_" + week
    )
    return df
