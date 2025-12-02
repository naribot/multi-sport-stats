import { useEffect, useState } from "react";
import { getFantasyTeam, removeFromFantasy } from "../api/fantasyApi";
import { useNavigate } from "react-router-dom";
import "./FantasyPage.css";
import "../pages/playerDetail.css";

function getPointsColorNBA(points: number) {
  if (points >= 30) return "high";
  if (points >= 15) return "medium";
  return "low";
}

function getPointsColorNFL(points: number) {
  if (points >= 700) return "high";
  if (points >= 250) return "medium";
  return "low";
}

function getPointsColorMLB(points: number) {
  if (points >= 250) return "high";
  if (points >= 150) return "medium";
  return "low";
}


function calculateFantasyPoints(player: any) {
  switch (player.sport) {
    case "nba":
      return (
        (player.points ?? 0) * 1 +
        (player.assists ?? 0) * 1.5 +
        (player.rebounds ?? 0) * 1.2
      );

    case "nfl":
      return (
        (player.passingYards ?? 0) * 0.04 +
        (player.passingTD ?? 0) * 4 +
        (player.interceptions ?? 0) * -2 +
        (player.rushingYards ?? 0) * 0.1 +
        (player.rushingTD ?? 0) * 6 +
        (player.receivingYards ?? 0) * 0.1 +
        (player.receivingTD ?? 0) * 6
      );


    case "mlb":
      return (
        (player.homeRuns ?? 0) * 4 +
        (player.RBIs ?? 0) * 1 +
        (player.hits ?? 0) * 0.5
      );

    default:
      return 0;
  }
}

function getTeamPowerScore(players: any[]) {
  return players
    .map(p => calculateFantasyPoints(p))
    .reduce((sum, v) => sum + v, 0);
}



function getPowerTier(sport: string, score: number) {
  switch (sport) {

    case "nba":
      if (score >= 250) return { tier: "Elite", color: "elite" };
      if (score >= 150) return { tier: "Strong", color: "strong" };
      if (score >= 80)  return { tier: "Average", color: "average" };
      return { tier: "Weak", color: "weak" };

    case "nfl":
      if (score >= 3400) return { tier: "Elite", color: "elite" };
      if (score >= 2500) return { tier: "Strong", color: "strong" };
      if (score >= 1200) return { tier: "Average", color: "average" };
      return { tier: "Weak", color: "weak" };

    case "mlb":
      if (score >= 600) return { tier: "Elite", color: "elite" };
      if (score >= 350) return { tier: "Strong", color: "strong" };
      if (score >= 150) return { tier: "Average", color: "average" };
      return { tier: "Weak", color: "weak" };

    default:
      return { tier: "Unknown", color: "weak" };
  }
}




