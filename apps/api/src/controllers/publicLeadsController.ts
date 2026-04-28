import type { Request, Response } from "express";
import type { CreateLeadInput } from "@vex/shared";
import { prisma, runWithTenant, systemPrisma } from "../lib/tenant.js";

export async function postPublicLead(req: Request, res: Response) {
  const tenantId = req.publicTenantId;
  if (!tenantId) {
    return res.status(500).json({ code: "INTERNAL", message: "Missing resolved tenant" });
  }

  const body = req.body as CreateLeadInput;
  const normalizedEmail = body.email?.trim() || null;
  const normalizedPhone = body.phone?.trim() || null;

  if (!normalizedEmail && !normalizedPhone) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "Provide at least an email or phone number." });
  }

  const lead = await runWithTenant(tenantId, () =>
    prisma.lead.create({
      data: {
        tenant: { connect: { id: tenantId } },
        source: body.source ?? "PUBLIC_WEBSITE",
        email: normalizedEmail,
        phone: normalizedPhone,
        name: body.name?.trim() || null,
        vehicleInterest: body.vehicleInterest?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    })
  );

  await systemPrisma.auditLog.create({
    data: {
      tenantId,
      actorId: null,
      action: "PUBLIC_LEAD_CREATED",
      entity: "Lead",
      entityId: lead.id,
      payload: {
        source: lead.source,
        hasEmail: Boolean(lead.email),
        hasPhone: Boolean(lead.phone),
        vehicleInterest: lead.vehicleInterest ?? null,
        ip: req.ip ?? null,
      },
    },
  });

  return res.status(201).json({
    data: {
      id: lead.id,
      status: lead.status,
      message: "Inquiry submitted. Concierge will follow up shortly.",
    },
    error: null,
  });
}
