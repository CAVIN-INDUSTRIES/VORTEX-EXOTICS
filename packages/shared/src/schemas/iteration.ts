import { z } from "zod";

export const CohortMetricSchema = z.object({
  tenantId: z.string(),
  windowDays: z.number().int().min(1).max(365),
  activeUsers: z.number().int().min(0),
  appraisalCount: z.number().int().min(0),
  aiRunCount: z.number().int().min(0),
  marketplaceMatchCount: z.number().int().min(0),
  dmsSyncCount: z.number().int().min(0),
  retentionScore: z.number().min(0).max(100),
  generatedAt: z.string(),
});

export const IterationFeedbackSchema = z.object({
  category: z.enum(["bug", "feature", "ux", "billing", "other"]),
  severity: z.enum(["low", "medium", "high"]),
  title: z.string().min(3).max(140),
  details: z.string().min(3).max(4000),
  source: z.enum(["pilot", "support", "analytics", "internal"]).default("pilot"),
});

export type CohortMetric = z.infer<typeof CohortMetricSchema>;
export type IterationFeedback = z.infer<typeof IterationFeedbackSchema>;
