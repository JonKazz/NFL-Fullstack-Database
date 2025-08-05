from .ingest import PlayerProfilePageScraper

def ETL_player_profile(url, loader):
    scraper = PlayerProfilePageScraper()
    scraper.load_page(url)
    player_profile_df = scraper.get_player_profile()
    loader.insert_player_profile_df(player_profile_df)

