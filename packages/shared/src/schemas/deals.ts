import { z } from "zod";

/** STAFF|ADMIN: enqueue autonomous deal pipeline (valuation warm → PDF → Stripe placeholder → notify). */
export const AutonomousDealOrchestrationSchema = z.object({
  appraisalId: z.string().min(1),
  correlationId: z.string().min(8).max(128).optional(),
});

export type AutonomousDealOrchestrationInput = z.infer<typeof AutonomousDealOrchestrationSchema>;
