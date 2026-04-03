import type { Prisma } from "@prisma/client";

export function slugifyPilotSubdomain(dealerName: string): string {
  const s = dealerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || "dealer";
}

/** Reserves a unique `pilotSubdomain` string across existing tenant groupSettings. */
export async function pickUniquePilotSubdomain(
  tx: Prisma.TransactionClient,
  dealerName: string,
  tenantId: string
): Promise<string> {
  const base = slugifyPilotSubdomain(dealerName);
  const all = await tx.tenant.findMany({ select: { id: true, groupSettings: true } });
  const taken = (sub: string) =>
    all.some(
      (row) =>
        row.id !== tenantId && (row.groupSettings as { pilotSubdomain?: string } | null)?.pilotSubdomain === sub
    );

  let attempt = 0;
  while (attempt < 48) {
    const suffix = attempt === 0 ? tenantId.slice(0, 8) : `${tenantId.slice(0, 6)}-${attempt}`;
    const candidate = `${base}-${suffix}`;
    if (!taken(candidate)) return candidate;
    attempt += 1;
  }
  return `${base}-${tenantId}`;
}
