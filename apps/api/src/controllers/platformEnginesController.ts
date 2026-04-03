import type { Request, Response } from "express";
import { healthPrisma } from "../lib/healthPrisma.js";
import { getRedis } from "../lib/redis.js";

type EngineStatus = "operational" | "degraded" | "standby";

/**
 * Public, read-only snapshot of major platform subsystems ("engines") for marketing uptime
 * and investor transparency. No secrets; only coarse health/configuration signals.
 */
export async function getPlatformEngines(_req: Request, res: Response): Promise<void> {
  let dbOk = true;
  try {
    await healthPrisma.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }

  let redisSignal: "operational" | "absent" | "degraded" = "absent";
  const redis = getRedis();
  if (redis) {
    try {
      await redis.ping();
      redisSignal = "operational";
    } catch {
      redisSignal = "degraded";
    }
  }

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const valuationReady =
    process.env.SKIP_VALUATION_ENV_CHECK === "1" ||
    Boolean(process.env.EDMUNDS_API_KEY?.trim() || process.env.MARKETCHECK_API_KEY?.trim());

  const integrationReady =
    Boolean(process.env.FORTELLIS_CLIENT_ID?.trim() && process.env.FORTELLIS_CLIENT_SECRET?.trim()) ||
    Boolean(process.env.TEKION_CLIENT_ID?.trim() && process.env.TEKION_CLIENT_SECRET?.trim());

  const engines: Array<{
    id: string;
    name: string;
    layer: string;
    detail: string;
    status: EngineStatus;
  }> = [
    {
      id: "core-api",
      name: "Core API",
      layer: "Edge",
      detail: "Multi-tenant REST, JWT, RBAC, rate limits",
      status: dbOk ? "operational" : "degraded",
    },
    {
      id: "data-plane",
      name: "Data plane",
      layer: "Persistence",
      detail: "PostgreSQL with AsyncLocalStorage tenant isolation",
      status: dbOk ? "operational" : "degraded",
    },
    {
      id: "workflow",
      name: "Workflow engine",
      layer: "Async",
      detail: "BullMQ: PDF, valuation cache, provisioning, DMS sync",
      status:
        redisSignal === "operational" ? "operational" : redisSignal === "degraded" ? "degraded" : "standby",
    },
    {
      id: "commerce",
      name: "Commerce engine",
      layer: "Revenue",
      detail: "Stripe Checkout, webhooks, usage metering, billing portal",
      status: stripeConfigured ? "operational" : "standby",
    },
    {
      id: "valuation",
      name: "Valuation mesh",
      layer: "Intel",
      detail: "External valuation providers, daily caps, immutable audit trail",
      status: valuationReady ? "operational" : "standby",
    },
    {
      id: "integrations",
      name: "Integration mesh",
      layer: "ERP / DMS",
      detail: "Fortellis CDK Drive, Tekion, webhooks — credential-gated",
      status: integrationReady ? "operational" : "standby",
    },
  ];

  res.json({
    data: {
      headline: "VEX runs as a coordinated multi-engine system — edge API, data plane, async workflows, commerce, valuation, and ERP mesh.",
      engines,
      signals: {
        database: dbOk ? "ok" : "error",
        redis: redisSignal,
        stripeConfigured,
        valuationProvidersConfigured: valuationReady,
        erpConnectorsConfigured: integrationReady,
      },
      generatedAt: new Date().toISOString(),
    },
    error: null,
  });
}
