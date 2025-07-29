import pandas as pd
import requests
from bs4 import BeautifulSoup

class PlayerScraper():
    def __init__(self, url: str):
        html = requests.get(url)
        self.soup = BeautifulSoup(html.text, 'html.parser')
        self.player_df = {'url': url}
    
    
    