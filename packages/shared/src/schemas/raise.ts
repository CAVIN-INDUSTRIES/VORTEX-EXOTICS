import { z } from "zod";

export const RaisePackageSchema = z.object({
  generatedAt: z.string(),
  tenantCount: z.number().int().nonnegative(),
  activeTenantCount: z.number().int().nonnegative(),
  mrr: z.number().nonnegative(),
  usageRevenueUsd: z.number().nonnegative(),
  highlights: z.array(z.string()),
});

export type RaisePackage = z.infer<typeof RaisePackageSchema>;
