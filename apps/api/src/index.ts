import "dotenv/config";
import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(JSON.stringify({
    api: "@vex/api",
    status: "running hot 🔥",
    message: "VEX backend is live — luxury whips, no cap",
    endpoints: {
      health: "GET /health → server check",
      auth: [
        "POST /auth/register → create account",
        "POST /auth/login → get JWT",
        "GET /auth/me → current user (needs token)",
      ],
    },
    note: "Hit /health to confirm everything's breathing",
    timestamp: new Date().toISOString(),
  }, null, 2));
  console.log(`\n→ http://localhost:${PORT}/health\n`);
});
