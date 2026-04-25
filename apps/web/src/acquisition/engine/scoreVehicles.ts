import type { AcquisitionProfile } from "@/acquisition/types/contracts";

function ownershipDurationWeight(duration: AcquisitionProfile["ownershipDuration"]): number {
  switch (duration) {
    case "under-1-year":
      return 4;
    case "1-2-years":
      return 7;
    case "3-5-years":
      return 10;
    case "5-10-years":
      return 12;
    case "long-term-collector":
      return 14;
    default:
      return 10;
  }
}

export function scoreVehicles(profile: AcquisitionProfile): Array<{ vehicleId: string; score: number }> {
  const base = profile.riskTolerance * 10 + ownershipDurationWeight(profile.ownershipDuration);
  return profile.compareVehicles.map((vehicleId, index) => ({
    vehicleId,
    score: Math.max(0, base - index * 2),
  }));
}
