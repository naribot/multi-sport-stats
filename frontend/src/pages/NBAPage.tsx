// src/pages/NBAPage.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './SoccerPage.css';


type NBAPlayer = {
  id: number;
  name: string;
  team: string;
  points: number;
  assists: number;
  rebounds: number;
};

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


export default function NBAPage() {
  const [compareList, setCompareList] = useState<NBAPlayer[]>([]);
  const keyOf = (p: NBAPlayer) => `${p.id ?? p.name}|${p.team}`.toLowerCase();
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<NBAPlayer | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const NBA_OPTIONS = [
  { value: "points", label: "Points" },
  { value: "assists", label: "Assists" },
  { value: "rebounds", label: "Rebounds" },
] as const;


const [selectedStats, setSelectedStats] = useState<Set<string>>(
  new Set(NBA_OPTIONS.map(o => o.value)) // default: all selected
);
const show = (v: string) =>
  selectedStats.size === NBA_OPTIONS.length || selectedStats.has(v);



    const navigate = useNavigate();

    const addToCompare = () => {
    if (!player) return;
        setCompareList(prev => {
        const exists = prev.some(x => keyOf(x) === keyOf(player));
    return exists ? prev : [...prev, player];
    });
   };


  const handleSearch = async () => {
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/nba/players/${query}`);
      if (!res.ok) throw new Error("Player not found");
      const data = await res.json();
      setPlayer(data);
    } catch (err) {
      setPlayer(null);
      setError("Player not found");
    }
  };

  const filteredStat = (stat: keyof NBAPlayer) => filter === "All" || filter === stat;

  return (
    <div className="page-wrapper nba-bg">
      <header className="header">
        <div className="header-container">
          <div className="logo">MultiSport Stats</div>
          <nav className="nav-tabs">
            {["Soccer", "NBA", "NFL", "MLB"].map((sport) => (
              <button
                key={sport}
                className={`tab ${sport === "NBA" ? "active" : ""}`}
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

      <main className="hero">
        <h1 className="hero-title">FIND YOUR NBA STATS</h1>
        <p className="hero-subtitle">Search by player name to view points, assists, and rebounds.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter player name (e.g., Curry)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-box">
            <MultiStatPicker
                options={NBA_OPTIONS as unknown as Option[]}
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
        {show("points") &&<th>PPG</th> }
        {show("assists") && <th>Assists</th> }
        {show("rebounds") && <th>Rebounds</th> }
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{player.name}</td>
        <td>{player.team}</td>
        {show("points")  && <td>{player.points}</td>}
        {show("assists") && <td>{player.assists}</td>}
        {show("rebounds") && <td>{player.rebounds}</td>}
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
    <h2 className="leaderboard-title">Leaderboard (Points)</h2>
    <table className="stats-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Team</th>
          <th>PPG</th>
          <th style={{width: 90}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...compareList]
          .sort((a, b) => b.points - a.points)
          .map((p, i) => (
            <tr key={keyOf(p)}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.team}</td>
              <td>{p.points}</td>
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
