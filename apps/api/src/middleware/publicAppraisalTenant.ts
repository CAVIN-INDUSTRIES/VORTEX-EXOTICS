import type { Request, Response, NextFunction } from "express";
import { assertTenantExists, resolvePublicTenantId } from "../lib/publicTenantResolve.js";

declare global {
  namespace Express {
    interface Request {
      /** Set by tenant resolution middleware for public appraisal routes. */
      publicAppraisalTenantId?: string;
    }
  }
}

/**
 * Resolves tenant (query → host → env), validates tenant exists, attaches to request.
 */
export async function resolvePublicAppraisalTenant(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = await resolvePublicTenantId(req);
    if (!tenantId) {
      const message =
        "Could not resolve tenant (set PUBLIC_APPRAISAL_TENANT_ID or use a mapped custom domain / ?tenantId=)";
      return res.status(400).json({ code: "BAD_REQUEST", message });
    }
    const ok = await assertTenantExists(tenantId);
    if (!ok) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Tenant not found" });
    }
    req.publicAppraisalTenantId = tenantId;
    next();
  } catch (e) {
    next(e);
  }
}