export default function FantasyPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const nbaTeam = team
  .filter((p) => p.sport === "nba")
  .sort((a, b) => calculateFantasyPoints(b) - calculateFantasyPoints(a));

  const nflTeam = team
  .filter((p) => p.sport === "nfl")
  .sort((a, b) => calculateFantasyPoints(b) - calculateFantasyPoints(a));

  const mlbTeam = team
  .filter((p) => p.sport === "mlb")
  .sort((a, b) => calculateFantasyPoints(b) - calculateFantasyPoints(a));

  const nbaScore = getTeamPowerScore(nbaTeam);
  const nflScore = getTeamPowerScore(nflTeam);
  const mlbScore = getTeamPowerScore(mlbTeam);

  const nbaTier = getPowerTier("nba", nbaScore);
  const nflTier = getPowerTier("nfl", nflScore);
  const mlbTier = getPowerTier("mlb", mlbScore);



  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getFantasyTeam()
      .then((teamsObj) => {
        if (!teamsObj) {
          setTeam([]);
          return;
        }

        const allPlayers: any[] = [
          ...(teamsObj.nba || []),
          ...(teamsObj.nfl || []),
          ...(teamsObj.mlb || []),
        ];

        setTeam(allPlayers);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const removePlayer = async (player: any) => {
    await removeFromFantasy(player.id, player.sport);
    setTeam((prev) =>
      prev.filter((p) => !(p.id === player.id && p.sport === player.sport))
    );
  };

  if (!user) {
    return (
      <div className="fantasy-page-bg fantasy-bg">
        <button className= "back-btn" onClick={ () => navigate(-1)}>Back</button>
        <p style={{textAlign:"center", fontSize:"2.5rem"}}>Please sign in to view your fantasy team.</p>
      </div>
    );
  }

  return (
  <div className="fantasy-page-bg">
    <div className="fantasy-wrapper">
     <main className= "fantasy-main" style={{ backgroundColor:"#5B7C99",border:"6px groove black", borderRadius: "15px"}}> 
      <div>  
        <h1 style={{border: "5px groove black", borderRadius: "10px", backgroundColor:"#ffd700", color:"#5B7C99", fontSize: "2.2rem", fontWeight: "800"}}>YOUR FANTASY TEAM</h1>
        <button className= "back-btn" onClick={() => navigate(-1) }>Back</button>
      </div>
      {loading && <p>Loading team...</p>}

      {!loading && team.length === 0 && (
        <p style={{textAlign: "center", color:"white",fontSize: "1.3rem", fontWeight: "700", marginBottom:"20px" }}>Your fantasy team is empty. Add players from any sport page!</p>
      )}

      <div className="fantasy-row">
        {/* NBA TABLE */}
        <div style={{border:"6px solid #5B7C99"}} className="fantasy-table">
          <h2 style={{border: "5px groove #5B7C99", borderRadius: "10px", backgroundColor:"antiquewhite", color:"darkred"}}>NBA Team</h2>
          <div className={`power-score ${nbaTier.color}`}>
             Power Score: {nbaScore.toFixed(1)} — {nbaTier.tier}
          </div>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Position</th>
                <th>Fantasy Pts</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {nbaTeam.map((p) => (
                <tr key={`${p.sport}-${p.id}`}>
                  <td>{p.name}</td>
                  <td>{p.team}</td>
                  <td>{p.position ?? "-"}</td>
                  <td className={`points ${getPointsColorNBA(calculateFantasyPoints(p))}`}>
                    {calculateFantasyPoints(p).toFixed(1)}
                  </td>
                  <td style={{textAlign:"center"}}>
                    <button
                      className="remove-btn"
                      onClick={() => removePlayer(p)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NFL TABLE */}
        <div style={{border:"6px solid #5B7C99"}} className="fantasy-table">
          <h2 style={{border: "5px groove #5B7C99", borderRadius: "10px", backgroundColor:"antiquewhite", color:"darkred"}}>NFL Team</h2>
          <div className={`power-score ${nflTier.color}`}>
            Power Score: {nflScore.toFixed(1)} — {nflTier.tier}
          </div>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Position</th>
                <th>Fantasy Pts</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {nflTeam.map((p) => (
                <tr key={`${p.sport}-${p.id}`}>
                  <td>{p.name}</td>
                  <td>{p.team}</td>
                  <td>{p.position ?? "-"}</td>
                  <td className={`points ${getPointsColorNFL(calculateFantasyPoints(p))}`}>
                    {calculateFantasyPoints(p).toFixed(1)}
                  </td>
                  <td style={{textAlign:"center"}}>
                    <button
                      className="remove-btn"
                      onClick={() => removePlayer(p)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MLB TABLE */}
        <div style={{border:"6px solid #5B7C99"}} className="fantasy-table">
          <h2 style={{border: "5px groove #5B7C99", borderRadius: "10px", backgroundColor:"antiquewhite", color:"darkred"}}>MLB Team</h2>
          <div className={`power-score ${mlbTier.color}`}>
            Power Score: {mlbScore.toFixed(1)} — {mlbTier.tier}
          </div>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Position</th>
                <th>Fantasy Pts</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {mlbTeam.map((p) => (
                <tr key={`${p.sport}-${p.id}`}>
                  <td>{p.name}</td>
                  <td>{p.team}</td>
                  <td>{p.position ?? "-"}</td>
                  <td className={`points ${getPointsColorMLB(calculateFantasyPoints(p))}`}>
                    {calculateFantasyPoints(p).toFixed(1)}
                  </td>
                  <td style={{textAlign:"center"}}>
                    <button
                      className="remove-btn"
                      onClick={() => removePlayer(p)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </main> 
    </div>
  </div>
  );
}
