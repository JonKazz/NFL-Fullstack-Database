import numpy as np
import pandas as pd
from config import TEAMABR_TO_TEAMID_MAP

# Column mapping for game_stats_table
GAME_STATS_COL_MAP = {
    'team_id': 'team_id',
    'First Downs': 'first_downs_total',
    'Net Pass Yards': 'net_passing_yards',
    'Total Yards': 'total_yards',
    'Turnovers': 'turnovers',
    'Time of Possession': 'time_of_possession',
    'points_q1': 'points_q1',
    'points_q2': 'points_q2',
    'points_q3': 'points_q3',
    'points_q4': 'points_q4',
    'total_points': 'points_total',
    'rushing_attempts': 'rushing_attempts',
    'rushing_yards': 'rushing_yards',
    'rushing_tds': 'rushing_touchdowns',
    'passing_attempts': 'passing_attempts',
    'passing_completions': 'passing_completions',
    'passing_yards': 'passing_yards',
    'passing_touchdowns': 'passing_touchdowns',
    'passing_interceptions': 'passing_interceptions',
    'sacks_total': 'sacks_total',
    'sack_yards': 'sack_yards',
    'fumbles_total': 'fumbles_total',
    'fumbles_lost': 'fumbles_lost',
    'penalties_total': 'penalties_total',
    'penalty_yards': 'penalty_yards',
    'third_down_conversions': 'third_down_conversions',
    'third_down_attempts': 'third_down_attempts',
    'fourth_down_conversions': 'fourth_down_conversions',
    'fourth_down_attempts': 'fourth_down_attempts'
}

# Column mapping for game_info_table
GAME_INFO_COL_MAP = {
    'Won Toss': 'won_toss',
    'Roof': 'roof_type',
    'Surface': 'surface_type',
    'Duration': 'game_duration',
    'Attendance': 'attendance',
    'Weather': 'weather',
    'Vegas Line': 'vegas_line',
    'Over/Under': 'over_under',
    'date': 'date',
    'start_time': 'start_time',
    'stadium': 'stadium',
    'attendance': 'attendance',
    'away_team_id': 'away_team_id',
    'home_team_id': 'home_team_id',
    'winning_team_id': 'winning_team_id',
    'season_week': 'season_week',
    'season_year': 'season_year'
}


def transform_game_stats_table(df: pd.DataFrame) -> pd.DataFrame:
    df = modify_game_stats_features(df)
    df = column_mapping(df, GAME_STATS_COL_MAP)
    df = create_game_id(df)
    return df

def transform_game_info_table(df: pd.DataFrame) -> pd.DataFrame:
    df = column_mapping(df, GAME_INFO_COL_MAP)
    df = create_game_id(df)
    return df


def column_mapping(df: pd.DataFrame, col_map: dict) -> pd.DataFrame:
    missing = [col for col in col_map if col not in df.columns]
    if missing:
        raise ValueError(f"Missing expected columns: {missing}")
    df = df.rename(columns=col_map)
    df = df[list(col_map.values())]
    return df


def modify_game_stats_features(df: pd.DataFrame) -> pd.DataFrame:
    # Parse Rush-Yds-TDs into separate columns
    if 'Rush-Yds-TDs' not in df.columns:
        raise ValueError("Missing expected column: 'Rush-Yds-TDs'")
    split_cols = df['Rush-Yds-TDs'].str.split('-', expand=True)
    df['rushing_att'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['rushing_yds'] = pd.to_numeric(split_cols[1], errors='coerce')
    df['rushing_tds'] = pd.to_numeric(split_cols[2], errors='coerce')
    df = df.drop(columns=['Rush-Yds-TDs'])

    # Parse Cmp-Att-Yd-TD-INT into separate columns
    if 'Cmp-Att-Yd-TD-INT' not in df.columns:
        raise ValueError("Missing expected column: 'Cmp-Att-Yd-TD-INT'")
    split_cols = df['Cmp-Att-Yd-TD-INT'].str.split('-', expand=True)
    df['passing_att'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['passing_cmp'] = pd.to_numeric(split_cols[1], errors='coerce')
    df['passing_yds'] = pd.to_numeric(split_cols[2], errors='coerce')
    df['passing_tds'] = pd.to_numeric(split_cols[3], errors='coerce')
    df['passing_ints'] = pd.to_numeric(split_cols[4], errors='coerce')
    df = df.drop(columns=['Cmp-Att-Yd-TD-INT'])

    # Parse Sacked-Yards into separate columns
    if 'Sacked-Yards' not in df.columns:
        raise ValueError("Missing expected column: 'Sacked-Yards'")
    split_cols = df['Sacked-Yards'].str.split('-', expand=True)
    df['sack_tot'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['sack_yds'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Sacked-Yards'])

    # Parse Fumbles-Lost into separate columns
    if 'Fumbles-Lost' not in df.columns:
        raise ValueError("Missing expected column: 'Fumbles-Lost'")
    split_cols = df['Fumbles-Lost'].str.split('-', expand=True)
    df['fumble_tot'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['fumble_lost'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Fumbles-Lost'])

    # Parse Penalties-Yards into separate columns
    if 'Penalties-Yards' not in df.columns:
        raise ValueError("Missing expected column: 'Penalties-Yards'")
    split_cols = df['Penalties-Yards'].str.split('-', expand=True)
    df['penalty_tot'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['penalty_yds'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Penalties-Yards'])

    # Parse Third Down Conv. into separate columns
    if 'Third Down Conv.' not in df.columns:
        raise ValueError("Missing expected column: 'Third Down Conv.'")
    split_cols = df['Third Down Conv.'].str.split('-', expand=True)
    df['third_down_conv'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['third_down_att'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Third Down Conv.'])

    # Parse Fourth Down Conv. into separate columns
    if 'Fourth Down Conv.' not in df.columns:
        raise ValueError("Missing expected column: 'Fourth Down Conv.'")
    split_cols = df['Fourth Down Conv.'].str.split('-', expand=True)
    df['fourth_down_conv'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['fourth_down_att'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Fourth Down Conv.'])

    return df


def create_game_id(df: pd.DataFrame) -> pd.DataFrame:
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
