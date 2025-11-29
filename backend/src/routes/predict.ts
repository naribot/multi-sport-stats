import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import OpenAI from "openai";


const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat/predict
router.post("/predict", async (req, res) => {
  try {
    const { sport, playerName, stats } = req.body;

    if (!sport || !playerName || !stats) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const prompt = `
You are a sports analytics prediction model.
Predict next-season performance for the following player based strictly on the statistical data provided.

Sport: ${sport}
Player: ${playerName}

Current Season Stats:
${Object.entries(stats)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}

Give a short and clear prediction for next season in bullet points.

Also, if they ask to elaborate on your reasons for the prediction, elaborate your views! 
    `;

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert sports statistician." },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.choices[0].message.content;
    return res.json({ prediction: reply });
  } catch (err: any) {
    console.error(" Prediction API Error:", err);
    return res.status(500).json({ message: "Prediction failed" });
  }
});

export default router;
