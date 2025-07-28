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
        points_q1 INT,
        points_q2 INT,
        points_q3 INT,
        points_q4 INT,
        points_overtime INT,
        points_total INT,
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


def create_game_info_table():
    query = '''
    DROP TABLE IF EXISTS game_info;
    CREATE TABLE game_info (
        game_id VARCHAR(50),
        won_toss VARCHAR(100),
        roof_type VARCHAR(100),
        surface_type VARCHAR(100),
        game_duration VARCHAR(100),
        weather VARCHAR(100),
        vegas_line VARCHAR(100),
        over_under VARCHAR(100),
        attendance INT,
        date VARCHAR(30),
        start_time VARCHAR(100),
        stadium VARCHAR(100),
        overtime BOOLEAN,
        away_team_id VARCHAR(10),
        home_team_id VARCHAR(10),
        winning_team_id VARCHAR(10),
        season_week INT,
        season_year INT,
        PRIMARY KEY (game_id)
    );
    '''
    create_table(query, 'game_info')


def create_game_player_stats_table():
    query = '''
    DROP TABLE IF EXISTS game_player_stats;
    CREATE TABLE game_player_stats (
        game_id VARCHAR(50) NOT NULL,
        player_id VARCHAR(50) NOT NULL,
        team VARCHAR(50),
        pass_cmp REAL,
        pass_att REAL,
        pass_yds REAL,
        pass_td REAL,
        pass_int REAL,
        pass_sacked REAL,
        pass_sacked_yds REAL,
        pass_long REAL,
        pass_rating REAL,
        rush_att REAL,
        rush_yds REAL,
        rush_td REAL,
        rush_long REAL,
        targets REAL,
        rec REAL,
        rec_yds REAL,
        rec_td REAL,
        rec_long REAL,
        fumbles REAL,
        fumbles_lost REAL,
        def_int REAL,
        def_int_yds REAL,
        def_int_td REAL,
        def_int_long REAL,
        pass_defended REAL,
        sacks REAL,
        tackles_combined REAL,
        tackles_solo REAL,
        tackles_assists REAL,
        tackles_loss REAL,
        qb_hits REAL,
        fumbles_rec REAL,
        fumbles_rec_yds REAL,
        fumbles_rec_td REAL,
        fumbles_forced REAL,
        pass_first_down REAL,
        pass_first_down_pct REAL,
        pass_target_yds REAL,
        pass_tgt_yds_per_att REAL,
        pass_air_yds REAL,
        pass_air_yds_per_cmp REAL,
        pass_air_yds_per_att REAL,
        pass_yac REAL,
        pass_yac_per_cmp REAL,
        pass_drops REAL,
        pass_drop_pct REAL,
        pass_poor_throws REAL,
        pass_poor_throw_pct REAL,
        pass_blitzed REAL,
        pass_hurried REAL,
        pass_hits REAL,
        pass_pressured REAL,
        pass_pressured_pct REAL,
        rush_scrambles REAL,
        rush_scrambles_yds_per_att REAL,
        rush_first_down REAL,
        rush_yds_before_contact REAL,
        rush_yds_bc_per_rush REAL,
        rush_yac REAL,
        rush_yac_per_rush REAL,
        rush_broken_tackles REAL,
        rush_broken_tackles_per_rush REAL,
        def_targets REAL,
        def_cmp REAL,
        def_cmp_perc REAL,
        def_cmp_yds REAL,
        def_yds_per_cmp REAL,
        def_yds_per_target REAL,
        def_cmp_td REAL,
        def_pass_rating REAL,
        def_tgt_yds_per_att REAL,
        def_air_yds REAL,
        def_yac REAL,
        blitzes REAL,
        qb_hurry REAL,
        qb_knockdown REAL,
        pressures REAL,
        tackles_missed REAL,
        tackles_missed_pct REAL,
        PRIMARY KEY (game_id, player_id)
    );
    '''
    create_table(query, 'game_player_stats')
    
    
# ---------------------------------------------
# Insert Helpers
# ---------------------------------------------
def insert_df_with_conflict_handling(df, table_name, conflict_cols):
    engine = sqlalchemy.create_engine(f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')

    with engine.begin() as conn:
        meta = sqlalchemy.MetaData()
        table = sqlalchemy.Table(table_name, meta, autoload_with=engine)
        for _, row in df.iterrows():
            stmt = insert(table).values(**row.to_dict())
            stmt = stmt.on_conflict_do_nothing(index_elements=conflict_cols)
            result = conn.execute(stmt)
            if table_name == 'game_info':
                if result.rowcount == 0:
                    print(f"Skipped duplicate for {conflict_cols}={tuple(row[col] for col in conflict_cols)}")
                else:
                    print(f"Inserted row for {conflict_cols}={tuple(row[col] for col in conflict_cols)}")



# ---------------------------------------------
# Specific Insert Functions
# ---------------------------------------------
def insert_game_stats_df(df):
    insert_df_with_conflict_handling(df, 'game_stats', ['game_id', 'team_id'])

def insert_game_player_stats_df(df):
    insert_df_with_conflict_handling(df, 'game_player_stats', ['game_id', 'player_id'])
    
def insert_game_info_df(df):
    insert_df_with_conflict_handling(df, 'game_info', ['game_id'])
