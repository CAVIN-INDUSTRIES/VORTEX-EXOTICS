import { ComparisonMetricRow } from "@/acquisition/comparison/comparisonMetrics";

export function toComparisonMatrix(rows: ComparisonMetricRow[]): Record<string, Record<string, number>> {
  return rows.reduce<Record<string, Record<string, number>>>((acc, row) => {
    acc[row.vehicleId] = {
      price: row.price,
      depreciation: row.depreciationRisk,
      ownershipCost: row.ownershipCost,
      reliability: row.reliability,
      maintenanceRisk: row.maintenanceRisk,
      performance: row.performance,
      luxury: row.luxury,
      rarity: row.rarity,
      dailyUsability: row.dailyUsability,
      emotionalMatch: row.emotionalMatch,
      marketLiquidity: row.marketLiquidity,
      futureOutlook: row.futureOutlook,
    };
    return acc;
  }, {});
}
