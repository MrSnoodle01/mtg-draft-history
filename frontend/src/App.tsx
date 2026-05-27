import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import DraftDetail from "./pages/DraftDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/draft/:draftId" element={<DraftDetail />} />
    </Routes>
  );
}

export default App;