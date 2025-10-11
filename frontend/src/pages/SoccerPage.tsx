import { useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { fetchPlayerByName } from "../api/soccerApi";
import './SoccerPage.css';

export default function SoccerPage() {
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedStat, setSelectedStat] = useState("all");


  const handleSearch = async () => {
    setError("");
    try {
      const data = await fetchPlayerByName(query);
      if (!data) {
        setError("Player not found");
        setPlayer(null);
      } else {
        setPlayer(data);
      }
    } catch {
      setError("Something went wrong. Try again later.");
    }
  };

  return (

    
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">MultiSport Stats</div>
          <nav className="nav-tabs">
            {["Soccer", "NBA", "NFL", "MLB"].map((sport) => (
              <button
                key={sport}
                className={`tab ${sport === "Soccer" ? "active" : ""}`}
              >
                {sport}
              </button>
            ))}
          </nav>
          <div className="auth-buttons">
            <button className="sign-in">Sign In</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <h1 className="hero-title">FIND YOUR SOCCER STATS</h1>
        <p className="hero-subtitle">Search by player name to view goals, assists, and disciplinary stats.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter player name (e.g., Messi)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-box">
          <label htmlFor="stat-filter">Filter Stat: </label>
          <select
            id="stat-filter"
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
          >
            <option value="all">All</option>
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="yellowCards">Yellow Cards</option>
          </select>
        </div>


       <div className="result">
        {error && <p className="error">{error}</p>}
        {player && (
  <table className="stats-table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Team</th>
        {selectedStat === "all" || selectedStat === "goals" ? <th>Goals</th> : null}
        {selectedStat === "all" || selectedStat === "assists" ? <th>Assists</th> : null}
        {selectedStat === "all" || selectedStat === "yellowCards" ? <th>Yellow Cards</th> : null}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{player.name}</td>
        <td>{player.team}</td>
        {(selectedStat === "all" || selectedStat === "goals") && <td>{player.goals}</td>}
        {(selectedStat === "all" || selectedStat === "assists") && <td>{player.assists}</td>}
        {(selectedStat === "all" || selectedStat === "yellowCards") && <td>{player.yellowCards}</td>}
      </tr>
    </tbody>
  </table>
)}

    </div>
  </main>
</div>
  );
}
