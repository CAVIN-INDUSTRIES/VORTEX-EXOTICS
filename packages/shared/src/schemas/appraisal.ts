import { z } from "zod";

/** Public anonymous appraisal (no auth) — shared by web + API. */
export const publicAppraisalSchema = z
  .object({
    vin: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/).optional()
    ),
    mileage: z.number().int().min(0).optional(),
    condition: z.enum(["excellent", "good", "fair", "poor"]).optional(),
    notes: z.string().max(2000).optional(),
    images: z.array(z.string().url()).max(10).optional(),
  })
  .refine(
    (d) =>
      d.vin != null ||
      d.mileage != null ||
      d.condition != null ||
      (d.notes != null && d.notes.trim().length > 0) ||
      (d.images != null && d.images.length > 0),
    { message: "Provide at least a VIN, mileage, condition, notes, or images" }
  );

export type PublicAppraisalInput = z.infer<typeof publicAppraisalSchema>;

/** @deprecated Use publicAppraisalSchema */
export const quickAppraisalSchema = publicAppraisalSchema;
export type QuickAppraisalInput = PublicAppraisalInput;

/** Staff CRM create — optional links to inventory vehicle and customer. */
export const createAppraisalSchema = z
  .object({
    vehicleId: z.string().optional(),
    customerId: z.string().optional(),
    notes: z.string().max(8000).optional(),
    status: z.enum(["pending", "completed", "cancelled"]).optional(),
  })
  .transform((d) => ({
    ...d,
    vehicleId: d.vehicleId?.trim() ? d.vehicleId.trim() : undefined,
    customerId: d.customerId?.trim() ? d.customerId.trim() : undefined,
  }));

export type CreateAppraisalInput = z.infer<typeof createAppraisalSchema>;

export const updateAppraisalSchema = z
  .object({
    vehicleId: z.string().nullable().optional(),
    customerId: z.string().nullable().optional(),
    notes: z.string().max(8000).nullable().optional(),
    status: z.string().min(1).optional(),
    value: z.preprocess(
      (v) => (v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? undefined : Number(v)),
      z.number().nonnegative().nullable().optional()
    ),
  })
  .transform((d) => ({
    ...d,
    vehicleId: d.vehicleId === "" ? null : d.vehicleId,
    customerId: d.customerId === "" ? null : d.customerId,
  }));

export type UpdateAppraisalInput = z.infer<typeof updateAppraisalSchema>;

export const appraisalVehicleEmbedSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  trimLevel: z.string(),
  year: z.number(),
});

export const appraisalCustomerEmbedSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
});

export const appraisalOutputSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  vehicleId: z.string().nullable(),
  customerId: z.string().nullable(),
  value: z.number().nullable(),
  notes: z.string().nullable(),
  status: z.string(),
  valuationData: z.record(z.any()).nullable().optional(),
  valuationSource: z.string().nullable().optional(),
  valuationFetchedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  vehicle: appraisalVehicleEmbedSchema.nullable().optional(),
  customer: appraisalCustomerEmbedSchema.nullable().optional(),
});

export type AppraisalOutput = z.infer<typeof appraisalOutputSchema>;
