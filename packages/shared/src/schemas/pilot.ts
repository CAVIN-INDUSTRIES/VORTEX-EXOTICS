import { z } from "zod";

export const PilotOnboardSchema = z.object({
  email: z.string().email(),
  dealerName: z.string().min(2).max(120),
  password: z.string().min(8),
  tier: z.enum(["STARTER", "PRO", "ENTERPRISE"]).default("PRO"),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  captchaToken: z.string().min(1),
  customDomain: z.string().min(3).max(120).optional(),
  enableDemoData: z.boolean().default(true),
});

export const PilotFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(10),
  message: z.string().min(2).max(2000),
  channel: z.enum(["in_app", "email", "sms"]).default("in_app"),
});

export type PilotOnboardInput = z.infer<typeof PilotOnboardSchema>;
export type PilotFeedbackInput = z.infer<typeof PilotFeedbackSchema>;
