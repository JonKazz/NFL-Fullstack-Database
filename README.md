# NFL DataCollector

A Python-based data collection system for NFL statistics and game data.

## Overview

This repository contains the data collection components for the NFL Database project, including web scrapers, data transformation utilities, and database loading scripts.

## Components

- **Scrapers**: Web scraping modules for collecting NFL data from various sources
- **Data Processing**: Transformation and cleaning utilities for collected data
- **Database Loading**: Scripts for loading processed data into the database
- **SQL Queries**: Database schema and query files
- **Tests**: Unit tests for the data collection system

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure the database connection in `config.py`

3. Run the data collection:
   ```bash
   python main.py
   ```

## Structure

- `scrapers/` - Web scraping modules
- `nfl_datacollector/` - Core data collection utilities
- `sql_queries/` - Database schema and queries
- `tests/` - Unit tests
- `load.py` - Database loading scripts
- `main.py` - Main execution script

## Requirements

- Python 3.8+
- Required packages listed in `requirements.txt`

