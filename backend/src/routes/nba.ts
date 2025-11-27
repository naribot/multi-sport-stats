import { Router } from "express";
import { fetchNBAPlayerStats } from "../utils/nbaApi";

const router = Router();

router.get("/players/:name", async (req, res) => {
  const name = req.params.name;

  console.log("🏀 Fetching NBA stats for:", name);

  const stats = await fetchNBAPlayerStats(name);

  if (!stats) {
    return res.status(404).json({ message: "Player not found" });
  }

  return res.json(stats);
});

export default router;
