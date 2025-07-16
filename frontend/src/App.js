import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Homepage/Home';
import SeasonSummary from './components/SeasonSummary/SeasonSummary';
import GameSummary from './components/GameSummary/GameSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/season" element={<SeasonSummary />} />
        <Route path="/game" element={<GameSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
