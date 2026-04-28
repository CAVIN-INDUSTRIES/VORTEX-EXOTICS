import type { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const points = Number(process.env.PUBLIC_LEAD_IP_MAX_PER_MIN ?? 20);
const durationSec = 60;

const ipLimiter = new RateLimiterMemory({
  points,
  duration: durationSec,
});

/**
 * Per-IP sliding window for anonymous public lead intake routes.
 */
export async function publicLeadIpRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = `pub_lead:${req.ip ?? "unknown"}`;
  try {
    await ipLimiter.consume(key, 1);
    next();
  } catch {
    res.status(429).json({
      code: "RATE_LIMITED",
      message: "Too many lead submissions from this IP. Try again shortly.",
    });
  }
}
