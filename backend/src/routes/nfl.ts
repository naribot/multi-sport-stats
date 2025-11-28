// src/routes/nfl.ts
import { Router } from "express";
import { fetchNFLPlayerStats, fetchNFLPlayerDetails } from "../utils/nflApi";

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

router.get("/details/:name", async (req, res) => {
  const name = req.params.name;
  console.log("🏈 Fetching NFL EXPANDED stats for:", name);

  const details = await fetchNFLPlayerDetails(name);
  if (!details) {
    console.log("❌ No expanded stats found");
    return res.status(404).json({ message: "Expanded stats not found" });
  }

  res.json(details);
});

export default router;
