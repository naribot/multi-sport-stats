import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SoccerPage from "./pages/SoccerPage";
import Navbar from "./components/Navbar";
import NBAPage from "./pages/NBAPage";
import NFLPage from "./pages/NFLPage";
import MLBPage from "./pages/MLBPage";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/soccer" replace />} />
        <Route path="/soccer" element={<SoccerPage />} />
        <Route path="/nba" element={<NBAPage />} />
        <Route path="/nfl" element={<NFLPage />} />
        <Route path="/mlb" element={<MLBPage />} />
      </Routes>
    </BrowserRouter>
  );
}
