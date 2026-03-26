import { Request, Response } from "express";
import { findTenantByCustomDomain, normalizeHost } from "../lib/tenant.js";

function hostFromRequest(req: Request): string {
  const q = req.query.domain;
  if (typeof q === "string" && q.trim()) return normalizeHost(q);
  const forwarded = req.get("x-forwarded-host");
  if (forwarded) return normalizeHost(forwarded);
  const h = req.get("host");
  return h ? normalizeHost(h) : "";
}

/**
 * Public: resolve white-label tenant by Host / ?domain= for themed web + CRM shells.
 */
export async function getPublicBranding(req: Request, res: Response) {
  const host = hostFromRequest(req);
  if (!host) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "Host or domain query required" });
  }

  const tenant = await findTenantByCustomDomain(host);
  if (!tenant) {
    return res.json({
      data: { tenantId: null as string | null, name: null as string | null, theme: null as Record<string, unknown> | null },
    });
  }

  return res.json({
    data: {
      tenantId: tenant.id,
      name: tenant.name,
      theme: tenant.themeJson,
      customDomain: tenant.customDomain,
    },
  });
}
