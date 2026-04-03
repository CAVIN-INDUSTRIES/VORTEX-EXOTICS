import type { Request } from "express";
import { findTenantByCustomDomain, normalizeHost, systemPrisma } from "./tenant.js";

/**
 * Strict priority: ?tenantId= → Host → customDomain → PUBLIC_APPRAISAL_TENANT_ID.
 * Returns null if nothing resolves (caller returns 400).
 */
export async function resolvePublicTenantId(req: Request): Promise<string | null> {
  const q = req.query.tenantId;
  if (typeof q === "string" && q.trim()) return q.trim();
  const forwarded = req.get("x-forwarded-host");
  const host = forwarded ? normalizeHost(forwarded) : req.get("host") ? normalizeHost(req.get("host")!) : "";
  if (host) {
    const t = await findTenantByCustomDomain(host);
    if (t) return t.id;
  }
  const env = process.env.PUBLIC_APPRAISAL_TENANT_ID;
  return env?.trim() || null;
}

/** Validate tenant row exists (tenant-safe public traffic). */
export async function assertTenantExists(tenantId: string): Promise<boolean> {
  const row = await systemPrisma.tenant.findFirst({
    where: { id: tenantId },
    select: { id: true },
  });
  return Boolean(row);
}
