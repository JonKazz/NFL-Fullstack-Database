import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAvailableSeasons } from '../../api/fetches';
import styles from './Navigation.module.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const availableSeasons = await fetchAvailableSeasons();
        setSeasons(availableSeasons);
      } catch (error) {
        console.error('Failed to fetch seasons:', error);
        // Fallback to hardcoded seasons if API fails
        setSeasons([2023, 2024]);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, []);

  // Add/remove body class to control main content margin
  useEffect(() => {
    // Always show sidebar since navigation is visible on all pages
    document.body.classList.add('has-sidebar');

    // Cleanup function
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSeasonClick = (year) => {
    navigate(`/season/${year}`);
  };

  if (loading) {
    return (
      <div className={styles.navigation}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.navItem} onClick={handleHomeClick}>
        Home
      </div>
      
      <div className={styles.seasonsSection}>
        <div className={styles.seasonsLabel}>Seasons</div>
        {seasons.map(year => (
          <div 
            key={year} 
            className={styles.navItem}
            onClick={() => handleSeasonClick(year)}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navigation;
