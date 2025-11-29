// src/utils/mlbApi.ts
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const API_KEY = process.env.BALLDONTLIE_KEY;

export interface MLBStats {
  id: number;
  name: string;
  team: string;
  homeRuns: number;
  battingAverage: number;
  RBIs: number;
}

export interface MLBExpandedStats {
  id: number;
  name: string;
  team: string;
  age: number | null;
  games: number;
  plateAppearances: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  RBIs: number;
  walks: number;
  strikeouts: number;
  battingAverage: number;
  obp: number;   
  slg: number;   
  ops: number;   
}

export async function fetchMLBPlayerStats(
  name: string
): Promise<MLBStats | null> {
    // last name only here
  const searchName = name.trim().split(" ").pop(); 

  
  const playerUrl = `https://api.balldontlie.io/mlb/v1/players?search=${encodeURIComponent(
    searchName!
  )}&per_page=25`;

  console.log(" MLB Player Search:", playerUrl);

  const playerRes = await fetch(playerUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!playerRes.ok) {
    console.error(" MLB Player search error:", await playerRes.text());
    return null;
  }

  const playerJson: any = await playerRes.json();
  if (!playerJson.data?.length) {
    console.log(" MLB No player found");
    return null;
  }

  const player = playerJson.data[0];

  // Fetch season stats
  const statUrl = `https://api.balldontlie.io/mlb/v1/season_stats?player_ids[]=${player.id}&season=2024`;

  console.log(" MLB Stats URL:", statUrl);

  const statRes = await fetch(statUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!statRes.ok) {
    console.error(" MLB stats fetch error:", await statRes.text());
    return null;
  }

  const statJson: any = await statRes.json();
  const stat = statJson.data?.[0];

  if (!stat) {
    console.log(" MLB No season stats found");
    return null;
  }

  return {
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    team: stat.team_name ?? "Unknown",
    homeRuns: stat.batting_hr ?? 0,
    battingAverage: Number(stat.batting_avg ?? 0),
    RBIs: stat.batting_rbi ?? 0,
  };
}
export async function fetchMLBPlayerExpandedStats(
  name: string
): Promise<MLBExpandedStats | null> {
  const searchName = name.trim().split(" ").pop();

  // to search player
  const playerUrl = `https://api.balldontlie.io/mlb/v1/players?search=${encodeURIComponent(
    searchName!
  )}`;

  const playerRes = await fetch(playerUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!playerRes.ok) {
    console.error(" MLB expanded search error:", await playerRes.text());
    return null;
  }

  const playerJson: any = await playerRes.json();
  if (!playerJson.data?.length) return null;

  const player = playerJson.data[0];

  // expanded season stats
  const statUrl = `https://api.balldontlie.io/mlb/v1/season_stats?player_ids[]=${player.id}&season=2024&type=batting`;

  const statRes = await fetch(statUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!statRes.ok) {
    console.error(" MLB expanded stats error:", await statRes.text());
    return null;
  }

  const json = await statRes.json();
  const s = json.data?.[0];
  if (!s) return null;

  return {
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    team: s.team_name ?? "Unknown",
    age: player.age ?? null,
    games: s.batting_gp ?? 0,              
    plateAppearances: s.batting_ab ?? 0,
    hits: s.batting_h ?? 0,
    doubles: s.batting_2b ?? 0,
    triples: s.batting_3b ?? 0,
    homeRuns: s.batting_hr ?? 0,
    RBIs: s.batting_rbi ?? 0,
    walks: s.batting_bb ?? 0,
    strikeouts: s.batting_so ?? 0,
    battingAverage: Number(s.batting_avg ?? 0),
    obp: Number(s.batting_obp ?? 0),
    slg: Number(s.batting_slg ?? 0),
    ops: Number(s.batting_ops ?? 0),
  };
}
