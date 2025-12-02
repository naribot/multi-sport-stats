import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SoccerPage from "./pages/SoccerPage";
import Navbar from "./components/Navbar";
import NBAPage from "./pages/NBAPage";
import NFLPage from "./pages/NFLPage";
import MLBPage from "./pages/MLBPage";
import SignUpPage from "./components/SignUpPage";
import NBAExpandedPage from "./details/NBAExpandedPage";
import MLBExpandedPage from "./details/MLBExpandedPage";
import NFLExpandedPage from "./details/NFLExpandedPage";
import FantasyPage from "./pages/FantasyPage";



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
        <Route path="/nba/expanded/:name" element={<NBAExpandedPage />} />
        <Route path="/mlb/expanded/:name" element={<MLBExpandedPage />} />
        <Route path="/nfl/details/:name" element={<NFLExpandedPage />} />
        <Route path="/fantasy" element={<FantasyPage />} />

      </Routes>
    </BrowserRouter>
  );
}
