// src/utils/nflApi.ts
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const API_KEY = process.env.BALLDONTLIE_KEY;

export interface NFLStats {
  id: number;
  name: string;
  team: string;
  touchdowns: number;
  yards: number;
  interceptions: number;
}

export async function fetchNFLPlayerStats(
  name: string
): Promise<NFLStats | null> {
  if (!API_KEY) {
    console.error("❌ BALLDONTLIE_KEY is missing");
    return null;
  }

  // Use last name to make the search more reliable
  const parts = name.trim().split(" ");
  const lastName = parts[parts.length - 1];

  console.log("🏈 Searching NFL player:", lastName);

  const playerUrl = `https://api.balldontlie.io/nfl/v1/players?search=${encodeURIComponent(
    lastName
  )}&per_page=25`;

  const playerRes = await fetch(playerUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!playerRes.ok) {
    console.error("❌ Player search error:", await playerRes.text());
    return null;
  }

  const playerJson: any = await playerRes.json();
  const candidates: any[] = playerJson.data ?? [];

  if (!candidates.length) {
    console.log("❌ No NFL player match for:", name);
    return null;
  }

  // Try to pick the best match (full name if possible)
  const lowerFull = name.toLowerCase().trim();
  const player =
    candidates.find(
      (p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase() === lowerFull
    ) || candidates[0];

  console.log("✅ Matched NFL player:", player.id, player.first_name, player.last_name);

  // ---- Get game-level stats for 2024 and sum them ----
  const statsUrl = `https://api.balldontlie.io/nfl/v1/stats?player_ids[]=${player.id}&seasons[]=2024&per_page=100`;

  console.log("🏈 Fetching stats:", statsUrl);

  const statsRes = await fetch(statsUrl, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!statsRes.ok) {
    console.error("❌ Stats fetch error:", await statsRes.text());
    return null;
  }

  const statsJson: any = await statsRes.json();
  const games: any[] = statsJson.data ?? [];

  if (!games.length) {
    console.log("❌ No season stats found for player id:", player.id);
    return {
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      team: player.team?.abbreviation || "N/A",
      touchdowns: 0,
      yards: 0,
      interceptions: 0,
    };
  }

  // Sum across all games using the *correct* field names
  const totals = games.reduce(
    (acc, g) => {
      const passingTD = Number(
        g.passing_touchdowns ?? g.passing_tds ?? 0
      );
      const rushingTD = Number(
        g.rushing_touchdowns ?? g.rushing_tds ?? 0
      );
      const receivingTD = Number(
        g.receiving_touchdowns ?? g.receiving_tds ?? 0
      );

      const passingYds = Number(
        g.passing_yards ?? g.passing_yds ?? 0
      );
      const rushingYds = Number(
        g.rushing_yards ?? g.rushing_yds ?? 0
      );
      const receivingYds = Number(
        g.receiving_yards ?? g.receiving_yds ?? 0
      );

      const ints = Number(
        g.passing_interceptions ?? g.interceptions ?? 0
      );

      acc.touchdowns += passingTD + rushingTD + receivingTD;
      acc.yards += passingYds + rushingYds + receivingYds;
      acc.interceptions += ints;

      return acc;
    },
    { touchdowns: 0, yards: 0, interceptions: 0 }
  );

  return {
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    team: player.team?.abbreviation || "N/A",
    touchdowns: totals.touchdowns,
    yards: totals.yards,
    interceptions: totals.interceptions,
  };
}
