import psycopg2
import sqlalchemy
from config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT

def create_games_table():
    create_game_table_query = '''
    DROP TABLE IF EXISTS games;
    CREATE TABLE games (
        game_id VARCHAR(30) NOT NULL,
        team_id VARCHAR(10) NOT NULL,
        year INT NOT NULL,
        date VARCHAR(30) NOT NULL,
        game_number INT NOT NULL,
        season_week INT NOT NULL,
        home_game BOOLEAN NOT NULL,
        opponent_id VARCHAR(10) NOT NULL,
        result VARCHAR(10) NOT NULL,
        points_for INT NOT NULL,
        points_against INT NOT NULL,
        overtime BOOLEAN NOT NULL,
        passes_completed INT NOT NULL,
        passes_attempted INT NOT NULL,
        passing_yards INT NOT NULL,
        passing_touchdowns INT NOT NULL,
        passing_number_sackes INT NOT NULL,
        passing_sack_yards INT NOT NULL,
        rushing_attempts INT NOT NULL,
        rushing_yards INT NOT NULL,
        rushing_touchdowns INT NOT NULL,
        total_offensive_plays INT NOT NULL,
        total_offensive_yards INT NOT NULL,
        field_goals_attempted INT NOT NULL,
        field_goals_made INT NOT NULL,
        extra_points_attempted INT NOT NULL,
        extra_points_made INT NOT NULL,
        punts INT NOT NULL,
        punt_yards INT NOT NULL,
        first_downs_by_passing INT NOT NULL,
        first_downs_by_rushing INT NOT NULL,
        first_downs_by_penalty INT NOT NULL,
        first_downs_total INT NOT NULL,
        third_down_conversions INT NOT NULL,
        third_down_attempts INT NOT NULL,
        fourth_down_conversions INT NOT NULL,
        fourth_down_attempts INT NOT NULL,
        penalty_total INT NOT NULL,
        penalty_yards INT NOT NULL,
        fumbles_lost INT NOT NULL,
        interceptions_thrown INT NOT NULL,
        turnovers_total INT NOT NULL,
        time_of_possesion VARCHAR(10) NOT NULL,
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
        cur.execute(create_game_table_query)
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
        df.to_sql('games', engine, if_exists='append', index=False)
        print("Data inserted successfully")
    except Exception as error:
        print("Error inserting data:", error)