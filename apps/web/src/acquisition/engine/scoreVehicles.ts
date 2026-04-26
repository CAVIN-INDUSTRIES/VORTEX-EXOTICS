import { AcquisitionProfile, VehicleRecord, VehicleScoreBreakdown } from "@/acquisition/types/contracts";

type ScoreCategory = Exclude<keyof VehicleScoreBreakdown, "weightedTotal" | "appliedWeights">;
const clamp = (value: number): number => Math.max(0, Math.min(100, value));

function getWeights(profile: AcquisitionProfile): Record<ScoreCategory, number> {
  const weights: Record<ScoreCategory, number> = {
    budgetFit: 18, ownershipFit: 15, emotionalFit: 12, marketStrength: 12, depreciationRisk: 12,
    reliability: 10, luxuryAlignment: 8, performanceAlignment: 7, practicality: 3, maintenanceRisk: 3,
  };
  if (profile.ownership.depreciationSensitivity === "high") {
    weights.depreciationRisk += 6; weights.performanceAlignment -= 2; weights.emotionalFit -= 2; weights.marketStrength -= 2;
  }
  if (profile.useCases.includes("daily")) {
    weights.practicality += 6; weights.reliability += 5; weights.performanceAlignment -= 4; weights.emotionalFit -= 2; weights.maintenanceRisk += 2;
  }
  if (profile.useCases.includes("weekend") || profile.useCases.includes("collector")) {
    weights.emotionalFit += 4; weights.practicality = Math.max(1, weights.practicality - 2);
  }
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  (Object.keys(weights) as ScoreCategory[]).forEach((key) => { weights[key] = Number(((weights[key] / total) * 100).toFixed(2)); });
  return weights;
}

export function scoreVehicle(profile: AcquisitionProfile, vehicle: VehicleRecord): VehicleScoreBreakdown {
  const weights = getWeights(profile);
  const budgetSpread = profile.budget.maximum - profile.budget.minimum;
  const marketDistance = Math.abs(vehicle.currentMarketAverage - profile.budget.comfortable);
  const budgetFit = clamp(100 - (marketDistance / Math.max(1, budgetSpread)) * 110);
  const ownershipFit = clamp(vehicle.ownershipUseCases.some((useCase) => profile.useCases.includes(useCase)) ? 88 : 55);
  const emotionalMatches = vehicle.emotionalTags.filter((tag) => profile.emotionalIntent.includes(tag as never)).length;
  const emotionalFit = clamp(35 + emotionalMatches * 15);
  const marketStrength = clamp(70 - vehicle.mileageSensitivity * 28 + vehicle.rarityScore * 0.18);
  const depreciationRisk = clamp(100 - vehicle.depreciation3Year * 120 - vehicle.depreciation5Year * 70);
  const reliability = clamp(vehicle.reliabilityScore);
  const luxuryAlignment = clamp((vehicle.luxuryScore + (profile.useCases.includes("business-image") ? 12 : 0)) / 1.05);
  const performanceAlignment = clamp((vehicle.performanceScore + (profile.useCases.includes("track") ? 15 : 0)) / 1.1);
  const practicality = clamp(vehicle.dailyUsabilityScore);
  const maintenanceRisk = clamp(100 - vehicle.annualMaintenanceEstimate / 140);
  const weightedTotal = clamp((budgetFit * weights.budgetFit + ownershipFit * weights.ownershipFit + emotionalFit * weights.emotionalFit + marketStrength * weights.marketStrength + depreciationRisk * weights.depreciationRisk + reliability * weights.reliability + luxuryAlignment * weights.luxuryAlignment + performanceAlignment * weights.performanceAlignment + practicality * weights.practicality + maintenanceRisk * weights.maintenanceRisk) / 100);
  return { budgetFit, ownershipFit, emotionalFit, marketStrength, depreciationRisk, reliability, luxuryAlignment, performanceAlignment, practicality, maintenanceRisk, weightedTotal, appliedWeights: weights };
}
