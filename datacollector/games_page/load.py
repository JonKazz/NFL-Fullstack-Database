import psycopg2
import sqlalchemy
#from datacollector.config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT
from config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT
from sqlalchemy.dialects.postgresql import insert


# ---------------------------------------------
# DB Utility
# ---------------------------------------------
def get_db_connection():
    return psycopg2.connect(
        host=HOSTNAME,
        dbname=DATABASE,
        user=USERNAME,
        password=PASSWORD,
        port=PORT
    )


def get_all_db_game_urls() -> list[str]:
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT url FROM game_info WHERE url IS NOT NULL;")
                rows = cur.fetchall()
                return [row[0] for row in rows]
    except Exception as e:
        print("Error fetching URLs from game_info:", e)
        return []



# ---------------------------------------------
# Table Creation
# ---------------------------------------------
def create_table(query: str, table_name: str):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query)
                print(f"{table_name} table created successfully")
    except Exception as e:
        print(f"Error creating {table_name} table:", e)


def create_game_info_table():
    query = '''
    DROP TABLE IF EXISTS game_info;
    CREATE TABLE game_info (
        game_id VARCHAR(50) NOT NULL,
        season_week INT NOT NULL,
        season_year INT NOT NULL,
        date VARCHAR(30) NOT NULL,
        away_team_id VARCHAR(10) NOT NULL,
        home_team_id VARCHAR(10) NOT NULL,
        winning_team_id VARCHAR(10) NOT NULL,
        away_points INT NOT NULL,
        home_points INT NOT NULL,
        overtime BOOLEAN NOT NULL,
        won_toss VARCHAR(100),
        roof_type VARCHAR(100),
        surface_type VARCHAR(100),
        game_duration VARCHAR(100),
        weather VARCHAR(100),
        vegas_line VARCHAR(100),
        over_under VARCHAR(100),
        attendance INT,
        start_time VARCHAR(100),
        stadium VARCHAR(100),
        url VARCHAR(200) NOT NULL,
        PRIMARY KEY (game_id)
    );
    '''
    create_table(query, 'game_info')
    
    
def create_game_stats_table():
    query = '''
    DROP TABLE IF EXISTS game_stats;
    CREATE TABLE game_stats (
        game_id VARCHAR(50) NOT NULL,
        team_id VARCHAR(10) NOT NULL,
        first_downs_total INT,
        net_passing_yards INT,
        total_yards INT,
        turnovers INT,
        time_of_possession VARCHAR(20),
        points_q1 INT NOT NULL,
        points_q2 INT NOT NULL,
        points_q3 INT NOT NULL,
        points_q4 INT NOT NULL,
        points_overtime INT NOT NULL,
        points_total INT NOT NULL,
        rushing_attempts INT,
        rushing_yards INT,
        rushing_touchdowns INT,
        passing_attempts INT,
        passing_completions INT,
        passing_yards INT,
        passing_touchdowns INT,
        passing_interceptions INT,
        sacks_total INT,
        sack_yards INT,
        fumbles_total INT,
        fumbles_lost INT,
        penalties_total INT,
        penalty_yards INT,
        third_down_conversions INT,
        third_down_attempts INT,
        fourth_down_conversions INT,
        fourth_down_attempts INT,
        PRIMARY KEY (game_id, team_id)
    );
    '''
    create_table(query, 'game_stats')


