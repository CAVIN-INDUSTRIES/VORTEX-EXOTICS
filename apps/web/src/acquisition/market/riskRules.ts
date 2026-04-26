import { AcquisitionProfile, VehicleRecord } from "@/acquisition/types/contracts";
import { computeMarketSignals } from "@/acquisition/market/marketSignals";

export function calculateMarketRiskScore(profile: AcquisitionProfile, vehicle: VehicleRecord): number {
  const signals = computeMarketSignals(vehicle);
  let score = 35;
  if (signals.oversupplyRisk) score += 12;
  if (signals.redesignRisk) score += 8;
  if (vehicle.mileageSensitivity > 0.7) score += 10;
  if (vehicle.annualMaintenanceEstimate > 6000) score += 14;
  if (vehicle.depreciation3Year > 0.25) score += 14;
  if (signals.collectorUpside) score -= 10;
  if (profile.ownership.riskTolerance === "low") score += 8;
  if (profile.ownership.depreciationSensitivity === "high") score += 10;
  return Math.max(0, Math.min(100, score));
}
