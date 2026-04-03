import { z } from "zod";

/** Tenant-scoped feature toggles (Prisma `Flag` model). Keys are dealer-defined strings. */
export const flagUpsertSchema = z.object({
  key: z.string().min(1).max(120).regex(/^[a-z0-9._-]+$/i, "Use alphanumeric, dot, underscore, hyphen"),
  enabled: z.boolean(),
});

export type FlagUpsertInput = z.infer<typeof flagUpsertSchema>;
