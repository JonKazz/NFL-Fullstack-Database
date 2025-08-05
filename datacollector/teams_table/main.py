from .ingest import TeamPageScraper
from .transform import transform_teams_table


def ETL_season_team_info(url, loader):
    team_page = TeamPageScraper()
    team_page.load_page(url)
    
    season_team_info_df = team_page.scrape_team_summary()
    
    season_team_info_df = transform_teams_table(season_team_info_df)
    
    loader.insert_season_team_info_df(season_team_info_df)


def extract_game_links(url):
    team_page = TeamPageScraper()
    team_page.load_page(url)
    game_links = team_page.extract_game_pages_urls()
    return game_links
