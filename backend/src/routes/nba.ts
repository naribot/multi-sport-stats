// src/routes/nba.ts
import { Router } from "express";
import { fetchNBAPlayerBase, fetchNBAPlayerDetails } from "../utils/nbaApi";

const router = Router();

/** 
 * 1) BASE STATS ROUTE
 * Example: GET /api/nba/players/curry
 */
router.get("/players/:name", async (req, res) => {
  const name = req.params.name.trim();

  console.log("🏀 Fetching BASE NBA stats for:", name);

  try {
    const stats = await fetchNBAPlayerBase(name);

    if (!stats) {
      return res
        .status(404)
        .json({ message: "Player not found or no stats available" });
    }

    return res.json(stats);
  } catch (err) {
    console.error("NBA BASE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * 2) EXPANDED STATS ROUTE
 * Example: GET /api/nba/details/curry
 */
router.get("/details/:name", async (req, res) => {
  const name = req.params.name.trim();

  console.log("🏀 Fetching EXPANDED NBA stats for:", name);

  try {
    const details = await fetchNBAPlayerDetails(name);

    if (!details) {
      return res.status(404).json({ message: "Player detail stats not found" });
    }

    return res.json(details);
  } catch (err) {
    console.error("NBA DETAILS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
