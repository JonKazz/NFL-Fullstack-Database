import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../utils/errorHandler';

/**
 * Custom hook for validating data existence and handling 404 redirects
 * @param {Function} validationFunction - Function that returns a promise indicating if data exists
 * @param {Array} dependencies - Dependencies to watch for changes
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing loading state, error state, and data existence
 */
export const useDataValidation = (validationFunction, dependencies = [], options = {}) => {
  const { fallbackPath = '/', redirectOn404 = true } = options;
  const navigate = useNavigate();
  const { safeApiCall } = useErrorHandler();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataExists, setDataExists] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const validateData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await safeApiCall(validationFunction, { fallbackPath });
        
        if (isMounted) {
          if (result && result.exists !== false) {
            setDataExists(true);
            setData(result);
          } else {
            setDataExists(false);
            if (redirectOn404) {
              navigate('/404');
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Data validation error:', err);
          setError(err.message);
          setDataExists(false);
          if (redirectOn404) {
            navigate('/404');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (validationFunction) {
      validateData();
    }

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return {
    loading,
    error,
    dataExists,
    data
  };
};

/**
 * Hook specifically for validating seasons
 * @param {string|number} year - The year to validate
 * @returns {Object} Validation result
 */
export const useSeasonValidation = (year) => {
  const { checkSeasonExists } = require('../api/fetches');
  
  return useDataValidation(
    async () => {
      if (!year) return { exists: false };
      
      const yearExists = await checkSeasonExists(parseInt(year));
      
      return {
        exists: yearExists,
        year: parseInt(year)
      };
    },
    [year],
    { fallbackPath: '/' }
  );
};

/**
 * Hook specifically for validating players
 * @param {string} playerId - The player ID to validate
 * @returns {Object} Validation result
 */
export const usePlayerValidation = (playerId) => {
  const { fetchPlayerProfile } = require('../api/fetches');
  
  return useDataValidation(
    async () => {
      if (!playerId) return { exists: false };
      
      const profile = await fetchPlayerProfile(playerId);
      return profile;
    },
    [playerId],
    { fallbackPath: '/' }
  );
};

/**
 * Hook specifically for validating games
 * @param {string} gameId - The game ID to validate
 * @returns {Object} Validation result
 */
export const useGameValidation = (gameId) => {
  const { checkGameExists } = require('../api/fetches');
  
  return useDataValidation(
    async () => {
      if (!gameId) return { exists: false };
      
      const gameExists = await checkGameExists(gameId);
      
      return {
        exists: gameExists,
        gameId
      };
    },
    [gameId],
    { fallbackPath: '/' }
  );
};

/**
 * Hook specifically for validating team seasons
 * @param {string} teamId - The team ID to validate
 * @param {string|number} year - The year to validate
 * @returns {Object} Validation result
 */
export const useTeamSeasonValidation = (teamId, year) => {
  const { fetchTeam, fetchAvailableSeasons } = require('../api/fetches');
  const { TEAM_MAP } = require('../utils');
  
  return useDataValidation(
    async () => {
      if (!teamId || !year) return { exists: false };
      
      // First check if teamId exists in TEAM_MAP
      const isValidTeamId = Object.keys(TEAM_MAP).includes(teamId);
      if (!isValidTeamId) {
        return { exists: false, teamId, year: parseInt(year) };
      }
      
      // Then check if the year exists
      const availableSeasons = await fetchAvailableSeasons();
      const yearExists = availableSeasons.includes(parseInt(year));
      
      if (!yearExists) {
        return { exists: false, teamId, year: parseInt(year) };
      }
      
      // Finally check if the team exists for that year
      const teamInfo = await fetchTeam(teamId, year);
      return {
        exists: true,
        teamInfo,
        teamId,
        year: parseInt(year)
      };
    },
    [teamId, year],
    { fallbackPath: '/' }
  );
};
