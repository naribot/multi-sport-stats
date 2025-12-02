// src/api/fantasyApi.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface FantasyPlayer {
  id: number;
  name: string;
  team: string;
  sport: "nba" | "nfl" | "mlb";
  [key: string]: any;
}

// ADD PLAYER 
export async function addToFantasy(player: FantasyPlayer) {
  const league = player.sport; 
  await axios.post(`${BASE}/api/fantasy/add`, {
    league,
    player,
  });
}

export async function getFantasyTeam() {
  const res = await axios.get(`${BASE}/api/fantasy/team`);
  return res.data.teams; 
}

// REMOVE PLAYER (league-aware)
export async function removeFromFantasy(playerId: number, league: "nba" | "nfl" | "mlb") {
  await axios.delete(`${BASE}/api/fantasy/remove/${league}/${playerId}`);
}
