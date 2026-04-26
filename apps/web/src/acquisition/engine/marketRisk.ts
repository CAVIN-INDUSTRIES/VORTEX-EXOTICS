import { AcquisitionProfile, MarketRiskProfile, VehicleRecord } from "@/acquisition/types/contracts";
import { computeMarketSignals } from "@/acquisition/market/marketSignals";
import { calculateMarketRiskScore } from "@/acquisition/market/riskRules";

export function assessMarketRisk(profile: AcquisitionProfile, vehicle: VehicleRecord): MarketRiskProfile {
  const signals = computeMarketSignals(vehicle);
  const riskScore = calculateMarketRiskScore(profile, vehicle);
  const riskLevel = riskScore < 30 ? "low" : riskScore < 55 ? "moderate" : riskScore < 75 ? "elevated" : "high";
  return {
    vehicleId: vehicle.id,
    riskLevel,
    riskScore,
    positiveSignals: [...(signals.collectorUpside ? ["Collector upside signal"] : []), ...(signals.liquidityScore > 65 ? ["Healthy market liquidity"] : []), ...(vehicle.rarityScore > 80 ? ["Limited production benefit"] : [])],
    negativeSignals: [...(signals.oversupplyRisk ? ["Potential oversupply pressure"] : []), ...(vehicle.mileageSensitivity > 0.68 ? ["High mileage sensitivity"] : []), ...(vehicle.annualMaintenanceEstimate > 6000 ? ["Maintenance shock risk"] : []), ...(vehicle.depreciation3Year > 0.25 ? ["Depreciation acceleration"] : [])],
    advisorNotes: [`Market liquidity score: ${signals.liquidityScore.toFixed(0)}/100.`, "Generated from mock intelligence and should be validated against live market data."],
  };
}
