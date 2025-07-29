import numpy as np
import pandas as pd
from config import TEAMABR_TO_TEAMID_MAP

# Column mapping for game_stats_table
GAME_STATS_COL_MAP = {
    'game_id': 'game_id',
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
    'points_overtime': 'points_overtime',
    'points_total': 'points_total',
    'rushing_attempts': 'rushing_attempts',
    'rushing_yards': 'rushing_yards',
    'rushing_touchdowns': 'rushing_touchdowns',
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
    'game_id': 'game_id',
    'url': 'url',
    'Won Toss': 'won_toss',
    'Roof': 'roof_type',
    'Surface': 'surface_type',
    'Duration': 'game_duration',
    'attendance': 'attendance',
    'Weather': 'weather',
    'Vegas Line': 'vegas_line',
    'Over/Under': 'over_under',
    'date': 'date',
    'start_time': 'start_time',
    'stadium': 'stadium',
    'overtime': 'overtime',
    'away_team_id': 'away_team_id',
    'home_team_id': 'home_team_id',
    'winning_team_id': 'winning_team_id',
    'season_week': 'season_week',
    'season_year': 'season_year'
}


def transform_game_stats_table(df: pd.DataFrame) -> pd.DataFrame:
    df = modify_game_stats_features(df)
    df = column_mapping(df, GAME_STATS_COL_MAP)
    return df


def transform_game_info_table(df: pd.DataFrame) -> pd.DataFrame:
    df = modify_game_info_features(df)
    df = column_mapping(df, GAME_INFO_COL_MAP)
    return df


def transform_game_player_stats_table(df: pd.DataFrame) -> pd.DataFrame:
    df = modify_game_player_stats_features(df)
    return df

def column_mapping(df: pd.DataFrame, col_map: dict) -> pd.DataFrame:
    for col in col_map:
        if col not in df.columns:
            df[col] = None
    df = df.rename(columns=col_map)
    df = df[list(col_map.values())]
    return df


def modify_game_stats_features(df: pd.DataFrame) -> pd.DataFrame:
    # Parse Rush-Yds-TDs into separate columns
    if 'Rush-Yds-TDs' not in df.columns:
        raise ValueError("Missing expected column: 'Rush-Yds-TDs'")
    split_cols = df['Rush-Yds-TDs'].str.split('-', expand=True)
    df['rushing_attempts'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['rushing_yards'] = pd.to_numeric(split_cols[1], errors='coerce')
    df['rushing_touchdowns'] = pd.to_numeric(split_cols[2], errors='coerce')
    df = df.drop(columns=['Rush-Yds-TDs'])

    # Parse Cmp-Att-Yd-TD-INT into separate columns
    if 'Cmp-Att-Yd-TD-INT' not in df.columns:
        raise ValueError("Missing expected column: 'Cmp-Att-Yd-TD-INT'")
    split_cols = df['Cmp-Att-Yd-TD-INT'].str.split('-', expand=True)
    df['passing_attempts'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['passing_completions'] = pd.to_numeric(split_cols[1], errors='coerce')
    df['passing_yards'] = pd.to_numeric(split_cols[2], errors='coerce')
    df['passing_touchdowns'] = pd.to_numeric(split_cols[3], errors='coerce')
    df['passing_interceptions'] = pd.to_numeric(split_cols[4], errors='coerce')
    df = df.drop(columns=['Cmp-Att-Yd-TD-INT'])

    # Parse Sacked-Yards into separate columns
    if 'Sacked-Yards' not in df.columns:
        raise ValueError("Missing expected column: 'Sacked-Yards'")
    split_cols = df['Sacked-Yards'].str.split('-', expand=True)
    df['sacks_total'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['sack_yards'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Sacked-Yards'])

    # Parse Fumbles-Lost into separate columns
    if 'Fumbles-Lost' not in df.columns:
        raise ValueError("Missing expected column: 'Fumbles-Lost'")
    split_cols = df['Fumbles-Lost'].str.split('-', expand=True)
    df['fumbles_total'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['fumbles_lost'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Fumbles-Lost'])

    # Parse Penalties-Yards into separate columns
    if 'Penalties-Yards' not in df.columns:
        raise ValueError("Missing expected column: 'Penalties-Yards'")
    split_cols = df['Penalties-Yards'].str.split('-', expand=True)
    df['penalties_total'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['penalty_yards'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Penalties-Yards'])

    # Parse Third Down Conv. into separate columns
    if 'Third Down Conv.' not in df.columns:
        raise ValueError("Missing expected column: 'Third Down Conv.'")
    split_cols = df['Third Down Conv.'].str.split('-', expand=True)
    df['third_down_conversions'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['third_down_attempts'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Third Down Conv.'])

    # Parse Fourth Down Conv. into separate columns
    if 'Fourth Down Conv.' not in df.columns:
        raise ValueError("Missing expected column: 'Fourth Down Conv.'")
    split_cols = df['Fourth Down Conv.'].str.split('-', expand=True)
    df['fourth_down_conversions'] = pd.to_numeric(split_cols[0], errors='coerce')
    df['fourth_down_attempts'] = pd.to_numeric(split_cols[1], errors='coerce')
    df = df.drop(columns=['Fourth Down Conv.'])

    return df


def modify_game_info_features(df: pd.DataFrame) -> pd.DataFrame:
    if 'Attendance' in df.columns:
        df['attendance'] = (df['Attendance'].replace({',': ''}, regex=True).replace({'': None}).astype(float).astype('Int64'))
    else:
        df['attendance'] = None
        
    return df


def modify_game_player_stats_features(df: pd.DataFrame) -> pd.DataFrame:    
    for col in df.columns:
        # Remove % if present, then convert to float
        if df[col].astype(str).str.contains('%').any():
            df[col] = (
                df[col]
                .astype(str)
                .str.replace('%', '', regex=False)
                .replace({'': np.nan, '<NA>': np.nan, 'nan': np.nan})
                .astype(float)
            )
        else:
            df[col] = (
                df[col]
                .replace({'': np.nan})
            )
            try:
                df[col] = df[col].astype(float)
            except Exception:
                pass 
    
    df = df.convert_dtypes()
     
    return df