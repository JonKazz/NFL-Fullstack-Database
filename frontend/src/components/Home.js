import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!team || !year) return;
    try {
      const res = await fetch(`http://localhost:8080/api/games/search?team=${team}&year=${year}`);
      const data = await res.json();
      navigate('/results', { state: { team, year, games: data } });
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  return (
    <div>
      <h1>NFL Game Search</h1>
      <div>
        <input
          type="text"
          placeholder="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default Home;
