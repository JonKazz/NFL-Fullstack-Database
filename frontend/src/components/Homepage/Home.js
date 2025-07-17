import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [teamId, setTeamId] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!teamId || !year) return;
    navigate(`/season?teamId=${encodeURIComponent(teamId)}&year=${encodeURIComponent(year)}`);
  };

  return (
    <div>
      <h1>NFL Game Search</h1>
      <div>
        <input
          type="text"
          placeholder="Team"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
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
