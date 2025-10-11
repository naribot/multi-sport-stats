import { Router } from "express";
import soccerJson from "../data/soccer.json" assert { type: "json" };

type Player = {
  id: number;
  name: string;
  team: string;
  goals: number;
  assists: number;
  yellowCards: number;
};

const soccerData = soccerJson as Player[];

const router = Router();

router.get("/players", (_req, res) => {
  res.json(soccerData);
});

router.get("/players/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const player = soccerData.find((p) =>
    p.name.toLowerCase().includes(name)
  );
  if (!player) return res.status(404).json({ message: "Player not found" });
  res.json(player);
});

export default router;
