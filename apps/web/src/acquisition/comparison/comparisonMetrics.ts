import { FinancialProjection, MarketRiskProfile, VehicleCandidate } from "@/acquisition/types/contracts";

export interface ComparisonMetricRow {
  vehicleId: string;
  price: number;
  depreciationRisk: number;
  ownershipCost: number;
  reliability: number;
  maintenanceRisk: number;
  performance: number;
  luxury: number;
  rarity: number;
  dailyUsability: number;
  emotionalMatch: number;
  marketLiquidity: number;
  futureOutlook: number;
}

export function buildComparisonMetrics(candidates: VehicleCandidate[], projections: FinancialProjection[], risks: MarketRiskProfile[]): ComparisonMetricRow[] {
  return candidates.map((candidate) => {
    const projection = projections.find((p) => p.vehicleId === candidate.vehicle.id);
    const risk = risks.find((r) => r.vehicleId === candidate.vehicle.id);
    const marketLiquidity = 100 - (risk?.riskScore ?? 50);
    return {
      vehicleId: candidate.vehicle.id,
      price: candidate.vehicle.currentMarketAverage,
      depreciationRisk: candidate.score.depreciationRisk,
      ownershipCost: projection?.expected.totalOwnershipCost ?? 0,
      reliability: candidate.score.reliability,
      maintenanceRisk: candidate.score.maintenanceRisk,
      performance: candidate.score.performanceAlignment,
      luxury: candidate.score.luxuryAlignment,
      rarity: candidate.vehicle.rarityScore,
      dailyUsability: candidate.score.practicality,
      emotionalMatch: candidate.score.emotionalFit,
      marketLiquidity,
      futureOutlook: Math.max(0, Math.min(100, (candidate.score.marketStrength + marketLiquidity) / 2)),
    };
  });
}