def create_game_player_stats_table():
    query = '''
    DROP TABLE IF EXISTS game_player_stats;
    CREATE TABLE game_player_stats (
        game_id VARCHAR(50) NOT NULL,
        player_id VARCHAR(50) NOT NULL,
        team VARCHAR(50),
        position VARCHAR(10),
        pass_completions REAL,
        pass_attempts REAL,
        pass_yards REAL,
        pass_touchdowns REAL,
        pass_interceptions REAL,
        pass_sacked REAL,
        pass_sacked_yards REAL,
        pass_long REAL,
        pass_rating REAL,
        pass_first_downs REAL,
        pass_first_down_percentage REAL,
        pass_target_yds REAL,
        pass_target_yards_per_attempt REAL,
        pass_air_yards REAL,
        pass_air_yards_per_completion REAL,
        pass_air_yds_per_att REAL,
        pass_yards_after_catch REAL,
        pass_yards_after_catch_per_completion REAL,
        pass_drops REAL,
        pass_drop_percentage REAL,
        pass_poor_throws REAL,
        pass_poor_throw_percentage REAL,
        pass_blitzed REAL,
        pass_hurried REAL,
        pass_hits REAL,
        pass_pressured REAL,
        pass_pressured_percentage REAL,
        rush_attempts REAL,
        rush_yards REAL,
        rush_touchdowns REAL,
        rush_long REAL,
        rush_scrambles REAL,
        rush_scrambles_yards_per_attempt REAL,
        rush_first_downs REAL,
        rush_yards_before_contact REAL,
        rush_yards_before_contact_per_rush REAL,
        rush_yards_after_catch REAL,
        rush_yards_after_catch_per_rush REAL,
        rush_broken_tackles REAL,
        rush_broken_tackles_per_rush REAL,
        receiving_targets REAL,
        receiving_receptions REAL,
        receiving_yards REAL,
        receiving_touchdowns REAL,
        receiving_long REAL,
        receiving_first_downs REAL,
        receiving_air_yards REAL,
        receiving_air_yards_per_reception REAL,
        receiving_yards_after_catch REAL,
        receiving_yards_after_catch_per_reception REAL,
        receiving_average_depth_of_target REAL,
        receiving_broken_tackles REAL,
        receiving_broken_tackles_per_reception REAL,
        receiving_drops REAL,
        receiving_drop_percentage REAL,
        receiving_target_interceptions REAL,
        receiving_passer_rating REAL,
        fumbles_total REAL,
        fumbles_lost REAL,
        fumbles_recovered REAL,
        fumbles_recovered_yards REAL,
        fumbles_recovered_touchdowns REAL,
        fumbles_forced REAL,
        defensive_interceptions REAL,
        defensive_interception_yards REAL,
        defensive_interception_touchdowns REAL,
        defensive_interception_long REAL,
        defensive_passes_defended REAL,
        defensive_sacks REAL,
        defensive_tackles_combined REAL,
        defensive_tackles_solo REAL,
        defensive_tackles_assists REAL,
        defensive_tackles_loss REAL,
        defensive_qb_hits REAL,
        defensive_targets REAL,
        defensive_completions REAL,
        defensive_completion_percentage REAL,
        defensive_completion_yards REAL,
        defensive_completion_yards_per_completion REAL,
        defensive_completion_yards_per_target REAL,
        defensive_completion_touchdowns REAL,
        defensive_pass_rating REAL,
        defensive_target_yards_per_attempt REAL,
        defensive_air_yds REAL,
        defensive_yards_after_catch REAL,
        defensive_blitzes REAL,
        defensive_qb_hurries REAL,
        defensive_qb_knockdowns REAL,
        defensive_pressures REAL,
        defensive_tackles_missed REAL,
        defensive_tackles_missed_percentage REAL,
        extra_points_made REAL,
        extra_points_attempted REAL,
        field_goals_made REAL,
        field_goals_attempted REAL,
        punts REAL,
        punt_yards REAL,
        punt_yards_per_punt REAL,
        punt_long REAL,
        kick_returns REAL,
        kick_return_yards REAL,
        kick_return_yards_per_return REAL,
        kick_return_touchdowns REAL,
        kick_return_long REAL,
        punt_returns REAL,
        punt_return_yards REAL,
        punt_return_yards_per_return REAL,
        punt_return_touchdowns REAL,
        punt_return_long REAL,
        snapcounts_offense REAL,
        snapcounts_offense_percentage REAL,
        snapcounts_defense REAL,
        snapcounts_defense_percentage REAL,
        snapcounts_special_teams REAL,
        snapcounts_special_teams_percentage REAL,
        PRIMARY KEY (game_id, player_id)
    );
    '''
    create_table(query, 'game_player_stats')


def create_player_profiles_table():
    query = '''
    DROP TABLE IF EXISTS player_profiles;
    CREATE TABLE player_profiles (
        player_id VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        height VARCHAR(50) NOT NULL,
        weight VARCHAR(50) NOT NULL,
        dob VARCHAR(50) NOT NULL,
        college VARCHAR(100) NOT NULL,
        url VARCHAR(200) NOT NULL,
        PRIMARY KEY (player_id)
    )
    '''
    create_table(query, 'player_profiles')
    
    
# ---------------------------------------------
# Insert Helpers
# ---------------------------------------------
def insert_df(df, table_name):
    engine = sqlalchemy.create_engine(f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')

    with engine.begin() as conn:
        meta = sqlalchemy.MetaData()
        table = sqlalchemy.Table(table_name, meta, autoload_with=engine)
        for _, row in df.iterrows():
            stmt = insert(table).values(**row.to_dict())
            if table_name == 'game_stats':
                stmt = stmt.on_conflict_do_nothing(index_elements=['game_id', 'team_id'])
            elif table_name == 'game_info':
                stmt = stmt.on_conflict_do_nothing(index_elements=['game_id'])
            elif table_name == 'game_player_stats':
                stmt = stmt.on_conflict_do_nothing(index_elements=['game_id', 'player_id'])
            elif table_name == 'player_profiles':
                stmt = stmt.on_conflict_do_nothing(index_elements=['player_id'])
            else:
                raise ValueError(f'load table invaild: ({table_name}).')

            result = conn.execute(stmt)

            if table_name == 'game_info':
                if result.rowcount == 0:
                    print(f"Skipped duplicate for game_id={row['game_id']}")
                else:
                    print(f"Inserted row for game_id={row['game_id']}")



# ---------------------------------------------
# Specific Insert Functions
# ---------------------------------------------
def insert_game_stats_df(df):
    insert_df(df, 'game_stats')

def insert_game_player_stats_df(df):
    insert_df(df, 'game_player_stats')
    
def insert_game_info_df(df):
    insert_df(df, 'game_info')
    
def insert_player_profile_df(df):
    insert_df(df, 'player_profiles')
