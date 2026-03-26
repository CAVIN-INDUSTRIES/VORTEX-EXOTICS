import { z } from "zod";

export const analyticsLeadStatusBreakdownSchema = z.object({
  NEW: z.number(),
  CONTACTED: z.number(),
  QUALIFIED: z.number(),
  LOST: z.number(),
});

export const analyticsOrderStatusBreakdownSchema = z.object({
  DRAFT: z.number(),
  DEPOSIT_PAID: z.number(),
  CONFIRMED: z.number(),
  FULFILLED: z.number(),
});

export const analyticsRevenuePointSchema = z.object({
  month: z.string(),
  revenue: z.number(),
});

export const analyticsResponseSchema = z.object({
  inventoryCount: z.number(),
  leadsTotal: z.number(),
  leadsConverted: z.number(),
  leadsByStatus: analyticsLeadStatusBreakdownSchema,
  ordersByStatus: analyticsOrderStatusBreakdownSchema,
  revenueTotal: z.number(),
  revenueByMonth: z.array(analyticsRevenuePointSchema),
});

export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
export type AnalyticsRevenuePoint = z.infer<typeof analyticsRevenuePointSchema>;
