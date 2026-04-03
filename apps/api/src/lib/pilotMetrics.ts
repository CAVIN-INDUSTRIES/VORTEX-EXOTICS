import { OrderStatus } from "@prisma/client";
import { systemPrisma } from "./tenant.js";

export type PilotSeedNetworkMetrics = {
  activePilots: number;
  totalPilotAppraisals: number;
  firstBillingEvents: number;
  /** Anonymous public appraisals submitted today (UTC) across pilot tenants */
  publicIntakeToday: number;
  /** Deal-desk / inventory orders in terminal states across pilot tenants */
  closedDealsAcrossPilots: number;
  generatedAt: string;
};

/** Aggregates across all tenants with pilot onboarding metadata (internal / investor). */
export async function getPilotSeedNetworkMetrics(): Promise<PilotSeedNetworkMetrics> {
  const tenants = await systemPrisma.tenant.findMany({
    select: { id: true, groupSettings: true, stripeCustomerId: true },
  });
  const pilotTenants = tenants.filter((t) => {
    const gs = t.groupSettings as { pilotOnboardedAt?: string } | null;
    return Boolean(gs?.pilotOnboardedAt);
  });
  const pilotIds = pilotTenants.map((t) => t.id);
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);

  const [totalPilotAppraisals, publicIntakeToday, closedDealsAcrossPilots] = await Promise.all([
    pilotIds.length === 0 ? Promise.resolve(0) : systemPrisma.appraisal.count({ where: { tenantId: { in: pilotIds } } }),
    pilotIds.length === 0
      ? Promise.resolve(0)
      : systemPrisma.usageLog.count({
          where: {
            tenantId: { in: pilotIds },
            kind: "PUBLIC_APPRAISAL",
            createdAt: { gte: dayStart },
          },
        }),
    pilotIds.length === 0
      ? Promise.resolve(0)
      : systemPrisma.order.count({
          where: {
            tenantId: { in: pilotIds },
            status: { in: [OrderStatus.CONFIRMED, OrderStatus.FULFILLED] },
          },
        }),
  ]);

  const firstBillingEvents = pilotTenants.filter((t) => t.stripeCustomerId != null && String(t.stripeCustomerId).length > 0)
    .length;

  return {
    activePilots: pilotIds.length,
    totalPilotAppraisals,
    firstBillingEvents,
    publicIntakeToday,
    closedDealsAcrossPilots,
    generatedAt: new Date().toISOString(),
  };
}
