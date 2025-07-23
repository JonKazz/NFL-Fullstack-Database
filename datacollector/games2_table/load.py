import psycopg2
import sqlalchemy
#from datacollector.config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT
from config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT
from sqlalchemy.dialects.postgresql import insert

def create_game_stats_table():
    create_game_stats_table_query = '''
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

    connection = None
    cur = None
    try:
        connection = psycopg2.connect(
            host=HOSTNAME,
            dbname=DATABASE,
            user=USERNAME,
            password=PASSWORD,
            port=PORT
        )
        connection.autocommit = True
        cur = connection.cursor()
        cur.execute(create_game_stats_table_query)
        print('game_stats table created successfully')
    except Exception as error:
        print('Error creating game_stats table:', error)
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()

def create_game_info_table():
    create_game_info_table_query = '''
    DROP TABLE IF EXISTS game_info;
    CREATE TABLE game_info (
        game_id VARCHAR(50) PRIMARY KEY,
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
        away_team_id VARCHAR(10),
        home_team_id VARCHAR(10),
        winning_team_id VARCHAR(10),
        season_week INT,
        season_year INT
    );
    '''

    connection = None
    cur = None
    try:
        connection = psycopg2.connect(
            host=HOSTNAME,
            dbname=DATABASE,
            user=USERNAME,
            password=PASSWORD,
            port=PORT
        )
        connection.autocommit = True
        cur = connection.cursor()
        cur.execute(create_game_info_table_query)
        print('game_info table created successfully')
    except Exception as error:
        print('Error creating game_info table:', error)
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()


def insert_game_stats_df(df):
    engine = sqlalchemy.create_engine(f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')
    if not engine.dialect.has_table(engine.connect(), 'game_stats'):
        print("Table 'game_stats' does not exist. Creating table...")
        create_game_stats_table()
    with engine.begin() as conn:
        meta = sqlalchemy.MetaData()
        table = sqlalchemy.Table('game_stats', meta, autoload_with=engine)
        for _, row in df.iterrows():
            stmt = insert(table).values(**row.to_dict())
            stmt = stmt.on_conflict_do_nothing(index_elements=['game_id', 'team_id'])
            result = conn.execute(stmt)
            if result.rowcount == 0:
                print(f"Skipped duplicate row for game_id={row['game_id']}, team_id={row['team_id']}")
            else:
                print('Inserted row for game_id=', row['game_id'], 'team_id=', row['team_id'])


def insert_game_info_df(df):
    engine = sqlalchemy.create_engine(f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')
    if not engine.dialect.has_table(engine.connect(), 'game_info'):
        print("Table 'game_info' does not exist. Creating table...")
        create_game_info_table()
    with engine.begin() as conn:
        meta = sqlalchemy.MetaData()
        table = sqlalchemy.Table('game_info', meta, autoload_with=engine)
        for _, row in df.iterrows():
            stmt = insert(table).values(**row.to_dict())
            stmt = stmt.on_conflict_do_nothing(index_elements=['game_id'])
            result = conn.execute(stmt)
            if result.rowcount == 0:
                print(f"Skipped duplicate row for game_id={row['game_id']}")
            else:
                print('Inserted row for game_id=', row['game_id'])
