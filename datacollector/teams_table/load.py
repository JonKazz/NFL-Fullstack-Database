import psycopg2
from config import HOSTNAME, DATABASE, USERNAME, PASSWORD, PORT
import sqlalchemy

def create_teams_table():
    query = '''
    DROP TABLE IF EXISTS teams;
    CREATE TABLE teams (
        team_id VARCHAR(50) NOT NULL,
        team VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        coach VARCHAR(100),
        points_for VARCHAR(500),
        points_against VARCHAR(500),
        wins INT,
        losses INT,
        ties INT,
        division_rank INT,
        division VARCHAR(100),
        off_coordinator VARCHAR(500),
        def_coordinator VARCHAR(500),
        stadium VARCHAR(500),
        off_scheme VARCHAR(500),
        def_alignment VARCHAR(500),
        missed_playoffs BOOLEAN,
        lost_wild_card BOOLEAN,
        lost_divisional BOOLEAN,
        lost_conference_championship BOOLEAN,
        lost_superbowl BOOLEAN,
        won_superbowl BOOLEAN,
        PRIMARY KEY (team_id)
    );

    '''
    conn = psycopg2.connect(
        host=HOSTNAME, dbname=DATABASE, user=USERNAME,
        password=PASSWORD, port=PORT
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(query)
    cur.close()
    conn.close()

def insert_teams(df):
    engine = sqlalchemy.create_engine(
        f'postgresql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}'
    )
    df.to_sql("teams", engine, if_exists="append", index=False)
