import { z } from "zod";

const idPattern = /^[a-z0-9-]+$/;

export const budgetSchema = z
  .object({
    minimum: z.number().nonnegative(),
    comfortable: z.number().positive(),
    maximum: z.number().positive(),
    plan: z.enum(["cash", "finance", "lease", "open"]),
    monthlyComfort: z.number().nonnegative().optional(),
    downPayment: z.number().nonnegative().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.minimum > value.comfortable || value.comfortable > value.maximum) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Budget ranges are not in logical order." });
    }
    if (value.maximum < 10000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Maximum budget is unrealistically low for this workflow." });
    }
  });

export const acquisitionProfileSchema = z
  .object({
    clientName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7).optional(),
    location: z.string().min(2),
    timeframe: z.enum(["immediate", "30-days", "60-days", "90-days", "exploring"]),
    budget: budgetSchema,
    preferences: z.object({
      brandsWanted: z.array(z.string()).default([]),
      brandsAvoided: z.array(z.string()).default([]),
      bodyStyle: z.array(z.enum(["coupe", "convertible", "sedan", "wagon", "suv", "hatchback", "roadster"])).min(1),
      seating: z.union([z.literal(2), z.literal(4), z.literal(5)]),
      drivetrain: z.array(z.enum(["rwd", "awd", "fwd"])).min(1),
      transmission: z.array(z.enum(["automatic", "manual", "dual-clutch"])).min(1),
      modelYears: z.object({ minimum: z.number().int().min(1990), maximum: z.number().int().max(2035) }),
      mileageTolerance: z.enum(["low", "medium", "high"]),
    }),
    useCases: z.array(z.enum(["daily", "weekend", "collector", "business-image", "track", "lifestyle"])) .min(1),
    ownership: z.object({
      expectedDurationYears: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)]),
      annualMileage: z.number().int().min(500).max(50000),
      maintenanceTolerance: z.enum(["low", "medium", "high"]),
      depreciationSensitivity: z.enum(["low", "medium", "high"]),
      reliabilityImportance: z.enum(["low", "medium", "high"]),
      insuranceSensitivity: z.enum(["low", "medium", "high"]),
      riskTolerance: z.enum(["low", "balanced", "high"]),
    }),
    emotionalIntent: z.array(z.enum(["understated", "exotic", "aggressive", "elegant", "rare", "comfortable", "high-tech", "analog-raw"])) .min(1),
    comparisonWishlist: z.object({
      likedVehicles: z.array(z.string().regex(idPattern, "Malformed vehicle id")),
      compareVehicles: z.array(z.string().regex(idPattern, "Malformed vehicle id")).max(6),
      openToAlternatives: z.boolean(),
    }),
    consent: z.object({
      allowAdvisorFollowUp: z.boolean(),
      acknowledgesInformationalEstimates: z.literal(true),
    }),
  })
  .superRefine((profile, ctx) => {
    if (profile.preferences.modelYears.minimum > profile.preferences.modelYears.maximum) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Model year range is invalid." });
    }
    if (profile.comparisonWishlist.compareVehicles.length === 0 && !profile.comparisonWishlist.openToAlternatives) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Provide comparison vehicles or allow alternatives." });
    }
  });

export const reportGenerationInputSchema = z.object({
  profile: acquisitionProfileSchema,
  selectedVehicleIds: z.array(z.string().regex(idPattern)).min(1),
});

export const leadSubmissionPayloadSchema = z.object({
  contact: z.object({
    clientName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().min(2),
  }),
  acquisitionProfile: acquisitionProfileSchema,
  recommendationSummary: z.string().min(10),
  selectedVehicles: z.array(z.string().regex(idPattern)).min(1),
  reportSummary: z.string().min(10),
  timestampIso: z.string().datetime(),
  sourceRoute: z.string().startsWith("/"),
  consentFlags: z.object({
    allowAdvisorFollowUp: z.boolean(),
    acknowledgesInformationalEstimates: z.boolean(),
  }),
});

export type AcquisitionProfileInput = z.infer<typeof acquisitionProfileSchema>;
