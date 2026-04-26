import { LeadSubmissionPayload } from "@/acquisition/types/contracts";
import { leadSubmissionPayloadSchema } from "@/acquisition/schemas/acquisitionSchemas";
import { getPublicApiBase } from "@/lib/apiBase";

export function buildLeadPayload(payload: LeadSubmissionPayload): LeadSubmissionPayload {
  return leadSubmissionPayloadSchema.parse(payload) as LeadSubmissionPayload;
}

export async function submitLeadPayload(payload: LeadSubmissionPayload): Promise<{ ok: boolean; message: string }> {
  const parsed = buildLeadPayload(payload);
  const apiBase = getPublicApiBase();

  if (!apiBase) {
    return { ok: false, message: "API base is not configured. Lead submission is unavailable in this environment." };
  }

  try {
    const response = await fetch(`${apiBase}/acquisition/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      return { ok: false, message: "Lead submission failed. Please retry." };
    }

    return { ok: true, message: "Lead submitted." };
  } catch {
    return { ok: false, message: "Lead submission unavailable. Please retry or contact advisor." };
  }
}
