import { z } from "zod";

export const UsageEventSchema = z.object({
  kind: z.enum(["appraisal", "dms_sync", "ai_run", "marketplace_txn"]),
  quantity: z.number().int().positive().default(1),
  amountUsd: z.number().nonnegative().optional(),
  refId: z.string().optional(),
});

export const UpsellOfferSchema = z.object({
  offerCode: z.string().min(2).max(80),
  variant: z.enum(["A", "B"]),
  title: z.string().min(2).max(120),
  body: z.string().min(2).max(500),
  ctaUrl: z.string().min(1),
  expiresAt: z.string(),
});

export type UsageEvent = z.infer<typeof UsageEventSchema>;
export type UpsellOffer = z.infer<typeof UpsellOfferSchema>;
