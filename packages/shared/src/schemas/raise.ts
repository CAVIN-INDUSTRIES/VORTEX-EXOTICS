import { z } from "zod";

export const RaisePackageSchema = z.object({
  generatedAt: z.string(),
  tenantCount: z.number().int().nonnegative(),
  activeTenantCount: z.number().int().nonnegative(),
  mrr: z.number().nonnegative(),
  usageRevenueUsd: z.number().nonnegative(),
  highlights: z.array(z.string()),
  /** Aggregated pilot network metrics (optional — merged for investor deck) */
  pilotNetwork: z
    .object({
      activePilots: z.number().int().nonnegative(),
      totalPilotAppraisals: z.number().int().nonnegative(),
      firstBillingEvents: z.number().int().nonnegative(),
      generatedAt: z.string(),
    })
    .optional(),
});

export type RaisePackage = z.infer<typeof RaisePackageSchema>;
