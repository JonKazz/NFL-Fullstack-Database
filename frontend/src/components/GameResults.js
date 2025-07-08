import { useLocation } from 'react-router-dom';
import GameTable from './GameTable';

function GameResults() {
  const { state } = useLocation();
  const { team, year, games } = state || {};

  if (!games) return <p>No game data provided.</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{team.toUpperCase()} – {year}</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <GameTable games={games} />
      </div>
    </div>
  );
}

export default GameResults;
