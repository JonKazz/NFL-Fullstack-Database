function GameTable({ games }) {
  return (
    <table>
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
          <tr key={game.id}>
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
