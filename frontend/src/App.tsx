import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import DraftDetail from "./pages/DraftDetail";
import PlayerStats from "./pages/PlayerStats";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/draft/:draftId" element={<DraftDetail />} />
      <Route path="/playerStats" element={<PlayerStats />} />
    </Routes>
  );
}

export default App;