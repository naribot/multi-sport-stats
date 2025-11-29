import { Router } from "express";
import { fetchMLBPlayerStats } from "../utils/mlbApi.js";
import { fetchMLBPlayerExpandedStats } from "../utils/mlbApi.js";


const router = Router();

router.get("/players/:name", async (req, res) => {
  const name = req.params.name;

  console.log(" Fetching MLB stats for:", name);

  const stats = await fetchMLBPlayerStats(name);

  if (!stats) {
    return res.status(404).json({ message: "Player not found or no stats" });
  }

  res.json(stats);
});

router.get("/details/:name", async (req, res) => {
  const name = req.params.name;

  console.log("Fetching EXPANDED MLB stats for:", name);

  const stats = await fetchMLBPlayerExpandedStats(name);

  if (!stats) {
    return res.status(404).json({ message: "Expanded stats not found" });
  }

  res.json(stats);
});

export default router;
