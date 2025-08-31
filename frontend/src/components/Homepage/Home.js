import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableSeasons } from '../../api/fetches';
import styles from './Home.module.css';

function Home() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const availableSeasons = await fetchAvailableSeasons();
        setSeasons(availableSeasons);
        // Set the first available season as default selected
        if (availableSeasons.length > 0) {
          setSelectedYear(availableSeasons[0]);
        }
      } catch (error) {
        console.error('Failed to fetch seasons:', error);
        // Fallback to hardcoded seasons if API fails
        const fallbackSeasons = [2023, 2024];
        setSeasons(fallbackSeasons);
        setSelectedYear(fallbackSeasons[0]);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, []);

  const handleExploreSeason = () => {
    if (!selectedYear) return;
    navigate(`/season/${selectedYear}`);
  };

  if (loading) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading seasons...</div>
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
            <div className={styles['nfl-logo-bg']}>
              <div className={styles['nfl-logo-placeholder']}>NFL</div>
            </div>
          </div>
          <div className={styles['header-content']}>
            <div className={styles['main-title']}>
              <h1>Kazmaier's NFL Database</h1>
              <p>Discover team performance, player statistics, and game results</p>
            </div>
          </div>
        </div>

        {/* Season Selection Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Select Season</h2>
          
          <div className={styles['selection-container']}>
            <div className={styles['year-selection']}>
              <label className={styles.label}>Choose Season</label>
              <div className={styles['year-grid']}>
                {seasons.map(year => (
                  <button
                    key={year}
                    className={`${styles['year-box']} ${selectedYear === year ? styles['year-box-selected'] : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    <span className={styles['year-number']}>{year}</span>
                    <span className={styles['year-label']}>Season</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Explore Button */}
          <div className={styles['button-container']}>
            <button 
              onClick={handleExploreSeason}
              className={styles.searchButton}
              disabled={!selectedYear}
            >
              Explore Season
            </button>
          </div>
        </div>

        {/* Database Stats Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>My Database</h2>
          
          <div className={styles['stats-overview']}>
            <div className={styles['stat-overview-item']}>
              <div className={styles['stat-overview-number']}>{seasons.length}</div>
              <div className={styles['stat-overview-label']}>Years</div>
              <div className={styles['stat-overview-detail']}>{seasons.length > 0 ? `${Math.min(...seasons)}-${Math.max(...seasons)}` : 'N/A'}</div>
            </div>
            
            <div className={styles['stat-overview-item']}>
              <div className={styles['stat-overview-number']}>32</div>
              <div className={styles['stat-overview-label']}>Teams</div>
              <div className={styles['stat-overview-detail']}>NFL Franchises</div>
            </div>
            
            <div className={styles['stat-overview-item']}>
              <div className={styles['stat-overview-number']}>6,800</div>
              <div className={styles['stat-overview-label']}>Games</div>
              <div className={styles['stat-overview-label']}>Total Seasons</div>
            </div>
            
            <div className={styles['stat-overview-item']}>
              <div className={styles['stat-overview-number']}>42,400</div>
              <div className={styles['stat-overview-label']}>Player Profiles</div>
              <div className={styles['stat-overview-detail']}>All Positions</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>What You'll Discover</h2>
          
          <div className={styles['features-grid']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>🏆</div>
              <h3>Season Standings</h3>
              <p>Complete team rankings, division standings, and playoff results</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>👑</div>
              <h3>Award Winners</h3>
              <p>MVP, Offensive/Defensive Player of the Year, and other honors</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>📊</div>
              <h3>Stat Leaders</h3>
              <p>League leaders in passing, rushing, receiving, and defensive stats</p>
            </div>
            
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>🏈</div>
              <h3>Team Analysis</h3>
              <p>Detailed team performance, schedules, and player rosters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
