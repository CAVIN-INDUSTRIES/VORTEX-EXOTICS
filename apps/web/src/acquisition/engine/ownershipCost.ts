import type { AcquisitionProfile } from "@/acquisition/types/contracts";

export function ownershipCost(profile: AcquisitionProfile): number {
  const base = profile.budget * 0.045;
  const lifestyleMultiplier = Math.max(1, profile.lifestyle.length * 0.04);
  const durationMultiplier = profile.ownershipDuration === "5-10-years" || profile.ownershipDuration === "long-term-collector" ? 0.88 : 1;
  return Math.round(base * lifestyleMultiplier * durationMultiplier);
}
