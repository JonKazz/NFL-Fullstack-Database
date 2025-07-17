from .ingest import scrape_teams
from .transform import transform_teams_table
from .load import create_teams_table, insert_teams

def run():
    print("Scraping team tables...")
    df = scrape_teams()
    print("Transforming team tables...")
    df = transform_teams_table(df)
    print("Creating team tables...")
    create_teams_table()
    print("Inserting team tables into database...")
    insert_teams(df)
    print("Done.")
