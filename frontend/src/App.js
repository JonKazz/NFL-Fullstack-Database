import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Homepage/Home';
import SeasonSummary from './components/SeasonSummary/SeasonSummary';
import TeamSeasonSummary from './components/TeamSeasonSummary/SeasonSummary';
import GameSummary from './components/GameSummary/GameSummary';
import PlayerPage from './components/PlayerPage/PlayerPage';
import { NotFound, ServerError } from './components/ErrorPages';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/season/:year" element={<SeasonSummary />} />
            <Route path="/:teamId/:year" element={<TeamSeasonSummary />} />
            <Route path="/game/:gameId" element={<GameSummary />} />
            <Route path="/player/:playerId" element={<PlayerPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
