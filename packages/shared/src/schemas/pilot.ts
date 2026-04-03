import { z } from "zod";

export const pilotEmailCodeRequestSchema = z.object({
  email: z.string().email(),
});

export const PilotOnboardSchema = z.object({
  email: z.string().email(),
  dealerName: z.string().min(2).max(120),
  password: z.string().min(8),
  /** Rough lot / org size for pilot segmentation */
  businessSize: z.enum(["1_5", "6_20", "21_50", "51_PLUS"]).optional(),
  /** Expected appraisal / deal volume — used for pilot success segmentation */
  expectedMonthlyVolume: z.enum(["UNDER_10", "UNDER_50", "UNDER_200", "OVER_200"]).optional(),
  tier: z.enum(["STARTER", "PRO", "ENTERPRISE"]).default("PRO"),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  captchaToken: z.string().min(1),
  customDomain: z.string().min(3).max(120).optional(),
  enableDemoData: z.boolean().default(true),
  /** 6-digit code from POST /onboard/pilot/email-code (required unless PILOT_SKIP_EMAIL_VERIFY=1 on API) */
  emailVerificationCode: z.string().regex(/^\d{6}$/).optional(),
});

export const PilotFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(10),
  message: z.string().min(2).max(2000),
  channel: z.enum(["in_app", "email", "sms"]).default("in_app"),
});

export type PilotOnboardInput = z.infer<typeof PilotOnboardSchema>;
export type PilotFeedbackInput = z.infer<typeof PilotFeedbackSchema>;
