import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PlayerPage.module.css';
import PlayerHeader from './PlayerHeader';
import ProfileNotFoundBanner from './ProfileNotFoundBanner';
import PlayerStatsTable from './PlayerStatsTable';
import { fetchPlayerProfile, fetchPlayerStatsBySeason, fetchPlayerSeasonStats } from '../../api/fetches';

function PlayerPage() {
  const { playerId } = useParams();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null); // Will be set by YearSelector
  const [gameStats, setGameStats] = useState([]);
  const [seasonStats, setSeasonSeasonStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch player profile
  useEffect(() => {
    async function loadPlayerProfile() {
      try {
        setLoading(true);
        const data = await fetchPlayerProfile(playerId);
        
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
      loadPlayerProfile();
    }
  }, [playerId]);

  // Fetch player game stats when year changes
  useEffect(() => {
    async function loadPlayerStats() {
      try {
        setLoading(true);
        const stats = await fetchPlayerStatsBySeason(playerId, selectedYear);
        setGameStats(stats);
        
        // Fetch season summary
        try {
          const seasonStats = await fetchPlayerSeasonStats(playerId, selectedYear);
          setSeasonSeasonStats(seasonStats);
        } catch (seasonStatsErr) {
          console.warn('Could not fetch season summary:', seasonStatsErr);
          setSeasonSeasonStats(null);
        }
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError('Failed to load player statistics');
      } finally {
        setLoading(false);
      }
    }

    if (playerId && selectedYear) {
      loadPlayerStats();
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
            seasonStats={seasonStats}
            onYearChange={handleYearChange}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
