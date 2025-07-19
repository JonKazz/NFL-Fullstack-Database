import psycopg2
import sqlalchemy
from config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT

def create_player_games_table():
    create_player_game_table_query = '''
    DROP TABLE IF EXISTS player_games;
    CREATE TABLE player_games (
        player_id VARCHAR(20),
        game_id VARCHAR(50),
        team_id VARCHAR(20),
        opponent_id VARCHAR(20),
        date VARCHAR(20),
        result VARCHAR(20),
        home_game BOOLEAN,
        game_started BOOLEAN,
        career_game_number INT,
        week INT,
        
        tackles_combined INT,
        tackles_solo INT,
        tackles_assist INT,
        tackles_for_loss INT,
        tackles_qb_hits INT,

        defensive_interceptions INT,
        defensive_interception_yards INT,
        defensive_interception_touchdowns INT,
        defensive_passes_defended INT,

        punting_total_amount INT,
        punting_yards INT,
        punting_return_yards INT,
        punting_net_yards INT,
        punting_touch_backs INT,
        punting_inside_20 INT,
        punting_blocks INT,

        rushing_attempts INT,
        rushing_yards INT,
        rushing_touchdowns INT,

        snapcount_total_offense INT,
        snapcount_offense_percentage FLOAT,
        snapcount_total_defence INT,
        snapcount_defence_percentage FLOAT,
        snapcount_total_st INT,
        snapcount_st_percentage FLOAT,

        fumbles_total INT,
        fumbles_lost INT,
        fumbles_forced INT,
        fumbles_recovered INT,
        fumbles_recovered_yards INT,
        fumbles_recovered_touchdowns INT,

        receiving_targets INT,
        receiving_receptions INT,
        receiving_yards INT,
        receiving_touchdowns INT,

        passing_completions INT,
        passing_attempts INT,
        passing_yards INT,
        passing_touchdowns INT,
        passing_interceptions INT,
        passing_rating FLOAT,
        passing_sacks INT,

        safties INT,

        PRIMARY KEY (player_id, game_id)
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
        cur.execute(create_player_game_table_query)
        print('Table created successfully')
    except Exception as error:
        print('Error creating table:', error)
    finally:
        if cur is not None:
            cur.close()
        if connection is not None:
            connection.close()
    


def insert_df(df):
    engine = sqlalchemy.create_engine(f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')
    try:
        df.to_sql('player_games', engine, if_exists='append', index=False)
        print("Data inserted successfully")
    except Exception as error:
        print("Error inserting data:", error)
