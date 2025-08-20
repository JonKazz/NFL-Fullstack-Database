import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamsBySeason, fetchPlayoffGames } from '../../api/fetches';
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

      setAwards([
        { award: 'MVP', winner: 'Patrick Mahomes', team: 'Kansas City Chiefs' },
        { award: 'Offensive Player of the Year', winner: 'Tyreek Hill', team: 'Miami Dolphins' },
        { award: 'Defensive Player of the Year', winner: 'Myles Garrett', team: 'Cleveland Browns' },
        { award: 'Offensive Rookie of the Year', winner: 'C.J. Stroud', team: 'Houston Texans' },
        { award: 'Defensive Rookie of the Year', winner: 'Will Anderson Jr.', team: 'Houston Texans' },
        { award: 'Coach of the Year', winner: 'Dan Campbell', team: 'Detroit Lions' }
      ]);

      setStatLeaders({
        passing: { leader: 'Patrick Mahomes', team: 'Kansas City Chiefs', yards: 4183, tds: 31 },
        rushing: { leader: 'Christian McCaffrey', team: 'San Francisco 49ers', yards: 1459, tds: 14 },
        receiving: { leader: 'Tyreek Hill', team: 'Miami Dolphins', yards: 1799, tds: 13 },
        sacks: { leader: 'T.J. Watt', team: 'Pittsburgh Steelers', sacks: 19 },
        interceptions: { leader: 'DaRon Bland', team: 'Dallas Cowboys', ints: 9 }
      });
      
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

        {/* Awards and Stats */}
        <AwardsAndStats awards={awards} statLeaders={statLeaders} />
      </div>
    </div>
  );
}

export default SeasonSummary;