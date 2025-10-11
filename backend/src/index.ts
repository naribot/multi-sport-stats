import express from "express";
import cors from "cors";

// 👇 Always import as * to handle .default automatically
import * as soccerModule from "./routes/soccer.js";
import * as nbaModule from "./routes/nba.js";


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Extract default export safely
const soccerRouter = soccerModule.default || soccerModule;
const nbaRouter = nbaModule.default || nbaModule;


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// ✅ Use router confidently
app.use("/api/soccer", soccerRouter);
app.use("/api/nba", nbaRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
