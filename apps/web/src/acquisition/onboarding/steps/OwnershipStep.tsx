"use client";

import type { AcquisitionStepComponentProps } from "@/acquisition/types/contracts";

const ownershipIntentOptions = [
  "Daily driver",
  "Weekend exotic",
  "Collector asset",
  "Investment hold",
  "Luxury status",
  "Track use",
  "Business image",
];

const ownershipDurationOptions = [
  { value: "under-1-year", label: "Under 1 year" },
  { value: "1-2-years", label: "1-2 years" },
  { value: "3-5-years", label: "3-5 years" },
  { value: "5-10-years", label: "5-10 years" },
  { value: "long-term-collector", label: "Long-term collector" },
] as const;

const drivingFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "rarely", label: "Rarely" },
] as const;

export function OwnershipStep({ profile, onProfilePatch }: AcquisitionStepComponentProps) {
  return (
    <section className="grid gap-6">
      <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-[#f1d38a]/76">Ownership intent</p>
        <p className="mt-2 text-sm text-[#d8d0c2]">Why are you purchasing?</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ownershipIntentOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onProfilePatch({ ownershipIntent: option })}
              className={`rounded-[1rem] border px-4 py-3 text-left transition ${
                profile.ownershipIntent === option
                  ? "border-[#f1d38a]/55 bg-[#d4af37]/14 text-[#fff8eb]"
                  : "border-white/10 bg-white/[0.03] text-[#d8d0c2] hover:border-[#f1d38a]/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-[#f1d38a]/76">Ownership duration</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ownershipDurationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onProfilePatch({ ownershipDuration: option.value })}
              className={`rounded-[1rem] border px-4 py-3 text-left transition ${
                profile.ownershipDuration === option.value
                  ? "border-[#f1d38a]/55 bg-[#d4af37]/14 text-[#fff8eb]"
                  : "border-white/10 bg-white/[0.03] text-[#d8d0c2] hover:border-[#f1d38a]/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-[#f1d38a]/76">Driving frequency</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {drivingFrequencyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onProfilePatch({ drivingFrequency: option.value })}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                profile.drivingFrequency === option.value
                  ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff5de]"
                  : "border-white/12 bg-white/[0.03] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
