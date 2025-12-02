import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlayerByName } from "../api/soccerApi";
import './SoccerPage.css';
import { saveRecentSearch, getRecentSearches, clearRecentSearches } from "../api/recentSearches";


type Option = { value: string; label: string };

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

const [showLogoutModal, setShowLogoutModal] = useState(false);
const [loading, setLoading] = useState(false); 
const [showSignIn, setShowSignIn] = useState(false);
const [user, setUser] = useState(localStorage.getItem("user"));

//const logout = () => {
  //localStorage.removeItem("user");
  //setUser(null);
//};


const [compareList, setCompareList] = useState<SoccerPlayer[]>([]);
const keyOf = (p: SoccerPlayer) => `${p.name}|${p.team}`.toLowerCase();

  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
const [showRecent, setShowRecent] = useState(true);


  // Load saved Soccer state when page mounts (only if logged in)
useEffect(() => {
  if (!user) return;

  const savedQuery = localStorage.getItem("soccer_query");
  const savedPlayer = localStorage.getItem("soccer_player");
  const savedCompare = localStorage.getItem("soccer_compare");

  if (savedQuery) setQuery(savedQuery);
  if (savedPlayer) setPlayer(JSON.parse(savedPlayer));
  if (savedCompare) setCompareList(JSON.parse(savedCompare));
}, [user]);

useEffect(() => {
  setRecent(getRecentSearches("nfl"));
}, []);


  const SOCCER_OPTIONS = [
  { value: "goals", label: "Goals" },
  { value: "assists", label: "Assists" },
  { value: "yellowCards", label: "Yellow Cards" },
] as const;

const [selectedStats, setSelectedStats] = useState<Set<string>>(
  new Set(SOCCER_OPTIONS.map(o => o.value)) 
);
const show = (v: string) =>
  selectedStats.size === SOCCER_OPTIONS.length || selectedStats.has(v);



  const navigate = useNavigate();

  const handleSearch = async () => {
  setError("");
  setLoading(true);
  saveRecentSearch("soccer", query);
  setRecent(getRecentSearches("soccer"));
  try {
    const data = await fetchPlayerByName(query);
    if (!data) {
      setError("Player not found");
      setPlayer(null);
    } else {
      const mapped: SoccerPlayer = {
        name: data.name,
        team: data.team,
        position: data.position,                  
        goals: Number(data.goals),
        assists: Number(data.assists),
        yellowCards: Number(data.yellowCards),
      };
      setPlayer(mapped);

      if (user) {
        localStorage.setItem("soccer_query", query);
        localStorage.setItem("soccer_player", JSON.stringify(mapped));
      }

    }
  } catch {
    setError("Something went wrong. Try again later.");
  } finally {
    setLoading(false); 
  }
};


  const addToCompare = () => {
  if (!player) return;

  setCompareList(prev => {
    const exists = prev.some(x => keyOf(x) === keyOf(player));
    const updated = exists ? prev : [...prev, player];

    if (user) {
      localStorage.setItem("soccer_compare", JSON.stringify(updated));
    }

    return updated;
  });
};



  return (

    
    <div className="page-wrapper soccer-bg">
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
            {user ? (
                      <>
                        <span style={{ marginRight: "1rem" }}>Hi, {user}!</span>
                        <button className="sign-in" onClick={() => setShowLogoutModal(true)}>Logout</button>

                        {showLogoutModal && (
                          <LogoutModal
                            onClose={() => setShowLogoutModal(false)}
                            onConfirm={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("soccer_query");
                            localStorage.removeItem("soccer_player");
                            localStorage.removeItem("soccer_compare");
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
          clearRecentSearches("soccer");
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
            options={SOCCER_OPTIONS as unknown as Option[]}
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
        <td>{player.position}</td>
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
                  setCompareList(prev => {
                  const updated = prev.filter(x => keyOf(x) !== keyOf(p));
                  if (user) localStorage.setItem("soccer_compare", JSON.stringify(updated));
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
        if (user) localStorage.removeItem("soccer_compare");
        }}>Clear All</button>
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
