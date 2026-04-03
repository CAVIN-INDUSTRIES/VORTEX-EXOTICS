import { Router } from "express";
import { Prisma } from "@prisma/client";
import { flagUpsertSchema } from "@vex/shared";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateBody } from "../middleware/validate.js";
import { prisma } from "../lib/tenant.js";

export const flagsRouter: Router = Router();

flagsRouter.get("/", requireAuth, requireRole("STAFF", "ADMIN", "GROUP_ADMIN"), async (req, res) => {
  if (!req.tenantId) return res.status(401).json({ code: "UNAUTHORIZED", message: "Tenant context missing" });

  const rows = await prisma.flag.findMany({
    select: { id: true, key: true, enabled: true, updatedAt: true },
    orderBy: { key: "asc" },
  });
  return res.json({ data: { items: rows, total: rows.length }, error: null });
});

flagsRouter.put(
  "/",
  requireAuth,
  requireRole("ADMIN", "GROUP_ADMIN"),
  validateBody(flagUpsertSchema),
  async (req, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(401).json({ code: "UNAUTHORIZED", message: "Tenant context missing" });

    const body = req.body as { key: string; enabled: boolean };

    const existing = await prisma.flag.findFirst({
      where: { key: body.key },
      select: { id: true },
    });
    if (existing) {
      await prisma.flag.updateMany({ where: { id: existing.id }, data: { enabled: body.enabled } });
    } else {
      try {
        await prisma.flag.create({
          data: { tenantId, key: body.key, enabled: body.enabled },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
          await prisma.flag.updateMany({ where: { key: body.key }, data: { enabled: body.enabled } });
        } else {
          throw e;
        }
      }
    }
    const row = await prisma.flag.findFirst({
      where: { key: body.key },
      select: { id: true, key: true, enabled: true, updatedAt: true },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: req.user?.userId,
        action: "FEATURE_FLAG_UPSERT",
        entity: "Flag",
        entityId: row?.id,
        payload: { key: body.key, enabled: body.enabled },
      },
    });

    return res.json({ data: row, error: null });
  }
);
