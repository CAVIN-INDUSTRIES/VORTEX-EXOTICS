import { systemPrisma } from "./tenant.js";

export type PilotSeedNetworkMetrics = {
  activePilots: number;
  totalPilotAppraisals: number;
  firstBillingEvents: number;
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
  const totalPilotAppraisals =
    pilotIds.length === 0 ? 0 : await systemPrisma.appraisal.count({ where: { tenantId: { in: pilotIds } } });
  const firstBillingEvents = pilotTenants.filter((t) => t.stripeCustomerId != null && String(t.stripeCustomerId).length > 0)
    .length;

  return {
    activePilots: pilotIds.length,
    totalPilotAppraisals,
    firstBillingEvents,
    generatedAt: new Date().toISOString(),
  };
}
