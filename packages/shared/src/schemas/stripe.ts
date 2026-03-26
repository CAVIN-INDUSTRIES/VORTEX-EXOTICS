import { z } from "zod";

export const stripeCheckoutSchema = z.object({
  planId: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
  interval: z.enum(["monthly", "yearly"]).optional(),
});

export type StripeCheckoutInput = z.infer<typeof stripeCheckoutSchema>;

