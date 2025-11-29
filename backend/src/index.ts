import dotenv from "dotenv";
dotenv.config();

console.log("Loaded FOOTBALL_API_KEY:", process.env.FOOTBALL_API_KEY);
import express from "express";
import cors from "cors";

// import as * to handle .default automatically
import * as soccerModule from "./routes/soccer.js";
import * as nbaModule from "./routes/nba.js";
import * as nflModule from "./routes/nfl.js";
import mlbRouter from "./routes/mlb.js"; 
import predictRouter from "./routes/predict.js";


const app = express();
app.use(cors());
app.use(express.json());


const soccerRouter = soccerModule.default || soccerModule;
const nbaRouter = nbaModule.default || nbaModule;
const nflRouter = nflModule.default || nflModule;



app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});


app.use("/api/soccer", soccerRouter);
app.use("/api/nba", nbaRouter);
app.use("/api/mlb", mlbRouter);
app.use("/api/nfl", nflRouter);
app.use("/api/chat", predictRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Backend running on http://localhost:${PORT}`);
});
