"use client";

import type { AcquisitionProfile } from "@/acquisition/types/contracts";

type BudgetStepProps = {
  profile: AcquisitionProfile;
  setField: <K extends keyof AcquisitionProfile>(key: K, value: AcquisitionProfile[K]) => void;
};

export function BudgetStep({ profile, setField }: BudgetStepProps) {
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
          onChange={(event) => setField("budget", Number(event.target.value) || 0)}
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
          onChange={(event) => setField("riskTolerance", Number(event.target.value))}
        />
        <p className="text-sm text-[#d8d0c2]">
          Level <span className="text-[#f1d38a]">{profile.riskTolerance}</span> / 10
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="ownershipDuration" className="text-sm uppercase tracking-[0.18em] text-[#bcae97]">
          Planned ownership duration (months)
        </label>
        <input
          id="ownershipDuration"
          type="number"
          min={1}
          value={profile.ownershipDuration}
          onChange={(event) => setField("ownershipDuration", Number(event.target.value) || 12)}
          className="field-base"
          placeholder="36"
        />
      </div>
    </div>
  );
}
