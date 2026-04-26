import { MarketRiskProfile, VehicleCandidate, VehicleRecommendation } from "@/acquisition/types/contracts";

function pick(candidates: VehicleCandidate[], selector: (candidate: VehicleCandidate) => number): VehicleCandidate | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => selector(b) - selector(a))[0] ?? null;
}

export function rankRecommendations(candidates: VehicleCandidate[], marketRisks: MarketRiskProfile[]): VehicleRecommendation[] {
  if (candidates.length === 0) return [];
  const riskByVehicle = new Map(marketRisks.map((risk) => [risk.vehicleId, risk]));
  const mapped: Array<[VehicleRecommendation["type"], VehicleCandidate | null, string]> = [
    ["best-overall", pick(candidates, (c) => c.score.weightedTotal), "Best Overall Match"],
    ["best-financial", pick(candidates, (c) => c.score.budgetFit + c.score.depreciationRisk + c.score.maintenanceRisk), "Best Financial Choice"],
    ["best-emotional", pick(candidates, (c) => c.score.emotionalFit + c.score.luxuryAlignment + c.score.performanceAlignment), "Best Emotional Choice"],
    ["safest-ownership", pick(candidates, (c) => c.score.reliability + c.score.maintenanceRisk + c.score.practicality), "Safest Ownership Choice"],
    ["highest-upside", pick(candidates, (c) => c.vehicle.rarityScore + c.score.marketStrength), "Highest Upside Candidate"],
    ["wildcard", pick(candidates, (c) => c.score.emotionalFit - c.score.budgetFit * 0.2), "Wildcard Recommendation"],
    ["avoid-caution", [...candidates].sort((a, b) => (riskByVehicle.get(b.vehicle.id)?.riskScore ?? 0) - (riskByVehicle.get(a.vehicle.id)?.riskScore ?? 0))[0] ?? null, "Avoid / Caution Candidate"],
  ];

  return mapped.filter((entry): entry is [VehicleRecommendation["type"], VehicleCandidate, string] => Boolean(entry[1])).map(([type, candidate, title]) => {
    const risk = riskByVehicle.get(candidate.vehicle.id);
    return { type, vehicleId: candidate.vehicle.id, title, whySelected: `${candidate.vehicle.make} ${candidate.vehicle.model} scored ${candidate.score.weightedTotal.toFixed(1)} with strong signals in ${candidate.fitTags.slice(0, 2).join(" and ") || "profile alignment"}.`, tradeoffs: candidate.tradeoffs.length > 0 ? candidate.tradeoffs : ["No material cautions surfaced in mock scoring."], buyerTypeFit: `Fits buyers prioritizing ${candidate.vehicle.emotionalTags.slice(0, 2).join(" and ")}.`, riskToWatch: risk ? `${risk.riskLevel} risk (${risk.riskScore}/100): ${risk.negativeSignals[0] ?? "watch resale timing"}.` : "Monitor market timing." };
  });
}
