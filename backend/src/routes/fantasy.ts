import { Router } from "express";

const router = Router();

type League = "nba" | "nfl" | "mlb";

let fantasyTeams: Record<League, any[]> = {
  nba: [],
  nfl: [],
  mlb: [],
};


/**
 * GET /api/fantasy/team
 */
router.get("/team", (_req, res) => {
  return res.json({ teams: fantasyTeams });
});

/**
 * POST /api/fantasy/add
 */
router.post("/add", (req, res) => {
  const { league, player } = req.body;

  if (!league || !player) {
    return res.status(400).json({ message: "Missing league or player" });
  }

  const leagueKey = league as League;

  if (!fantasyTeams[leagueKey]) {
    return res.status(400).json({ message: "Invalid league" });
  }

  const exists = fantasyTeams[leagueKey].some((p) => p.id === player.id);
  if (exists) {
    return res.status(409).json({ message: "Player already added" });
  }

  fantasyTeams[leagueKey].push(player);

  return res.json({
    message: `Player added to ${leagueKey.toUpperCase()} fantasy team`,
    teams: fantasyTeams,
  });
});

/**
 * DELETE /api/fantasy/remove/:league/:id
 */
router.delete("/remove/:league/:id", (req, res) => {
  const league = req.params.league as League;
  const id = Number(req.params.id);

  if (!fantasyTeams[league]) {
    return res.status(400).json({ message: "Invalid league" });
  }

  fantasyTeams[league] = fantasyTeams[league].filter((p) => p.id !== id);

  return res.json({
    message: `Player removed from ${league.toUpperCase()} fantasy team`,
    teams: fantasyTeams,
  });
});

/**
 * DELETE /api/fantasy/clear/:league
 */
router.delete("/clear/:league", (req, res) => {
  const league = req.params.league as League;

  if (!fantasyTeams[league]) {
    return res.status(400).json({ message: "Invalid league" });
  }

  fantasyTeams[league] = [];

  return res.json({
    message: `Cleared ${league.toUpperCase()} fantasy team`,
    teams: fantasyTeams,
  });
});

export default router;
