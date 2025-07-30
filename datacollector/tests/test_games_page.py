import pytest
from datacollector.games_page.ingest import GameScraper

def test_game_scraper_basic():
    url = 'https://www.pro-football-reference.com/boxscores/202409050kan.htm'
    scraper = GameScraper(url)
    
    assert scraper.soup is not None
    assert scraper.game_id == '2024_kan_rav_1'
    
    
    
    
    
    df_game_info = scraper.get_game_info()
    df_game_stats = scraper.get_game_stats()
    df_player_stats = scraper.get_game_player_stats()
    
    assert df_game_info is not None
    assert df_game_stats is not None
    assert df_player_stats is not None
    
    
