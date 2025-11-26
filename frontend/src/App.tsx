import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SoccerPage from "./pages/SoccerPage";
import Navbar from "./components/Navbar";
import NBAPage from "./pages/NBAPage";
import NFLPage from "./pages/NFLPage";
import MLBPage from "./pages/MLBPage";
import SignUpPage from "./components/SignUpPage";





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
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
