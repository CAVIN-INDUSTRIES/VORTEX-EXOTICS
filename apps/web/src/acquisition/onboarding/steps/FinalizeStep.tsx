"use client";

import Link from "next/link";
import { useAcquisitionState } from "@/acquisition/state";
import { acquisitionTheme } from "@/acquisition/config/acquisition-theme";
import type { AcquisitionStepComponentProps } from "@/acquisition/types/contracts";

export function FinalizeStep(_: AcquisitionStepComponentProps) {
  const { profile } = useAcquisitionState();

  return (
    <div
      className="rounded-[1.25rem] border p-6"
      style={{ borderColor: acquisitionTheme.borderSoft, background: acquisitionTheme.panelSoft }}
    >
      <p className="text-xs uppercase tracking-[0.24em]" style={{ color: acquisitionTheme.text.muted }}>
        Review and continue
      </p>
      <h3 className="mt-3 text-2xl" style={{ color: acquisitionTheme.text.heading }}>
        Your acquisition profile is staged.
      </h3>
      <p className="mt-4 text-sm leading-7" style={{ color: acquisitionTheme.text.body }}>
        You can finalize this onboarding pass and preview the luxury report shell with mock intelligence output.
      </p>
      <div className="mt-6 grid gap-3 text-sm" style={{ color: acquisitionTheme.text.body }}>
        <p>Budget target: ${profile.budget.toLocaleString()}</p>
        <p>Preferred brands: {profile.preferredBrands.length > 0 ? profile.preferredBrands.join(", ") : "No preference yet"}</p>
        <p>Ownership intent: {profile.ownershipIntent}</p>
        <p>Financing preference: {profile.financingPreference}</p>
      </div>
      <div className="mt-6">
        <Link href="/private-acquisition/report-preview" className="gold-button">
          Open report preview
        </Link>
      </div>
    </div>
  );
}
