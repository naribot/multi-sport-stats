import { Router } from "express";
import mlbJson from "../data/mlb.json" assert { type: "json" };

type MLBPlayer = {
  id: number;
  name: string;
  team: string;
  homeRuns: number;
  battingAverage: number;
  RBIs: number;
};

const mlbData = mlbJson as MLBPlayer[];

const router = Router();

router.get("/players", (_req, res) => {
  res.json(mlbData);
});

router.get("/players/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const player = mlbData.find((p) =>
    p.name.toLowerCase().includes(name)
  );
  if (!player) return res.status(404).json({ message: "Player not found" });
  res.json(player);
});

export default router;
