import { Router } from "express";
import nbaJson from "../data/nba.json" assert { type: "json" };

type NBAPlayer = {
  id: number;
  name: string;
  team: string;
  points: number;
  assists: number;
  rebounds: number;
};

const nbaData = nbaJson as NBAPlayer[];

const router = Router();

router.get("/players", (_req, res) => {
  res.json(nbaData);
});

router.get("/players/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const player = nbaData.find((p) =>
    p.name.toLowerCase().includes(name)
  );
  if (!player) return res.status(404).json({ message: "Player not found" });
  res.json(player);
});

export default router;
