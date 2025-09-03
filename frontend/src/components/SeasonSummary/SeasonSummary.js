import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamsBySeason, fetchPlayoffGamesInfo, fetchSeasonInfo } from '../../api/fetches';
import styles from './SeasonSummary.module.css';
import Standings from './Standings';
import PlayoffBracket from './PlayoffBracket';
import AwardWinners from './AwardWinners';
import StatLeaders from './StatLeaders';
import TeamStatLeaders from './TeamStatLeaders';

function SeasonSummary() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [playoffs, setPlayoffs] = useState([]);
  const [awards, setAwards] = useState([]);

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
        const playoffGamesData = await fetchPlayoffGamesInfo(year);
        setPlayoffs(playoffGamesData);

        // Fetch season info including awards and stat leaders
        const seasonInfoData = await fetchSeasonInfo(year);
        
        if (seasonInfoData) {
          setSeasonInfo(seasonInfoData);
          
          // Transform awards data
          // Now using both player IDs and names to enable player images
          const awardsData = [
            { award: 'MVP', winner: seasonInfoData.mvpName, team: '', playerId: seasonInfoData.mvpId },
            { award: 'Offensive Player of the Year', winner: seasonInfoData.opoyName, team: '', playerId: seasonInfoData.opoyId },
            { award: 'Defensive Player of the Year', winner: seasonInfoData.dpoyName, team: '', playerId: seasonInfoData.dpoyId },
            { award: 'Offensive Rookie of the Year', winner: seasonInfoData.oroyName, team: '', playerId: seasonInfoData.oroyId },
            { award: 'Defensive Rookie of the Year', winner: seasonInfoData.droyName, team: '', playerId: seasonInfoData.droyId }
          ].filter(award => award.winner); // Only show awards that have winners

          setAwards(awardsData);


        } else {
          // Fallback to empty data if no season info found
          setSeasonInfo(null);
          setAwards([]);
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
          <h1>{year} NFL Season</h1>
          <p>League Overview, Standings, and Statistics</p>
        </div>



        {/* Standings */}
        <Standings teams={teams} year={year} />

        {/* Playoff Bracket */}
        <PlayoffBracket playoffs={playoffs} teams={teams} year={year} seasonInfo={seasonInfo} />

        {/* Awards and Stats */}
        {awards.length > 0 ? (
          <>
            <AwardWinners awards={awards} />
            <StatLeaders year={year} />
            <TeamStatLeaders year={year} />
          </>
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