import { Router } from "express";
import nflJson from "../data/nfl.json" assert { type: "json" };

type NFLPlayer = {
  id: number;
  name: string;
  team: string;
  touchdowns: number;
  yards: number;
  interceptions: number;
};

const nflData = nflJson as NFLPlayer[];

const router = Router();

router.get("/players", (_req, res) => {
  res.json(nflData);
});

router.get("/players/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const player = nflData.find((p) =>
    p.name.toLowerCase().includes(name)
  );
  if (!player) return res.status(404).json({ message: "Player not found" });
  res.json(player);
});

export default router;
