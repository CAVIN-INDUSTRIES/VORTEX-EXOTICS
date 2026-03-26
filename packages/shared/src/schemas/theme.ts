import { z } from "zod";

/** CSS variable overrides for white-label tenant branding (optional keys). */
export const tenantThemeJsonSchema = z
  .object({
    accent: z.string().optional(),
    bgPrimary: z.string().optional(),
    bgCard: z.string().optional(),
    textPrimary: z.string().optional(),
    textSecondary: z.string().optional(),
    textMuted: z.string().optional(),
  })
  .passthrough();

export type TenantThemeJson = z.infer<typeof tenantThemeJsonSchema>;
