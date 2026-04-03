import type { PublicAppraisalInput } from "@vex/shared";
import { prisma, runWithTenant, systemPrisma } from "./tenant.js";

export class PublicAppraisalDailyCapError extends Error {
  override name = "PublicAppraisalDailyCapError";
  code = "PUBLIC_APPRAISAL_DAILY_CAP" as const;
}

/** Stand-in for $5/day valuation budget: max submissions per tenant per UTC day (usage-metered). */
async function assertPublicAppraisalDailyCap(tenantId: string) {
  const max = Math.max(1, Number(process.env.PUBLIC_APPRAISAL_DAILY_MAX ?? 1000));
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const count = await systemPrisma.usageLog.count({
    where: {
      tenantId,
      kind: "PUBLIC_APPRAISAL",
      createdAt: { gte: start },
    },
  });
  if (count >= max) {
    throw new PublicAppraisalDailyCapError(
      "Public appraisal daily limit reached for this tenant (guardrail). Try again tomorrow."
    );
  }
}

/**
 * Anonymous public appraisal — tenant-scoped row, usage + audit + immutable revenue signal.
 * Valuation fields left pending until external API is wired.
 */
export async function createPublicAppraisal(tenantId: string, input: PublicAppraisalInput) {
  await assertPublicAppraisalDailyCap(tenantId);

  const notes = JSON.stringify({
    vin: input.vin ?? null,
    mileage: input.mileage ?? null,
    condition: input.condition ?? null,
    notes: input.notes ?? null,
    images: input.images ?? null,
    source: "public_quick_appraisal",
  });

  return runWithTenant(tenantId, async () => {
    const appraisal = await prisma.appraisal.create({
      data: {
        tenantId,
        value: null,
        notes,
        status: "pending",
        valuationSource: "pending",
        valuationFetchedAt: null,
        valuationData: null,
      },
    });

    await prisma.$transaction([
      prisma.usageLog.create({
        data: {
          tenantId,
          kind: "PUBLIC_APPRAISAL",
          quantity: 1,
          amountUsd: 0,
          meta: { source: "public_quick_appraisal", appraisalId: appraisal.id },
        },
      }),
      prisma.eventLog.create({
        data: {
          tenantId,
          type: "RevenueEvent",
          payload: {
            appraisalId: appraisal.id,
            event: "public_appraisal_submitted",
            amountUsd: 0,
          },
        },
      }),
      prisma.auditLog.create({
        data: {
          tenantId,
          actorId: null,
          action: "PUBLIC_APPRAISAL_CREATED",
          entity: "Appraisal",
          entityId: appraisal.id,
          payload: { source: "public" },
        },
      }),
    ]);

    return { appraisal };
  });
}

/** @deprecated Prefer createPublicAppraisal — kept for scripts/tests. */
export async function createPublicQuickAppraisal(tenantId: string, input: PublicAppraisalInput) {
  return createPublicAppraisal(tenantId, input);
}
