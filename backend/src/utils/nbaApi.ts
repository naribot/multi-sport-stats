import fetch from "node-fetch";

const API_KEY =
  process.env.SPORTSDATA_KEY || "5f6a6e7744b84d3fa59c67649a59a06c";

export interface NBAStats {
  name: string;
  team: string;
  points: number;
  assists: number;
  rebounds: number;
  totalPoints: number;
}

export async function fetchNBAPlayerStats(
  name: string
): Promise<NBAStats | null> {
  const season = 2025; 
  const url = `https://api.sportsdata.io/v3/nba/stats/json/PlayerSeasonStats/${season}?key=${API_KEY}`;

  console.log("🏀 Calling:", url);

  const response = await fetch(url);
  if (!response.ok) {
    console.error("SportsData error:", await response.text());
    return null;
  }

  const players: any[] = await response.json();

  const search = name.toLowerCase().trim();

  // Correct matching: Uses Name ONLY
  const match = players.find((p) =>
    (p.Name ?? "").toLowerCase().includes(search)
  );

  if (!match) {
    console.log("❌ Player not found in season stats");
    return null;
  }

  const games = Number(match.Games || 1);

  const fg2 = Number(match.TwoPointersMade ?? 0);
  const fg3 = Number(match.ThreePointersMade ?? 0);
  const ft  = Number(match.FreeThrowsMade ?? 0);

  const realPoints = (fg2 * 2) + (fg3 * 3) + ft;

  const totalPoints =
  (Number(match.TwoPointersMade ?? 0) * 2) +
  (Number(match.ThreePointersMade ?? 0) * 3) +
  (Number(match.FreeThrowsMade ?? 0));

  const totalAssists = Number(match.Assists ?? 0);
  const totalRebounds = Number(match.Rebounds ?? 0);

  return {
    name: match.Name,
    team: match.Team,
    points: Number((realPoints / games).toFixed(1)),
    assists: Number((totalAssists / games).toFixed(1)),
    rebounds: Number((totalRebounds / games).toFixed(1)),
    totalPoints: totalPoints,
  };
}
