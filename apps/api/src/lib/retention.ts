import { prisma } from "./tenant.js";
import { enqueuePilotSuccessNudge } from "./queue.js";

type ChurnSignal = {
  appraisalCount30d: number;
  aiRuns30d: number;
  daysSinceLastActive: number;
  activeSubscription: boolean;
};

export function predictChurnRisk(signal: ChurnSignal): { riskScore: number; riskBand: "low" | "medium" | "high" } {
  let score = 0;
  if (signal.appraisalCount30d < 3) score += 30;
  if (signal.aiRuns30d < 2) score += 20;
  if (signal.daysSinceLastActive > 14) score += 35;
  if (!signal.activeSubscription) score += 25;
  const bounded = Math.max(0, Math.min(100, score));
  const riskBand = bounded >= 70 ? "high" : bounded >= 40 ? "medium" : "low";
  return { riskScore: bounded, riskBand };
}

export async function runTenantRetentionCycle(tenantId: string): Promise<{ riskScore: number; riskBand: "low" | "medium" | "high" }> {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [appraisalCount30d, aiRuns30d, lastEvent, activeSub, owner] = await Promise.all([
    prisma.appraisal.count({ where: { tenantId, createdAt: { gte: since30d } } }),
    prisma.usageLog.count({ where: { tenantId, kind: "ai_run", createdAt: { gte: since30d } } }),
    prisma.eventLog.findFirst({ where: { tenantId }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    prisma.subscription.findFirst({ where: { tenantId, status: "ACTIVE" }, select: { id: true } }),
    prisma.user.findFirst({ where: { tenantId, role: "ADMIN" }, select: { id: true, email: true, phone: true } }),
  ]);

  const daysSinceLastActive = lastEvent ? Math.floor((Date.now() - lastEvent.createdAt.getTime()) / (24 * 60 * 60 * 1000)) : 999;
  const prediction = predictChurnRisk({
    appraisalCount30d,
    aiRuns30d,
    daysSinceLastActive,
    activeSubscription: Boolean(activeSub),
  });

  await prisma.growthMetric.create({
    data: {
      tenantId,
      key: "churn_risk_score",
      value: prediction.riskScore,
      meta: {
        riskBand: prediction.riskBand,
        appraisalCount30d,
        aiRuns30d,
        daysSinceLastActive,
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId,
      actorId: owner?.id,
      action: "RETENTION_CYCLE_RUN",
      entity: "Retention",
      payload: {
        riskScore: prediction.riskScore,
        riskBand: prediction.riskBand,
      },
    },
  });

  if (prediction.riskBand !== "low" && owner) {
    await enqueuePilotSuccessNudge({
      tenantId,
      userId: owner.id,
      email: owner.email ?? undefined,
      phone: owner.phone ?? undefined,
      step: "first_appraisal_24h",
    });
  }

  return prediction;
}
