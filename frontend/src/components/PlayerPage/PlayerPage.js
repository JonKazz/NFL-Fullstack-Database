import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PlayerPage.module.css';
import PlayerHeader from './PlayerHeader';
import ProfileNotFoundBanner from './ProfileNotFoundBanner';
import PlayerStatsTable from './PlayerStatsTable';

function PlayerPage() {
  const { playerId } = useParams();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null); // Will be set by YearSelector
  const [gameStats, setGameStats] = useState([]);
  const [seasonSummary, setSeasonSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch player profile
  useEffect(() => {
    async function fetchPlayerProfile() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/player-profiles/${playerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch player profile');
        }
        
        const data = await response.json();
        
        if (data.exists) {
          setPlayerProfile(data.profile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (err) {
        console.error('Error fetching player profile:', err);
        setProfileExists(false);
        setError('Failed to load player profile');
      } finally {
        setLoading(false);
      }
    }

    if (playerId) {
      fetchPlayerProfile();
    }
  }, [playerId]);

  // Fetch player game stats when year changes
  useEffect(() => {
    async function fetchPlayerStats() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/game-player-stats/player/${playerId}?seasonYear=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch player stats');
        }
        
        const stats = await response.json();
        setGameStats(stats);
        
        // Fetch season summary
        const summaryResponse = await fetch(`http://localhost:8080/api/game-player-stats/player/${playerId}/season/${selectedYear}/summary`);
        if (summaryResponse.ok) {
          const summary = await summaryResponse.json();
          setSeasonSummary(summary);
        }
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError('Failed to load player statistics');
      } finally {
        setLoading(false);
      }
    }

    if (playerId && selectedYear) {
      fetchPlayerStats();
    }
  }, [playerId, selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  if (loading) {
    return (
      <div className={styles['player-page']}>
        <div className={styles['loading']}>Loading player information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['player-page']}>
        <div className={styles['error']}>{error}</div>
      </div>
    );
  }

    return (
    <div className={styles['player-page']}>
      <div className={styles['player-container']}>
        {/* Profile Not Found Banner */}
        {!profileExists && (
          <ProfileNotFoundBanner playerId={playerId} />
        )}
        
        {/* Player Header - Full Width Above Tables */}
        {profileExists && (
          <div className={styles['player-header-section']}>
            <PlayerHeader profile={playerProfile} />
          </div>
        )}
        
        {/* Stats Tables - Full Width Below Header */}
        <div className={styles['stats-section']}>
          <PlayerStatsTable 
            playerId={playerId} 
            selectedYear={selectedYear}
            gameStats={gameStats}
            seasonSummary={seasonSummary}
            onYearChange={handleYearChange}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
