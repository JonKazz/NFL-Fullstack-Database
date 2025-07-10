import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!team || !year) return;
    navigate(`/results?team=${encodeURIComponent(team)}&year=${encodeURIComponent(year)}`);
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
