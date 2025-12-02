import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './SoccerPage.css';
import { fetchNFLPlayer } from "../api/nflApi";
import PredictionChat from "../components/PredictionChat";
import { addToFantasy } from "../api/fantasyApi";
import Toast from "../components/Toast";
import { saveRecentSearch, getRecentSearches, clearRecentSearches } from "../api/recentSearches";


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

type NFLPlayer = {
  id: number;
  name: string;
  team: string;
  touchdowns: number;
  yards: number;
  interceptions: number;
  
};

type Option = { value: string; label: string };

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
        <p style={{color: "Red"}}>Are you sure you want to log out?</p>

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
      allSelected ? new Set<string>() : new Set(options.map(o => o.value))
    );
  };

  return (
    <div className="multiselect">
      <button type="button" className="ms-trigger" onClick={() => setOpen(v => !v)}>
        {label} {allSelected || selected.size === 0 ? "(All)" : `(${selected.size})`}
        <span aria-hidden> ▾</span>
      </button>
      {open && (
        <div className="ms-menu">
          <label className="ms-item">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
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

export default function NFLPage() {
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<NFLPlayer | null>(null);
  const [error, setError] = useState("");
  const [compareList, setCompareList] = useState<NFLPlayer[]>([]);
  const navigate = useNavigate();

  const keyOf = (p: NFLPlayer) => `${p.id ?? p.name}|${p.team}`.toLowerCase();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));

  const NFL_OPTIONS = [
    { value: "touchdowns", label: "Touchdowns" },
    { value: "yards", label: "Yards" },
    { value: "interceptions", label: "Interceptions" }
  ] as const;

  const [selectedStats, setSelectedStats] = useState<Set<string>>(
    new Set(NFL_OPTIONS.map(o => o.value))
  );
  const show = (v: string) =>
    selectedStats.size === NFL_OPTIONS.length || selectedStats.has(v);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loading, setloading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(true);


useEffect(() => {
  if (!user) return;

  const savedQuery = localStorage.getItem("nfl_query");
  const savedPlayer = localStorage.getItem("nfl_player");
  const savedCompare = localStorage.getItem("nfl_compare");

  if (savedQuery) setQuery(savedQuery);
  if (savedPlayer) setPlayer(JSON.parse(savedPlayer));
  if (savedCompare) setCompareList(JSON.parse(savedCompare));
}, [user]);

useEffect(() => {
  setRecent(getRecentSearches("nfl"));
}, []);


  const handleSearch = async () => {
  setError("");
  setloading(true);
  saveRecentSearch("nfl", query);
  setRecent(getRecentSearches("nfl"));
  try {
    const data = await fetchNFLPlayer(query);
    setPlayer(data);

    if (user) {
      localStorage.setItem("nfl_query", query);
      localStorage.setItem("nfl_player", JSON.stringify(data));
    }
  } catch {
    setPlayer(null);
    setError("Player not found");
  } finally {
    setloading(false);
  }
};


  const addToCompare = () => {
  if (!player) return;

  setCompareList(prev => {
    const exists = prev.some(x => keyOf(x) === keyOf(player));
    const updated = exists ? prev : [...prev, player];

    if (user) {
      localStorage.setItem("nfl_compare", JSON.stringify(updated));
    }

    return updated;
  });
};


  return (
    <div className="page-wrapper nfl-bg">
      <header className="header">
        <div className="header-container">
          <div className="logo">MultiSport Stats</div>
          <nav className="nav-tabs">
            {["Soccer", "NBA", "NFL", "MLB"].map((sport) => (
              <button
                key={sport}
                className={`tab ${sport === "NFL" ? "active" : ""}`}
                onClick={() => navigate(`/${sport.toLowerCase()}`)}
              >
                {sport}
              </button>
            ))}
          </nav>
          <div className="auth-buttons">
            <button style={{marginRight: "150px"}} className="sign-in" onClick={() => navigate(`/fantasy`)}>Fantasy Team</button>
            {user ? (
                      <>
                        <span style={{ marginRight: "1rem" }}>Hi, {user}!</span>
                        <button className="sign-in" onClick={() => setShowLogoutModal(true)}>Logout</button>

                        {showLogoutModal && (
                          <LogoutModal
                            onClose={() => setShowLogoutModal(false)}
                            onConfirm={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("nfl_query");
                            localStorage.removeItem("nfl_player");
                            localStorage.removeItem("nfl_compare");
                            clearRecentSearches("nfl");
                            setRecent([]);
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
        <h1 className="hero-title">FIND YOUR NFL STATS</h1>
        <p className="hero-subtitle">Search by player name to view touchdowns, yards, and interceptions.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter player name (e.g., Mahomes)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* RECENT SEARCHES */}
<div className="recent-box">
  <button 
    className="toggle-recent" 
    onClick={() => setShowRecent(!showRecent)}
  >
    {showRecent ? "Hide Recent Searches ▲" : "Show Recent Searches ▼"}
  </button>

  {showRecent && recent.length > 0 && (
    <div className="chips-row">
      {recent.map((r) => (
        <span 
          key={r}
          className="chip"
          onClick={() => {
            setQuery(r);
            handleSearch();    
          }}
        >
          {r}
        </span>
      ))}

      <button 
        className="clear-chips" 
        onClick={() => {
          clearRecentSearches("nfl");
          setRecent([]);
        }}
      >
        Clear All
      </button>
    </div>
  )}
</div>


        <div className="filter-box">
          <MultiStatPicker
            options={NFL_OPTIONS as unknown as Option[]}
            selected={selectedStats}
            onChange={setSelectedStats}
            label="Filter Stat"
          />
        </div>

        {loading && <p style={{ textAlign: "center", color: "white" }}>Loading player stats...</p>}

        <div className="result">
          {error && <p className="error">{error}</p>}
          {player && (
            <>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Player (2024 Season)</th>
                    <th>Team</th>
                    {show("touchdowns") && <th>TOUCHDOWN</th>}
                    {show("yards") && <th>Yards</th>}
                    {show("interceptions") && <th>INTERCEPTION</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{player.name}</td>
                    <td>{player.team}</td>
                    {show("touchdowns") && <td>{player.touchdowns}</td>}
                    {show("yards") && <td>{player.yards}</td>}
                    {show("interceptions") && <td>{player.interceptions}</td>}
                  </tr>
                </tbody>
              </table>
              <div className="compare-actions">
                <button className="add-btn" onClick={addToCompare}>Add</button>
                <button
                className="add-btn"
                onClick={() => navigate(`/nfl/details/${player.name}`)}
              >
                Expand
              </button>
              <button
  className="add-btn"
  onClick={() =>
    addToFantasy({
      id: player.id,
      name: player.name,
      team: player.team,
      sport: "nfl",
      rushingYards: player.yards,
      receivingYards: player.yards,   
      rushingTD: player.touchdowns,
      receivingTD: player.touchdowns, 
      interceptions: player.interceptions,

      position: "-", 
    }) .then(() => setToast({ msg: "Player added to fantasy!", type: "success" }))
       .catch(() => setToast({ msg: "Failed to add player.", type: "error" }))
  }
>
  Add to Fantasy
</button>


              </div>
              {(() => {
              const predictionData = player
                ? {
                    name: player.name,
                    team: player.team,
                    points: player.touchdowns,
                    assists: player.yards,
                    rebounds: player.interceptions
                  }
                : null;
              
              
                    return <PredictionChat sport="nba" player={predictionData} />;
                  })()}
            </>
          )}
        </div>

        {compareList.length > 0 && (
          <section className="leaderboard">
            <h2 className="leaderboard-title">Leaderboard (TD)</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>TOUCHDOWN</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...compareList]
                  .sort((a, b) => b.touchdowns - a.touchdowns)
                  .map((p, i) => (
                    <tr key={keyOf(p)}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.team}</td>
                      <td>{p.touchdowns}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() =>
                            setCompareList(prev => {
                            const updated = prev.filter(x => keyOf(x) !== keyOf(p));
                            if (user) localStorage.setItem("nfl_compare", JSON.stringify(updated));
                              return updated;
                            })
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
              <button className="clear-btn" onClick={() => {
                setCompareList([]);
                if (user) localStorage.removeItem("nfl_compare");
                }}>Clear All</button>
            </div>
          </section>
        )}
      </main>
      {toast && (
  <Toast
    message={toast.msg}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}

      {showSignIn && (
  <SignInModal
    onClose={() => setShowSignIn(false)}
    onSignIn={(username) => setUser(username)}
  />
)}
<PredictionChat sport="nfl" player={player} />
    </div>
  );
}
