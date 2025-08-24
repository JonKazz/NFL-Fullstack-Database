import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamsBySeason, fetchPlayoffGames, fetchSeasonInfo } from '../../api/fetches';
import styles from './SeasonSummary.module.css';
import Standings from './Standings';
import PlayoffBracket from './PlayoffBracket';
import AwardsAndStats from './AwardsAndStats';

function SeasonSummary() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [playoffs, setPlayoffs] = useState([]);
  const [awards, setAwards] = useState([]);
  const [statLeaders, setStatLeaders] = useState({});
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teams from backend
        const teamsData = await fetchTeamsBySeason(year);
        setTeams(teamsData);
        
        // Fetch playoff games from backend
        const playoffGamesData = await fetchPlayoffGames(year);
        setPlayoffs(playoffGamesData);

        // Fetch season info including awards and stat leaders
        const seasonInfoData = await fetchSeasonInfo(year);
        
        if (seasonInfoData) {
          setSeasonInfo(seasonInfoData);
          
          // Transform awards data
          const awardsData = [
            { award: 'MVP', winner: seasonInfoData.mvpName, team: '' },
            { award: 'Offensive Player of the Year', winner: seasonInfoData.opoyName, team: '' },
            { award: 'Defensive Player of the Year', winner: seasonInfoData.dpoyName, team: '' },
            { award: 'Offensive Rookie of the Year', winner: seasonInfoData.oroyName, team: '' },
            { award: 'Defensive Rookie of the Year', winner: seasonInfoData.droyName, team: '' }
          ].filter(award => award.winner); // Only show awards that have winners

          setAwards(awardsData);

          // Transform stat leaders data
          const statLeadersData = {};
          if (seasonInfoData.passingLeaderName) {
            statLeadersData.passing = { leader: seasonInfoData.passingLeaderName, team: '', yards: '', tds: '' };
          }
          if (seasonInfoData.rushingLeaderName) {
            statLeadersData.rushing = { leader: seasonInfoData.rushingLeaderName, team: '', yards: '', tds: '' };
          }
          if (seasonInfoData.receivingLeaderName) {
            statLeadersData.receiving = { leader: seasonInfoData.receivingLeaderName, team: '', yards: '', tds: '' };
          }

          setStatLeaders(statLeadersData);
        } else {
          // Fallback to empty data if no season info found
          setSeasonInfo(null);
          setAwards([]);
          setStatLeaders({});
        }
      
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year]);



  if (loading) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading {year} Season Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            ← Back to Home
          </button>
          <h1>{year} NFL Season</h1>
          <p>League Overview, Standings, and Statistics</p>
        </div>



        {/* Standings */}
        <Standings teams={teams} year={year} />

        {/* Playoff Bracket */}
        <PlayoffBracket playoffs={playoffs} teams={teams} year={year} />

        {/* Super Bowl Champion */}
        {seasonInfo?.sbChamp && (
          <div className={styles.section}>
            <h2 className={styles['section-title']}>Super Bowl Champion</h2>
            <div className={styles['champion-display']}>
              <h3>{seasonInfo.sbChamp}</h3>
            </div>
          </div>
        )}

        {/* Awards and Stats */}
        {awards.length > 0 || Object.keys(statLeaders).length > 0 ? (
          <AwardsAndStats awards={awards} statLeaders={statLeaders} />
        ) : (
          <div className={styles.section}>
            <h2 className={styles['section-title']}>Season Information</h2>
            <div className={styles['no-data-message']}>
              <p>Season awards and statistics are not yet available for {year}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeasonSummary;