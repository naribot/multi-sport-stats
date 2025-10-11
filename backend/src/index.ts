import express from "express";
import cors from "cors";

// 👇 Always import as * to handle .default automatically
import * as soccerModule from "./routes/soccer.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Extract default export safely
const soccerRouter = soccerModule.default || soccerModule;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// ✅ Use router confidently
app.use("/api/soccer", soccerRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
