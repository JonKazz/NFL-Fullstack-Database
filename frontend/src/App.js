import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Homepage/Home';
import SeasonSummary from './components/SeasonSummary/SeasonSummary';
import TeamSeasonSummary from './components/TeamSeasonSummary/SeasonSummary';
import GameSummary from './components/GameSummary/GameSummary';
import PlayerPage from './components/PlayerPage/PlayerPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/season/:year" element={<SeasonSummary />} />
            <Route path="/team-season/:year/:teamId" element={<TeamSeasonSummary />} />
            <Route path="/game/:gameId" element={<GameSummary />} />
            <Route path="/player/:playerId" element={<PlayerPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
