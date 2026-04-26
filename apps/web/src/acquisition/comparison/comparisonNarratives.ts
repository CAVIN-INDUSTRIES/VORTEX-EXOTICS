import { ComparisonMetricRow } from "@/acquisition/comparison/comparisonMetrics";

export function buildComparisonNarratives(rows: ComparisonMetricRow[]): string[] {
  if (rows.length < 2) {
    return ["A minimum of two vehicles is recommended for meaningful comparison."];
  }
  const bestReliability = [...rows].sort((a, b) => b.reliability - a.reliability)[0];
  const bestEmotion = [...rows].sort((a, b) => b.emotionalMatch - a.emotionalMatch)[0];
  const bestFinancial = [...rows].sort((a, b) => a.ownershipCost - b.ownershipCost)[0];
  return [
    `${bestReliability.vehicleId} leads on reliability confidence.`,
    `${bestEmotion.vehicleId} carries the strongest emotional alignment.`,
    `${bestFinancial.vehicleId} projects the lowest total ownership cost in expected conditions.`,
  ];
}
