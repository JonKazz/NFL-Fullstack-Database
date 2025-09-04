import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableSeasons, fetchGameInfoCount, fetchPlayerProfilesCount } from '../../api/fetches';
import styles from './Home.module.css';

function Home() {
  const [seasons, setSeasons] = useState([]);
  const [gameInfoCount, setGameInfoCount] = useState(0);
  const [playerProfilesCount, setPlayerProfilesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [availableSeasons, gameCount, playerCount] = await Promise.all([
          fetchAvailableSeasons(),
          fetchGameInfoCount(),
          fetchPlayerProfilesCount()
        ]);
        setSeasons(availableSeasons);
        setGameInfoCount(gameCount);
        setPlayerProfilesCount(playerCount);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to hardcoded values if API fails
        const fallbackSeasons = [2024];
        setSeasons(fallbackSeasons);
        setGameInfoCount(2800); // Fallback count
        setPlayerProfilesCount(13000); // Fallback count
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigateToSeason = (year) => {
    navigate(`/season/${year}`);
  };

  if (loading) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles['header-background']}>
            <div className={styles['logo-container']}>
              <img src="/icons/sh-logo.png" alt="NFL Logo" className={styles.logo} />
            </div>
            <div className={styles['header-stats']}>
              <div className={styles['header-stat']}><span className={styles.number}>{seasons.length}</span>&nbsp;&nbsp;SEASONS</div>
              <div className={styles['header-stat']}><span className={styles.number}>{gameInfoCount.toLocaleString()}</span>&nbsp;&nbsp;GAMES</div>
              <div className={styles['header-stat']}><span className={styles.number}>{playerProfilesCount.toLocaleString()}</span>&nbsp;&nbsp;PLAYER PROFILES</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Explore Seasons</h2>
          
          <div className={styles['season-grid']}>
            {seasons.map(year => (
              <button
                key={year}
                className={styles['season-button']}
                onClick={() => handleNavigateToSeason(year)}
              >
                <span className={styles['season-year']}>{year}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Features Section */}
        <div className={styles['features-section']}>
          <h2 className={styles['section-title']}>Comprehensive Data Coverage</h2>
          
          <div className={styles['features-grid']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <img src="/icons/crown.png" alt="Crown" className={styles['icon-image']} />
              </div>
              <h3>Seasonal Analysis</h3>
              <p>League leaders in all statistical categories, award winners, and team performance rankings</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <img src="/icons/stadium.png" alt="Stadium" className={styles['icon-image']} />
              </div>
              <h3>Team Analysis</h3>
              <p>Full seasonal games, comprehensive statistical categories, and detailed roster with performance metrics</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <img src="/icons/fb_icon.png" alt="Football" className={styles['icon-image']} />
              </div>
              <h3>Game Analysis</h3>
              <p>Complete drive-by-drive analysis, every player metric, and comprehensive team statistical comparisons</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <img src="/icons/player.png" alt="Player" className={styles['icon-image']} />
              </div>
              <h3>Player Analysis</h3>
              <p>100+ statistical metrics per game including passing, rushing, receiving, defensive, and special teams data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
