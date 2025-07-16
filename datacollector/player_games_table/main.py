from .ingest import scrape_player_game_logs    
from .load import create_player_games_table, insert_df

def run():
    print("Scraping playergames logs and transforming...")
    df = scrape_player_game_logs(2)
    print("Creating player_games table...")
    create_player_games_table()
    print("Inserting into database...")
    insert_df(df)
    print("Done.")