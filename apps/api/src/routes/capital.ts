import crypto from "node:crypto";
import { Router } from "express";
import { RaisePackageSchema } from "@vex/shared";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { prisma } from "../lib/tenant.js";
import { getRedis } from "../lib/redis.js";

export const capitalRouter: Router = Router();

const memInvestorLinks = new Map<string, { payload: Record<string, unknown>; expAt: number }>();

function monthlyAmountForTier(tier: string): number {
  if (tier === "PRO") return 149;
  if (tier === "ENTERPRISE") return 299;
  return 49;
}

async function getRaisePackage() {
  const [tenants, usageSum] = await Promise.all([
    prisma.tenant.findMany({
      select: { billingTier: true, stripeSubscriptionStatus: true },
    }),
    prisma.usageLog.aggregate({
      _sum: { amountUsd: true },
    }),
  ]);
  const active = tenants.filter((t) => t.stripeSubscriptionStatus && t.stripeSubscriptionStatus !== "CANCELED");
  const mrr = active.reduce((sum, t) => sum + monthlyAmountForTier(t.billingTier), 0);
  const pkg = {
    generatedAt: new Date().toISOString(),
    tenantCount: tenants.length,
    activeTenantCount: active.length,
    mrr,
    usageRevenueUsd: Number(usageSum._sum.amountUsd ?? 0),
    highlights: [
      "Pilot onboarding, usage telemetry, and retention loops active",
      "Tenant-scoped architecture with auditability and billing hooks",
      "Investor-ready KPI package generated from live data",
    ],
  };
  return RaisePackageSchema.parse(pkg);
}

capitalRouter.get("/package", requireAuth, requireRole("ADMIN", "GROUP_ADMIN"), async (_req, res) => {
  const pkg = await getRaisePackage();
  return res.json({ data: pkg, error: null });
});

capitalRouter.post("/investor-link", requireAuth, requireRole("ADMIN", "GROUP_ADMIN"), async (req, res) => {
  const pkg = await getRaisePackage();
  const token = crypto.randomBytes(24).toString("hex");
  const ttlSeconds = 60 * 30;
  const expAt = Date.now() + ttlSeconds * 1000;
  const redis = getRedis();
  if (redis) {
    await redis.set(`vex:capital:link:${token}`, JSON.stringify(pkg), "EX", ttlSeconds);
  } else {
    memInvestorLinks.set(token, { payload: pkg as unknown as Record<string, unknown>, expAt });
  }
  await prisma.auditLog.create({
    data: {
      tenantId: req.tenantId!,
      actorId: req.user?.userId,
      action: "CAPITAL_INVESTOR_LINK_CREATED",
      entity: "Capital",
      entityId: token.slice(0, 12),
      payload: { ttlSeconds },
    },
  });
  return res.status(201).json({ data: { token, expiresAt: new Date(expAt).toISOString() }, error: null });
});

capitalRouter.get("/investor/:token", async (req, res) => {
  const token = req.params.token;
  const redis = getRedis();
  let payload: unknown = null;
  if (redis) {
    const raw = await redis.get(`vex:capital:link:${token}`);
    if (raw) payload = JSON.parse(raw) as unknown;
  } else {
    const row = memInvestorLinks.get(token);
    if (row && row.expAt > Date.now()) payload = row.payload;
  }
  if (!payload) return res.status(404).json({ code: "NOT_FOUND", message: "Investor link not found or expired" });
  const parsed = RaisePackageSchema.safeParse(payload);
  if (!parsed.success) return res.status(500).json({ code: "INTERNAL", message: "Invalid investor package" });
  return res.json({ data: parsed.data, error: null });
});
