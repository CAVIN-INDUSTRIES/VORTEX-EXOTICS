import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
});

export const createCrmOrderSchema = z.object({
  userId: z.string().optional(),
  inventoryId: z.string().optional(),
  vehicleId: z.string().optional(),
  type: z.enum(["INVENTORY", "CUSTOM_BUILD"]).default("INVENTORY"),
  status: z.enum(["DRAFT", "DEPOSIT_PAID", "CONFIRMED", "FULFILLED"]).default("DRAFT"),
  totalAmount: z.number().nonnegative().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateCrmOrderInput = z.infer<typeof createCrmOrderSchema>;

