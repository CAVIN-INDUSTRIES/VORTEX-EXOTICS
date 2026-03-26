import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authJwtSchema } from "@vex/shared";
import { requireAuth } from "./auth.js";
import { runWithTenant } from "../lib/tenant.js";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow system endpoints to stay unauthenticated.
  if (req.path === "/health" || req.path === "/") return next();
  if (req.path.startsWith("/webhooks/")) return next();
  if (req.path.startsWith("/stripe/webhook")) return next();
  if (req.path === "/pricing/plans" && req.method === "GET") return next();
  if (req.path === "/auth/register" || req.path === "/auth/login") return next();

  return requireAuth(req, res, async () => {
    const attempted =
      (req.body && typeof req.body === "object" && "tenantId" in (req.body as Record<string, unknown>)) ||
      (req.query && typeof req.query === "object" && "tenantId" in (req.query as Record<string, unknown>));
    if (attempted) {
      return res.status(403).json({ code: "FORBIDDEN", message: "Do not pass tenantId via request body or query" });
    }

    const parsed = authJwtSchema.safeParse(req.user);
    if (!parsed.success) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid auth token" });
    }

    let tenantId = parsed.data.tenantId;

    if (parsed.data.role === "ADMIN") {
      const override = req.header("x-tenant-override");
      if (override) {
        const exists = await prisma.tenant.findUnique({ where: { id: override } });
        if (!exists) return res.status(404).json({ code: "NOT_FOUND", message: "Tenant override not found" });
        tenantId = override;
      }
    }

    req.tenantId = tenantId;

    return runWithTenant(tenantId, () => next());
  });
}

