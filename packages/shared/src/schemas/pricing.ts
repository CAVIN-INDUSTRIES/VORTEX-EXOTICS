import { z } from "zod";

export const pricingTierSchema = z.enum(["STARTER", "PRO", "ENTERPRISE"]);
export const pricingIntervalSchema = z.enum(["monthly", "yearly"]).default("monthly");

export const createPortalSessionSchema = z.object({
  returnUrl: z.string().url().optional(),
});

export const createTierCheckoutSchema = z.object({
  tier: pricingTierSchema,
  interval: pricingIntervalSchema.optional(),
});

export type PricingTier = z.infer<typeof pricingTierSchema>;
export type PricingInterval = z.infer<typeof pricingIntervalSchema>;
export type CreatePortalSessionInput = z.infer<typeof createPortalSessionSchema>;
export type CreateTierCheckoutInput = z.infer<typeof createTierCheckoutSchema>;

