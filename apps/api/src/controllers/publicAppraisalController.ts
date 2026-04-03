/**
 * Public quick appraisal — pilot entry: tenant-scoped Appraisal + usage + audit (no JWT).
 * Tenant resolution runs in middleware (query → host → env); validated against DB.
 */
import { Request, Response } from "express";
import { prisma, runWithTenant } from "../lib/tenant.js";
import { mapAppraisalToOutput } from "../lib/appraisalMapper.js";
import { createPublicAppraisal, PublicAppraisalDailyCapError } from "../lib/appraisalService.js";

/** POST /public/quick-appraisal */
export async function postQuickAppraisal(req: Request, res: Response) {
  const tenantId = req.publicAppraisalTenantId;
  if (!tenantId) {
    return res.status(500).json({ code: "INTERNAL", message: "Missing resolved tenant" });
  }

  try {
    const { appraisal } = await createPublicAppraisal(tenantId, req.body);

    return res.status(201).json({
      data: {
        id: appraisal.id,
        status: "pending",
        estimatedValue: null,
        message: "Appraisal submitted. Dealer will review shortly.",
      },
      error: null,
    });
  } catch (e) {
    if (e instanceof PublicAppraisalDailyCapError) {
      return res.status(429).json({
        code: "RATE_LIMITED",
        message: e.message,
      });
    }
    throw e;
  }
}

/** GET /public/quick-appraisal/:id — read trade-in for checkout (scoped by tenant resolution). */
export async function getQuickAppraisal(req: Request, res: Response) {
  const tenantId = req.publicAppraisalTenantId;
  if (!tenantId) {
    return res.status(500).json({ code: "INTERNAL", message: "Missing resolved tenant" });
  }

  const { id } = req.params;

  const appraisal = await runWithTenant(tenantId, () =>
    prisma.appraisal.findFirst({
      where: { id },
      include: {
        vehicle: { select: { id: true, make: true, model: true, trimLevel: true, year: true } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    })
  );

  if (!appraisal) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Appraisal not found" });
  }

  return res.json({ data: mapAppraisalToOutput(appraisal), error: null });
}
