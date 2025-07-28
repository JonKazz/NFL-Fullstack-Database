import time
import random
import logging
import pandas as pd

pd.set_option("display.max_columns", None) # Show all columns

logging.basicConfig(level=logging.INFO)

def polite_sleep(min_seconds=6, max_seconds=8):
    time.sleep(random.randint(min_seconds, max_seconds))
