import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const API_KEY = process.env.BALLDONTLIE_KEY;  

export interface NBAStats {
  name: string;
  team: string;
  points: number;     // PPG
  assists: number;    // APG
  rebounds: number;   // RPG
  totalPoints: number;
}

export async function fetchNBAPlayerStats(
  name: string
): Promise<NBAStats | null> {
  console.log("🔎 Searching NBA player:", name);

  // 1️⃣ Step 1: Search player by name to get ID
  const searchUrl = `https://api.balldontlie.io/nba/v1/players?search=${encodeURIComponent(
    name
  )}`;

  const searchResponse = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!searchResponse.ok) {
    console.error("❌ Player search failed:", await searchResponse.text());
    return null;
  }

  const playerData = await searchResponse.json();

  if (!playerData.data || playerData.data.length === 0) {
    console.log("❌ No player found.");
    return null;
  }

  // Use the first matching player
  const player = playerData.data[0];
  const playerId = player.id;

  console.log(`📌 Found player ID: ${playerId}`);

  // 2️⃣ Step 2: Fetch season averages (PPG, APG, RPG, etc.)
  const statsUrl = `https://api.balldontlie.io/nba/v1/season_averages/general?season=2024&season_type=regular&type=base&player_ids[]=${playerId}`;

  const statsResponse = await fetch(statsUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!statsResponse.ok) {
    console.error("❌ Season averages error:", await statsResponse.text());
    return null;
  }

  const statsJson = await statsResponse.json();

  if (!statsJson.data || statsJson.data.length === 0) {
    console.log("❌ No season stats found for player.");
    return null;
  }

  const s = statsJson.data[0].stats;

  // Extract main numbers
  const ppg = s.pts ?? 0;
  const apg = s.ast ?? 0;
  const rpg = s.reb ?? 0;

  // total points using per game * games played
  const totalPoints = (s.pts ?? 0) * (s.gp ?? 1);

  return {
    name: `${player.first_name} ${player.last_name}`,
    team: player.team?.name ?? "Unknown",
    points: Number(ppg.toFixed(1)),
    assists: Number(apg.toFixed(1)),
    rebounds: Number(rpg.toFixed(1)),
    totalPoints: Number(totalPoints.toFixed(0)),
  };
}
