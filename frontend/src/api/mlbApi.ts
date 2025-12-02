export interface MLBPlayer {
  id: number;
  name: string;
  team: string;
  homeRuns: number;
  battingAverage: number;
  RBIs: number;
}

export async function fetchMLBPlayer(name: string): Promise<MLBPlayer | null> {
  if (!name.trim()) return null;

  try {
    const res = await fetch(`http://localhost:5000/api/mlb/players/${name}`);

    if (!res.ok) return null;

    const data = await res.json();
    return data as MLBPlayer;
  } catch (err) {
    console.error("Frontend MLB API error:", err);
    return null;
  }
}
