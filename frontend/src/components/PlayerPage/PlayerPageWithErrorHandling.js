import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PlayerPage.module.css';
import PlayerHeader from './PlayerHeader';
import ProfileNotFoundBanner from './ProfileNotFoundBanner';
import PlayerStatsTable from './PlayerStatsTable';
import { fetchPlayerProfile, fetchPlayerStatsBySeason, fetchPlayerSeasonStats } from '../../api/fetches';
import { useErrorHandler, is404Error } from '../../utils/errorHandler';

function PlayerPageWithErrorHandling() {
  const { playerId } = useParams();
  const { handleApiError, safeApiCall } = useErrorHandler();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [seasonStats, setSeasonSeasonStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch player profile with error handling
  useEffect(() => {
    async function loadPlayerProfile() {
      try {
        setLoading(true);
        setError(null);
        
        // Use safeApiCall to automatically handle errors
        const data = await safeApiCall(
          () => fetchPlayerProfile(playerId),
          { fallbackPath: '/' }
        );
        
        if (data.exists) {
          setPlayerProfile(data.profile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (err) {
        // Check if it's a 404 error (player not found)
        if (is404Error(err)) {
          setProfileExists(false);
          setError('Player not found');
        } else {
          console.error('Error fetching player profile:', err);
          setError('Failed to load player profile');
        }
      } finally {
        setLoading(false);
      }
    }

    if (playerId) {
      loadPlayerProfile();
    }
  }, [playerId, safeApiCall]);

  // Fetch player game stats when year changes
  useEffect(() => {
    async function loadPlayerStats() {
      try {
        setLoading(true);
        setError(null);
        
        const stats = await safeApiCall(
          () => fetchPlayerStatsBySeason(playerId, selectedYear),
          { fallbackPath: '/' }
        );
        setGameStats(stats);
        
        // Fetch season summary
        try {
          const seasonStats = await safeApiCall(
            () => fetchPlayerSeasonStats(playerId, selectedYear),
            { fallbackPath: '/' }
          );
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
  }, [playerId, selectedYear, safeApiCall]);

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

export default PlayerPageWithErrorHandling;
