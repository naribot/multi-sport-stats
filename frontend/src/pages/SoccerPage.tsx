import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import { fetchPlayerByName } from "../api/soccerApi";
import './SoccerPage.css';


type Option = { value: string; label: string };

function MultiStatPicker({
  options,
  selected,
  onChange,
  label = "Filter Stat",
}: {
  options: Option[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  const allSelected = options.every(o => selected.has(o.value));

  const toggleOne = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  };

  const toggleAll = () => {
    onChange(
      allSelected
        ? new Set<string>() // none selected
        : new Set(options.map(o => o.value)) // select all
    );
  };

  return (
    <div className="multiselect">
      <button
        type="button"
        className="ms-trigger"
        onClick={() => setOpen(v => !v)}
      >
        {label} {allSelected || selected.size === 0 ? "(All)" : `(${selected.size})`}
        <span aria-hidden> ▾</span>
      </button>

      {open && (
        <div className="ms-menu">
          <label className="ms-item">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span>Select all</span>
          </label>

          {options.map(opt => (
            <label className="ms-item" key={opt.value}>
              <input
                type="checkbox"
                checked={selected.has(opt.value)}
                onChange={() => toggleOne(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}


export default function SoccerPage() {
  type SoccerPlayer = {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
};

const [compareList, setCompareList] = useState<SoccerPlayer[]>([]);
const keyOf = (p: SoccerPlayer) => `${p.name}|${p.team}`.toLowerCase();

  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState("");
  const SOCCER_OPTIONS = [
  { value: "goals", label: "Goals" },
  { value: "assists", label: "Assists" },
  { value: "yellowCards", label: "Yellow Cards" },
] as const;

const [selectedStats, setSelectedStats] = useState<Set<string>>(
  new Set(SOCCER_OPTIONS.map(o => o.value)) // default: all selected
);
const show = (v: string) =>
  selectedStats.size === SOCCER_OPTIONS.length || selectedStats.has(v);



  const navigate = useNavigate();

  const handleSearch = async () => {
    setError("");
    try {
      const data = await fetchPlayerByName(query);
      if (!data) {
        setError("Player not found");
        setPlayer(null);
      } const mapped: SoccerPlayer = {
      name: data.name,
      team: data.team,
      position: data.position,                  
      goals: Number(data.goals),
      assists: Number(data.assists),
      yellowCards: Number(data.yellowCards),
    };

    setPlayer(mapped);
      }
     catch {
      setError("Something went wrong. Try again later.");
    }
  };

  const addToCompare = () => {
  console.log("Add clicked. player =", player);
  if (!player) return;

  setCompareList(prev => {
    const exists = prev.some(x => keyOf(x) === keyOf(player));
    const next = exists ? prev : [...prev, player];
    console.log("compareList ->", next);
    return next;
  });
};


  return (

    
    <div className="page-wrapper soccer-bg">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">MultiSport Stats</div>
          <nav className="nav-tabs">
            {["Soccer", "NBA", "NFL", "MLB"].map((sport) => (
              <button
                key={sport}
                className={`tab ${sport === "Soccer" ? "active" : ""}`}
                onClick={() => navigate(`/${sport.toLowerCase()}`)}
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
          <MultiStatPicker
            options={SOCCER_OPTIONS as unknown as Option[]}
            selected={selectedStats}
            onChange={setSelectedStats}
            label="Filter Stat"
          />
        </div>



       <div className="result">
        {error && <p className="error">{error}</p>}
        {player && (
          <>
  <table className="stats-table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Team</th>
        <th>Position</th>
        {show("goals") && <th>Goals</th> }
        {show("assists") && <th>Assists</th>}
        {show("yellowCards") &&<th>Yellow Cards</th>}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{player.name}</td>
        <td>{player.team}</td>
        {show("position") && <td>{player.position}</td>}
        {show("goals") && <td>{player.goals}</td>}
        {show("assists") && <td>{player.assists}</td>}
        {show("yellowCards") && <td>{player.yellowCards}</td>}
      </tr>
    </tbody>
  </table>
  <div className="compare-actions">
      <button className="add-btn" onClick={addToCompare}>Add</button>
  </div>
  </>
  
)}
    </div>
    {compareList.length > 0 && (
  <section className="leaderboard">
    <h2 className="leaderboard-title">Leaderboard (Goals)</h2>
    <table className="stats-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Team</th>
          <th>Position</th>
          <th>Goals</th>
          <th style={{width: 90}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...compareList]
          .sort((a, b) => b.goals - a.goals)
          .map((p, i) => (
            <tr key={keyOf(p)}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.team}</td>
              <td>{p.position}</td>
              <td>{p.goals}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() =>
                    setCompareList(prev => prev.filter(x => keyOf(x) !== keyOf(p)))
                  }
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>

    <div className="compare-actions">
      <button className="clear-btn" onClick={() => setCompareList([])}>Clear All</button>
    </div>
  </section>
)}
  </main>
</div>
  );
}
