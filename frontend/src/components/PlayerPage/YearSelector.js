import React, { useState, useEffect } from 'react';
import styles from './YearSelector.module.css';

function YearSelector({ playerId, selectedYear, onYearChange }) {
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available seasons for this player
  useEffect(() => {
    async function fetchAvailableSeasons() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/season-stats/player/${playerId}/seasons`);
        
        if (response.ok) {
          const seasons = await response.json();
          setAvailableSeasons(seasons);
          
          // Set default to most recent season if no year is selected
          if (seasons.length > 0 && !selectedYear) {
            onYearChange(seasons[0]);
          }
        } else {
          console.error('Failed to fetch available seasons');
          setAvailableSeasons([]);
        }
      } catch (error) {
        console.error('Error fetching available seasons:', error);
        setAvailableSeasons([]);
      } finally {
        setLoading(false);
      }
    }

    if (playerId) {
      fetchAvailableSeasons();
    }
  }, [playerId, selectedYear, onYearChange]);

  if (loading) {
    return (
      <div className={styles['year-selector']}>
        <div className={styles['loading-seasons']}>Loading seasons...</div>
      </div>
    );
  }

  if (availableSeasons.length === 0) {
    return (
      <div className={styles['year-selector']}>
        <div className={styles['no-seasons']}>No seasons available</div>
      </div>
    );
  }

  return (
    <div className={styles['year-selector']}>
      <label htmlFor="season-select" className={styles['season-label']}>Season:</label>
      <select
        id="season-select"
        value={selectedYear || ''}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className={styles['season-dropdown']}
      >
        <option value="">Select Season</option>
        {availableSeasons.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default YearSelector;
