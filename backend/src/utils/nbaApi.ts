import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const API_KEY = process.env.BALLDONTLIE_KEY;


export interface NBAPlayerBase {
  id: number;
  name: string;
  team: string;
  points: number;
  assists: number;
  rebounds: number;
  totalPoints: number;
}

export interface NBAPlayerDetails {
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

async function searchNBAPlayer(name: string) {
  const url = `https://api.balldontlie.io/nba/v1/players?search=${encodeURIComponent(
    name
  )}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    console.error(" Player search error:", await res.text());
    return null;
  }

  const json = await res.json();
  if (!json.data || json.data.length === 0) return null;

  return json.data[0]; // first match
}


export async function fetchNBAPlayerBase(
  name: string
): Promise<NBAPlayerBase | null> {
  const player = await searchNBAPlayer(name);
  if (!player) return null;

  const id = player.id;

  const url = `https://api.balldontlie.io/nba/v1/season_averages/general?season=2024&season_type=regular&type=base&player_ids[]=${id}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    console.error(" Base stats error:", await res.text());
    return null;
  }

  const json = await res.json();
  if (!json.data || json.data.length === 0) return null;

  const stats = json.data[0].stats;

  const ppg = stats.pts ?? 0;
  const apg = stats.ast ?? 0;
  const rpg = stats.reb ?? 0;
  const gp = stats.gp ?? 1;

  return {
    id,
    name: `${player.first_name} ${player.last_name}`,
    team: player.team?.name ?? "Unknown",
    points: Number(ppg.toFixed(1)),
    assists: Number(apg.toFixed(1)),
    rebounds: Number(rpg.toFixed(1)),
    totalPoints: Number((ppg * gp).toFixed(0)),
  };
}

// separate function for detailed stats 
export async function fetchNBAPlayerDetails(
  name: string
): Promise<NBAPlayerDetails | null> {
  const player = await searchNBAPlayer(name);
  if (!player) return null;

  const id = player.id;

  const url = `https://api.balldontlie.io/nba/v1/season_averages/general?season=2024&season_type=regular&type=base&player_ids[]=${id}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    console.error(" Detail stats error:", await res.text());
    return null;
  }

  const json = await res.json();
  if (!json.data || json.data.length === 0) return null;

  const s = json.data[0].stats;

  return {
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    team: player.team?.name ?? "Unknown",
    age: s.age ?? 0,
    minutes: s.min ?? 0,
    fg_pct: Number((s.fg_pct ?? 0).toFixed(3)),
    fg3_pct: Number((s.fg3_pct ?? 0).toFixed(3)),
    ft_pct: Number((s.ft_pct ?? 0).toFixed(3)),
    steals: s.stl ?? 0,
    blocks: s.blk ?? 0,
    turnovers: s.tov ?? 0,
  };
}
