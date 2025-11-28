// src/routes/nfl.ts
import { Router } from "express";
import { fetchNFLPlayerStats } from "../utils/nflApi";

const router = Router();

router.get("/players/:name", async (req, res) => {
  const name = req.params.name;

  console.log("🏈 Fetching NFL stats for:", name);

  const stats = await fetchNFLPlayerStats(name);

  if (!stats) {
    return res
      .status(404)
      .json({ message: "Player not found or no stats available" });
  }

  return res.json(stats);
});

export default router;
