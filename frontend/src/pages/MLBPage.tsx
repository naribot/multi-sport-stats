// src/pages/MLBPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SoccerPage.css';

function SignInModal({
  onClose,
  onSignIn,
}: {
  onClose: () => void;
  onSignIn: (username: string) => void;
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username.trim() && password.trim()) {
      const trimmedUser = username.trim();
      localStorage.setItem("user", trimmedUser);
      onSignIn(trimmedUser);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Sign In</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button className="sign-in" onClick={handleSubmit}>
            Submit
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>

        <button
          className="signup-link"
          onClick={() => {
            onClose();
            navigate("/signup");
          }}
        >
          New here? Create an account
        </button>
      </div>
    </div>
  );
}

function LogoutModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Log Out?</h2>
        <p>Are you sure you want to log out?</p>

        <div className="modal-actions">
          <button className="sign-in" onClick={onConfirm}>
            Yes, Log Out
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

type MLBPlayer = {
  id: number;
  name: string;
  team: string;
  homeRuns: number;
  battingAverage: number;
  RBIs: number;
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
      allSelected ? new Set() : new Set(options.map(o => o.value))
    );
  };

  return (
    <div className="multiselect">
      <button type="button" className="ms-trigger" onClick={() => setOpen(v => !v)}>
        {label} {allSelected || selected.size === 0 ? "(All)" : `(${selected.size})`} <span>▾</span>
      </button>
      {open && (
        <div className="ms-menu">
          <label className="ms-item">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            <span>Select all</span>
          </label>
          {options.map(opt => (
            <label key={opt.value} className="ms-item">
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

export default function MLBPage() {
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<MLBPlayer | null>(null);
  const [error, setError] = useState("");
  const [compareList, setCompareList] = useState<MLBPlayer[]>([]);
  const navigate = useNavigate();

  const MLB_OPTIONS = [
    { value: "homeRuns", label: "Home Runs" },
    { value: "battingAverage", label: "AVG" },
    { value: "RBIs", label: "RBIs" }
  ];

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));


  const [selectedStats, setSelectedStats] = useState<Set<string>>(
    new Set(MLB_OPTIONS.map(o => o.value))
  );

  const show = (v: string) =>
    selectedStats.size === MLB_OPTIONS.length || selectedStats.has(v);

  const keyOf = (p: MLBPlayer) => `${p.id ?? p.name}|${p.team}`.toLowerCase();

  const addToCompare = () => {
    if (!player) return;
    setCompareList(prev =>
      prev.some(x => keyOf(x) === keyOf(player)) ? prev : [...prev, player]
    );
  };

  const handleSearch = async () => {
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/mlb/players/${query}`);
      if (!res.ok) throw new Error("Player not found");
      const data = await res.json();
      setPlayer(data);
    } catch {
      setPlayer(null);
      setError("Player not found");
    }
  };

  return (
    <div className="page-wrapper mlb-bg">
      <header className="header">
        <div className="header-container">
          <div className="logo">MultiSport Stats</div>
          <nav className="nav-tabs">
            {["Soccer", "NBA", "NFL", "MLB"].map((sport) => (
              <button
                key={sport}
                className={`tab ${sport === "MLB" ? "active" : ""}`}
                onClick={() => navigate(`/${sport.toLowerCase()}`)}
              >
                {sport}
              </button>
            ))}
          </nav>
          <div className="auth-buttons">
            {user ? (
                      <>
                        <span style={{ marginRight: "1rem" }}>Hi, {user}!</span>
                        <button className="sign-in" onClick={() => setShowLogoutModal(true)}>Logout</button>

                        {showLogoutModal && (
                          <LogoutModal
                            onClose={() => setShowLogoutModal(false)}
                            onConfirm={() => {
                            localStorage.removeItem("user");
                            setShowLogoutModal(false);
                            window.location.reload();
                            }}
                          />
                        )}
                      </>
                    ) : (
                        <button className="sign-in" onClick={() => setShowSignIn(true)}>Sign In</button>
                        )
              }
          </div>
        </div>
      </header>

      <main className="hero">
        <h1 className="hero-title">FIND YOUR MLB STATS</h1>
        <p className="hero-subtitle">Search by player name to view HRs, AVG, and RBIs.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter player name (e.g., Judge)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-box">
          <MultiStatPicker
            options={MLB_OPTIONS}
            selected={selectedStats}
            onChange={setSelectedStats}
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
                    {show("homeRuns") && <th>HR</th>}
                    {show("battingAverage") && <th>AVG</th>}
                    {show("RBIs") && <th>RBIs</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{player.name}</td>
                    <td>{player.team}</td>
                    {show("homeRuns") && <td>{player.homeRuns}</td>}
                    {show("battingAverage") && <td>{player.battingAverage}</td>}
                    {show("RBIs") && <td>{player.RBIs}</td>}
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
            <h2 className="leaderboard-title">Leaderboard (HR)</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>HR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...compareList]
                  .sort((a, b) => b.homeRuns - a.homeRuns)
                  .map((p, i) => (
                    <tr key={keyOf(p)}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.team}</td>
                      <td>{p.homeRuns}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => setCompareList(prev =>
                            prev.filter(x => keyOf(x) !== keyOf(p))
                          )}
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
      {showSignIn && (
  <SignInModal
    onClose={() => setShowSignIn(false)}
    onSignIn={(username) => setUser(username)}
  />
)}
    </div>
  );
}
