import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SoccerPage from "./pages/SoccerPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/soccer" replace />} />
        <Route path="/soccer" element={<SoccerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
