import { AcquisitionProfile, AdvisorNarrative, ComparisonResult, FinancialProjection, MarketRiskProfile, VehicleRecommendation } from "@/acquisition/types/contracts";

export function generateAdvisorNarrative(input: {
  profile: AcquisitionProfile;
  recommendations: VehicleRecommendation[];
  projections: FinancialProjection[];
  comparison: ComparisonResult;
  marketRisks: MarketRiskProfile[];
}): AdvisorNarrative {
  const top = input.recommendations.find((recommendation) => recommendation.type === "best-overall") ?? input.recommendations[0];
  const topProjection = top ? input.projections.find((projection) => projection.vehicleId === top.vehicleId) : undefined;
  const topRisk = top ? input.marketRisks.find((risk) => risk.vehicleId === top.vehicleId) : undefined;

  return {
    executiveSummary: `Based on your preference profile for ${input.profile.useCases.join(" / ")}, this acquisition plan balances emotional signal with ownership discipline using mock intelligence projections.`,
    topPickReasoning: top
      ? `The ${top.vehicleId.replaceAll("-", " ")} emerges as the strongest fit due to balanced scoring across budget, emotional intent, and market posture.`
      : "No top pick is available because the current candidate set is empty.",
    financialOutlook: topProjection
      ? `Expected monthly ownership estimate is approximately $${Math.round(topProjection.expected.costPerMonth).toLocaleString()}, with conservative conditions modeled above that level.`
      : "Financial outlook unavailable until at least one candidate is selected.",
    marketCaution: topRisk
      ? `Current risk posture is ${topRisk.riskLevel} (${topRisk.riskScore}/100). Monitor ${topRisk.negativeSignals[0] ?? "market liquidity"} before acquisition timing is finalized.`
      : "Market caution will be generated once risk signals are available.",
    comparisonExplanation: input.comparison.narratives[0] ?? "Comparison insight unavailable with current selection.",
    nextStepCta: "Schedule a private advisor consultation to validate this mock intelligence against live listings, service history, and final transaction structure.",
  };
}
