import { Router } from "express";
import { fetchMLBPlayerStats } from "../utils/mlbApi.js";

const router = Router();

router.get("/players/:name", async (req, res) => {
  const name = req.params.name;

  console.log("⚾ Fetching MLB stats for:", name);

  const stats = await fetchMLBPlayerStats(name);

  if (!stats) {
    return res.status(404).json({ message: "Player not found or no stats" });
  }

  res.json(stats);
});

export default router;
