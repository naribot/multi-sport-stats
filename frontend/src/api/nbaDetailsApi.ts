// src/api/nbaDetailsApi.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface NBAExpandedStats {
  id: number;
  name: string;
  team: string;
  age: number;
  minutes: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  steals: number;
  blocks: number;
  turnovers: number;
}

export async function fetchNBAPlayerDetails(
  name: string
): Promise<NBAExpandedStats> {
  const res = await axios.get(
    `${BASE}/api/nba/details/${encodeURIComponent(name)}`
  );
  return res.data;
}
