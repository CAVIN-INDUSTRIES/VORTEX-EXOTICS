import { buildComparisonMetrics } from "@/acquisition/comparison/comparisonMetrics";
import { toComparisonMatrix } from "@/acquisition/comparison/comparisonMatrix";
import { buildComparisonNarratives } from "@/acquisition/comparison/comparisonNarratives";
import { ComparisonResult, FinancialProjection, MarketRiskProfile, VehicleCandidate } from "@/acquisition/types/contracts";

export function compareVehicles(candidates: VehicleCandidate[], projections: FinancialProjection[], risks: MarketRiskProfile[]): ComparisonResult {
  const rows = buildComparisonMetrics(candidates, projections, risks);
  const metrics = toComparisonMatrix(rows);
  const winnerByMetric: Record<string, string> = {};

  if (rows.length > 0) {
    winnerByMetric.reliability = [...rows].sort((a, b) => b.reliability - a.reliability)[0].vehicleId;
    winnerByMetric.performance = [...rows].sort((a, b) => b.performance - a.performance)[0].vehicleId;
    winnerByMetric.ownershipCost = [...rows].sort((a, b) => a.ownershipCost - b.ownershipCost)[0].vehicleId;
    winnerByMetric.futureOutlook = [...rows].sort((a, b) => b.futureOutlook - a.futureOutlook)[0].vehicleId;
  }

  return {
    comparedVehicleIds: rows.map((row) => row.vehicleId),
    metrics,
    winnerByMetric,
    narratives: buildComparisonNarratives(rows),
  };
}
