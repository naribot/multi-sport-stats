import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface MLBExpandedStats {
  id: number;
  name: string;
  team: string;

  // Expanded stats
  age: number;
  games: number;
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

export async function fetchMLBPlayerDetails(name: string) {
  const res = await axios.get(
    `${BASE}/api/mlb/details/${encodeURIComponent(name)}`
  );
  return res.data;
}
