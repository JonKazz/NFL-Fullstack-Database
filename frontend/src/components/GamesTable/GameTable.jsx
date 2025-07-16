import { useNavigate } from 'react-router-dom';
import './GameTable.css';

function GameTable({ games }) {
  const navigate = useNavigate();

  const handleClick = (gameId, teamId) => {
    navigate(`/game/${gameId}/${teamId}`);
  };

  return (
    <table className="game-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Week</th>
          <th>Opponent</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr
            key={game.gameId}
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick(game.gameId, game.teamId)}
          >
            <td>{game.date}</td>
            <td>{game.seasonWeek}</td>
            <td>{game.opponent}</td>
            <td>{game.result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GameTable;
