// routes/soccer.ts
import { Router } from "express";
import soccerJson from "../data/soccer.json" assert { type: "json" };
import { fetchSoccerPlayerStats } from "../utils/sportsApi"; 
import { fetchStatsFromOpenAI } from "../utils/openAIStats"; 

type Player = {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
};

const soccerData = soccerJson as Player[];
const router = Router();

router.get("/players/:name", async (req, res) => {
  const queryName = req.params.name.toLowerCase();
  let basicInfo = soccerData.find(p => p.name.toLowerCase().includes(queryName));

  if (!basicInfo) {
    try {
      console.log(`⚽ Looking up external API for soccer player: ${req.params.name}`);
      const statsInfo = await fetchSoccerPlayerStats(req.params.name);
      if (!statsInfo) {
        return res.status(404).json({ message: "Player not found" });
      }
      basicInfo = {
        name: statsInfo.name,
        team: statsInfo.team,
        position: statsInfo.position,
        goals: 0,       // placeholder
        assists: 0,     // placeholder
        yellowCards: 0  // placeholder
      };
    } catch (err) {
      console.error(" Error fetching soccer player basic info:", err);
      return res.status(500).json({ message: "Unable to fetch player info" });
    }
  }

  try {
    // **NEW CODE**: fetch stats via OpenAI
    const stats = await fetchStatsFromOpenAI(
      basicInfo.name,
      basicInfo.team,
      basicInfo.position,
      "soccer"
    );

    const combined: Player = {
      name: basicInfo.name,
      team: basicInfo.team,
      position: basicInfo.position,
      goals: stats.goals,
      assists: stats.assists,
      yellowCards: stats.yellowCards
    };

    return res.json(combined);
  } catch (err) {
    console.error("Error fetching stats from OpenAI:", err);
    // Return basic info anyway (without stats) if desired or show error
    return res.status(500).json({ message: "Unable to fetch player stats" });
  }
});

export default router;
