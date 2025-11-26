// src/utils/sportsApi.ts
import fetch from "node-fetch";

const API_KEY = process.env.THE_SPORTS_DB_KEY || "123"; 
const BASE_URL_V1 = "https://www.thesportsdb.com/api/v1/json";

export interface SoccerPlayerStats {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
}

export async function fetchSoccerPlayerStats(
  name: string
): Promise<SoccerPlayerStats | null> {
  const encoded = encodeURIComponent(name.trim().replace(/\s+/g, "_"));

  const url = `${BASE_URL_V1}/${API_KEY}/searchplayers.php?p=${encoded}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    console.error(`TheSportsDB API error ${response.status}: ${text}`);
    return null;
  }

  const json = await response.json();
  const players = json.player;

  if (!players || players.length === 0) {
    return null;
  }

  const p = players[0];

  return {
    name: p.strPlayer ?? name,
    team: p.strTeam ?? "Unknown",
    position: p.strPosition ?? "Unknown",
    goals: Number(p.intGoals ?? 0),
    assists: Number(p.intAssists ?? 0),
    yellowCards: Number(p.intYellowCards ?? 0),
  };
}
