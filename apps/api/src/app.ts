import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// Quick root route so the base URL actually responds with something useful
app.get("/", (_req, res) => {
  res.json({
    api: "@vex/api",
    status: "running hot 🔥",
    message: "VEX backend is live — luxury whips, no cap",
    endpoints: {
      health: "GET /health → server check",
      auth: [
        "POST /auth/register → create account",
        "POST /auth/login → get JWT",
        "GET /auth/me → current user (needs token)"
      ],
      note: "Hit /health to confirm everything's breathing"
    },
    timestamp: new Date().toISOString()
  });
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);

export { app };