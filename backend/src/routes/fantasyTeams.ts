import { Router } from "express";

const router = Router();

// TEMPORARY IN-MEMORY STORAGE (until we upgrade to a real DB)
const fantasyTeams: Record<string, any[]> = {};


router.get("/team/:user", (req, res) => {
  const user = req.params.user;

  if (!fantasyTeams[user]) {
    fantasyTeams[user] = [];
  }

  res.json({ team: fantasyTeams[user] });
});


router.post("/team/:user/add", (req, res) => {
  const user = req.params.user;
  const player = req.body.player;

  if (!player || !player.id) {
    return res.status(400).json({ message: "Invalid player data" });
  }

  if (!fantasyTeams[user]) {
    fantasyTeams[user] = [];
  }

  // Prevent duplicates
  const exists = fantasyTeams[user].some(p => p.id === player.id);
  if (exists) {
    return res.status(400).json({ message: "Player already on team" });
  }

  fantasyTeams[user].push(player);

  res.json({ message: "Player added", team: fantasyTeams[user] });
});


router.post("/team/:user/remove", (req, res) => {
  const user = req.params.user;
  const playerId = req.body.playerId;

  if (!fantasyTeams[user]) {
    fantasyTeams[user] = [];
  }

  fantasyTeams[user] = fantasyTeams[user].filter(p => p.id !== playerId);

  res.json({ message: "Player removed", team: fantasyTeams[user] });
});


export default router;
