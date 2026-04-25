import type { AcquisitionProfile } from "@/acquisition/types/contracts";

export function scoreVehicles(profile: AcquisitionProfile): Array<{ vehicleId: string; score: number }> {
  const base = profile.riskTolerance * 10 + profile.ownershipDuration;
  return profile.compareVehicles.map((vehicleId, index) => ({
    vehicleId,
    score: Math.max(0, base - index * 2),
  }));
}
