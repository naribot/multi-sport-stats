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

export async function fetchMLBPlayerStats(
  name: string
): Promise<MLBStats | null> {
  const searchName = name.trim().split(" ").pop(); // last name only

  // 1. Search player
  const playerUrl = `https://api.balldontlie.io/mlb/v1/players?search=${encodeURIComponent(
    searchName!
  )}&per_page=25`;

  console.log("🔎 MLB Player Search:", playerUrl);

  const playerRes = await fetch(playerUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!playerRes.ok) {
    console.error("❌ MLB Player search error:", await playerRes.text());
    return null;
  }

  const playerJson: any = await playerRes.json();
  if (!playerJson.data?.length) {
    console.log("❌ MLB No player found");
    return null;
  }

  const player = playerJson.data[0];

  // 2. Fetch season stats
  const statUrl = `https://api.balldontlie.io/mlb/v1/season_stats?player_ids[]=${player.id}&season=2024`;

  console.log("📊 MLB Stats URL:", statUrl);

  const statRes = await fetch(statUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!statRes.ok) {
    console.error("❌ MLB stats fetch error:", await statRes.text());
    return null;
  }

  const statJson: any = await statRes.json();
  const stat = statJson.data?.[0];

  if (!stat) {
    console.log("❌ MLB No season stats found");
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
