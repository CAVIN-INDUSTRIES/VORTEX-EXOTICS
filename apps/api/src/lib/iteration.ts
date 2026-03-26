import { prisma } from "./tenant.js";
import type { CohortMetric } from "@vex/shared";

function retentionScoreFromUsage(input: {
  appraisalCount: number;
  aiRunCount: number;
  dmsSyncCount: number;
  marketplaceMatchCount: number;
}): number {
  const raw =
    input.appraisalCount * 0.25 +
    input.aiRunCount * 0.2 +
    input.dmsSyncCount * 0.35 +
    input.marketplaceMatchCount * 0.2;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export class PilotAnalyticsService {
  async buildCohortMetric(tenantId: string, windowDays = 30): Promise<CohortMetric> {
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    const [activeUsers, appraisalCount, aiRunCount, marketplaceMatchCount, dmsSyncCount] = await Promise.all([
      prisma.user.count({ where: { tenantId, updatedAt: { gte: since } } }),
      prisma.appraisal.count({ where: { tenantId, createdAt: { gte: since } } }),
      prisma.usageLog.count({ where: { tenantId, kind: "ai_run", createdAt: { gte: since } } }),
      prisma.growthMetric.count({ where: { tenantId, key: "marketplace_match", createdAt: { gte: since } } }),
      prisma.eventLog.count({ where: { tenantId, type: "job.dms_sync", createdAt: { gte: since } } }),
    ]);
    return {
      tenantId,
      windowDays,
      activeUsers,
      appraisalCount,
      aiRunCount,
      marketplaceMatchCount,
      dmsSyncCount,
      retentionScore: retentionScoreFromUsage({ appraisalCount, aiRunCount, dmsSyncCount, marketplaceMatchCount }),
      generatedAt: new Date().toISOString(),
    };
  }

  async upsertBacklogFromMetric(metric: CohortMetric): Promise<void> {
    const topGap =
      metric.appraisalCount < 5
        ? "Increase appraisal activation with guided onboarding prompts"
        : metric.aiRunCount < 3
          ? "Improve AI feature discoverability from CRM dashboard"
          : metric.marketplaceMatchCount < 2
            ? "Improve marketplace listing quality and auto-match triggers"
            : "Optimize conversion path from usage spikes into paid upgrades";

    const existing = await prisma.iterationBacklog.findFirst({
      where: { tenantId: metric.tenantId, status: "open", title: topGap },
      select: { id: true },
    });

    if (existing) return;

    await prisma.iterationBacklog.create({
      data: {
        tenantId: metric.tenantId,
        priority: Math.max(1, 100 - metric.retentionScore),
        title: topGap,
        description: `Auto-generated from pilot cohort metric window=${metric.windowDays}d score=${metric.retentionScore}`,
        source: "analytics",
        status: "open",
        score: Number((metric.retentionScore / 100).toFixed(2)),
      },
    });
  }
}
