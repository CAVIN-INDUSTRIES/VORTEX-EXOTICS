import { z } from "zod";

export const authJwtSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.enum(["CUSTOMER", "STAFF", "ADMIN"]),
  tenantId: z.string(),
});

export type AuthJwt = z.infer<typeof authJwtSchema>;

