// src/utils/openAIStats.ts
import OpenAI from "openai";

let client: OpenAI | null = null;

function getOpenAI() {
  if (!client) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("Missing OPENAI_API_KEY in environment variables");
    }
    client = new OpenAI({ apiKey: key });
  }
  return client;
}

export interface StatsOnly {
  goals: number;
  assists: number;
  yellowCards: number;
}


 //Fetch stats from OpenAI 
 
export async function fetchStatsFromOpenAI(
  name: string,
  team: string,
  position: string,
  sport: "soccer"
): Promise<StatsOnly> {

  const openai = getOpenAI(); 

  const prompt = `
Return ONLY valid JSON. No explanations. 
You must provide the MOST RECENT, REAL stats available online.

Task:
Provide current (2024–2025 season) ${sport} stats for the following player accross all competitions:

Name: ${name}
Team: ${team}
Position: ${position}

Required JSON Format:
{
  "goals": number,
  "assists": number,
  "yellowCards": number
}

If any field cannot be found, estimate using recent performance trends.
Return ONLY JSON.
  `.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",  
    messages: [
      {
        role: "system",
        content: "You are a sports statistics assistant. Always return ONLY valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0
  });

  const content = completion.choices?.[0]?.message?.content?.trim() || "{}";

  //parsing JSON safely
  try {
    const parsed = JSON.parse(content);
    return {
      goals: Number(parsed.goals || 0),
      assists: Number(parsed.assists || 0),
      yellowCards: Number(parsed.yellowCards || 0)
    };
  } catch (err) {
    console.error("❌ Failed to parse JSON from OpenAI:", content);
    return { goals: 0, assists: 0, yellowCards: 0 }; 
  }
}
