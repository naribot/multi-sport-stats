import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchNBAPlayer(name: string) {
  const res = await axios.get(`${BASE}/api/nba/players/${encodeURIComponent(name)}`);
  return res.data;
}
