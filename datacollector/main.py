from games_table.main import run as run_games
from player_games_table.main import run as run_playergames
from teams_table.main import run as run_teams

from games2_table.main import run as tester


if __name__ == "__main__":
    tester(start_week=1, end_week=18)
    