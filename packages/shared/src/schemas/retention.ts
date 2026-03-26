import { z } from "zod";

export const retentionTriggerSchema = z.object({
  tenantId: z.string(),
  trigger: z.enum(["churn_risk_high", "usage_drop", "pilot_expiring"]),
  targetUserId: z.string().optional(),
});

export const upsellOfferSchema = z.object({
  tenantId: z.string(),
  offerType: z.enum(["ai_pro", "dms_sync_pack", "multi_location"]),
  discountPct: z.number().min(0).max(100).optional(),
});

export const churnPredictionSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskBand: z.enum(["low", "medium", "high"]),
});

export const npsFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(10),
  message: z.string().min(2).max(2000),
  channel: z.enum(["in_app", "email", "sms"]).default("in_app"),
});
