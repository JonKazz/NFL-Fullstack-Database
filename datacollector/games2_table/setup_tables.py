from .load import create_game_stats_table, create_game_info_table

if __name__ == "__main__":
    create_game_stats_table()
    create_game_info_table()
    print("Tables created successfully.")