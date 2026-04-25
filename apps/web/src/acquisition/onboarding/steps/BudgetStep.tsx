"use client";

import type { AcquisitionStepComponentProps } from "@/acquisition/types/contracts";

export function BudgetStep({ profile, onProfilePatch }: AcquisitionStepComponentProps) {
  const ownershipDurationOptions = [
    { label: "Under 1 year", value: "under-1-year" as const },
    { label: "1-2 years", value: "1-2-years" as const },
    { label: "3-5 years", value: "3-5-years" as const },
    { label: "5-10 years", value: "5-10-years" as const },
    { label: "Long-term collector", value: "long-term-collector" as const },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="budget" className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">
          Comfortable acquisition budget (USD)
        </label>
        <input
          id="budget"
          type="number"
          min={0}
          value={profile.budget}
          onChange={(event) => onProfilePatch({ budget: Number(event.target.value) || 0 })}
          className="field-base"
          placeholder="450000"
        />
      </div>

      <div className="grid gap-3">
        <label htmlFor="riskTolerance" className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">
          Risk tolerance
        </label>
        <input
          id="riskTolerance"
          type="range"
          min={1}
          max={10}
          value={profile.riskTolerance}
          onChange={(event) => onProfilePatch({ riskTolerance: Number(event.target.value) })}
        />
        <p className="text-sm text-[#d8d0c2]">
          Level <span className="text-[#f1d38a]">{profile.riskTolerance}</span> / 10
        </p>
      </div>

      <div className="grid gap-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">Planned ownership duration</p>
        <div className="flex flex-wrap gap-2">
          {ownershipDurationOptions.map((option) => {
            const active = profile.ownershipDuration === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onProfilePatch({ ownershipDuration: option.value })}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                  active
                    ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff5de]"
                    : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="monthlyOwnershipComfort" className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">
          Monthly ownership comfort (USD)
        </label>
        <input
          id="monthlyOwnershipComfort"
          type="number"
          min={500}
          value={profile.monthlyOwnershipComfort}
          onChange={(event) => onProfilePatch({ monthlyOwnershipComfort: Number(event.target.value) || 0 })}
          className="field-base"
          placeholder="5500"
        />
      </div>

      <div className="grid gap-3">
        <p className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">Financing preference</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Cash", value: "cash" },
            { label: "Financing", value: "financing" },
            { label: "Lease", value: "lease" },
            { label: "Open", value: "open" },
          ].map((option) => {
            const active = profile.financingPreference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onProfilePatch({
                    financingPreference: option.value as AcquisitionStepComponentProps["profile"]["financingPreference"],
                  })
                }
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                  active
                    ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff5de]"
                    : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
