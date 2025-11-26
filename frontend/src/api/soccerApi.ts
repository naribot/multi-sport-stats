import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("FRONTEND BASE URL:", import.meta.env.VITE_API_URL);

export async function fetchPlayerByName(name: string) {
  const res = await axios.get(`${BASE}/api/soccer/players/${encodeURIComponent(name)}`);
  return res.data;
}
