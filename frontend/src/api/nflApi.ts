import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchNFLPlayer(name: string) {
  const res = await axios.get(
    `${BASE}/api/nfl/players/${encodeURIComponent(name)}`
  );
  return res.data;
}
export async function fetchNFLPlayerDetails(name: string) {
  const res = await axios.get(
    `${BASE}/api/nfl/details/${encodeURIComponent(name)}`
  );
  return res.data;
}
