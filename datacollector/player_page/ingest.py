import pandas as pd
import requests
import re
from bs4 import BeautifulSoup

class PlayerScraper():
    def __init__(self, url: str):
        html = requests.get(url)
        self.soup = BeautifulSoup(html.text, 'html.parser')
        self.player_df = {'url': url}
    

    def get_player_info(self) -> pd.DataFrame:
        self._parse_player_metadata
    
    
    def _parse_player_metadata(self) -> pd.DataFrame:
        meta = self.soup.find('div', id='meta')
        if not meta:
            raise ValueError("[!] Could not find metadata div")

        def get_text_or_fail(tag, desc):
            if tag:
                return tag.get_text(strip=True)
            raise ValueError(f"[!] Missing required field: {desc}")

        # Name (from <h1><span>)
        name = get_text_or_fail(meta.find('h1').find('span'), 'name')

        # Height and Weight
        hw_tag = meta.find(string=re.compile(r'\d+-\d+.*lb'))
        if not hw_tag:
            raise ValueError("[!] Missing height and weight")
        hw_text = hw_tag.parent.get_text()
        height_match = re.search(r'(\d+-\d+)', hw_text)
        weight_match = re.search(r'(\d+)lb', hw_text)
        if not height_match or not weight_match:
            raise ValueError("[!] Height or weight format missing")
        height = height_match.group(1)
        weight = weight_match.group(1)

        # Date of Birth
        dob_span = meta.find('span', {'id': 'necro-birth'})
        dob = dob_span.get('data-birth') if dob_span else None
        if not dob:
            raise ValueError("[!] Missing date of birth")

        # College
        college_link = meta.find('strong', string='College:')
        if not college_link:
            raise ValueError("[!] Missing college")
        college = college_link.find_next('a').text.strip()

        # Draft Info
        draft_text = meta.find('p', string=re.compile(r'Draft'))
        if not draft_text:
            raise ValueError("[!] Missing draft information")

        draft_links = draft_text.find_all('a')
        if len(draft_links) < 3:
            raise ValueError("[!] Incomplete draft info")

        draft_team = draft_links[0].text.strip()
        draft_year_match = re.search(r'(\d{4}) NFL Draft', draft_text.get_text())
        draft_year = draft_year_match.group(1) if draft_year_match else None

        draft_pick_match = re.search(r'in the (\d+)[a-z]{2} round \((\d+)[a-z]{2} overall\)', draft_text.get_text())
        if not draft_year or not draft_pick_match:
            raise ValueError("[!] Could not parse draft round and number")
        draft_round = draft_pick_match.group(1)
        draft_pick = draft_pick_match.group(2)

        # Build the DataFrame
        df = pd.DataFrame([{
            'name': name,
            'height': height,
            'weight': weight,
            'dob': dob,
            'college': college,
            'draft_team': draft_team,
            'draft_year': int(draft_year),
            'draft_round': int(draft_round),
            'draft_pick': int(draft_pick)
        }])

        return df
