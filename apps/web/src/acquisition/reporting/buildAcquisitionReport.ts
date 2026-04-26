import { generateAdvisorNarrative } from "@/acquisition/ai/advisorNarrative";
import { AcquisitionProfile, AcquisitionReport, ComparisonResult, FinancialProjection, MarketRiskProfile, VehicleRecommendation } from "@/acquisition/types/contracts";

export function buildAcquisitionReport(input: {
  profile: AcquisitionProfile;
  recommendations: VehicleRecommendation[];
  projections: FinancialProjection[];
  comparison: ComparisonResult;
  marketRisks: MarketRiskProfile[];
}): AcquisitionReport {
  const narrative = generateAdvisorNarrative(input);

  return {
    generatedAtIso: new Date().toISOString(),
    profile: input.profile,
    recommendations: input.recommendations,
    projections: input.projections,
    comparison: input.comparison,
    marketRisks: input.marketRisks,
    narrative,
    sections: [
      { key: "cover", title: "Private Acquisition Intelligence", content: "Confidential advisor report generated from mock intelligence." },
      { key: "executive-summary", title: "Executive Summary", content: narrative.executiveSummary },
      { key: "client-profile", title: "Client Acquisition Profile", content: `Use cases: ${input.profile.useCases.join(", ")}` },
      { key: "top-recommendation", title: "Top Recommendation", content: narrative.topPickReasoning },
      { key: "ranked-options", title: "Ranked Vehicle Options", content: `${input.recommendations.length} recommendation categories generated.` },
      { key: "financial-projection", title: "Financial Projection", content: narrative.financialOutlook },
      { key: "market-outlook", title: "Market Outlook", content: narrative.marketCaution },
      { key: "depreciation-forecast", title: "Depreciation Forecast", content: "Conservative / expected / optimistic trajectories included." },
      { key: "ownership-cost-forecast", title: "Ownership Cost Forecast", content: "Annual ownership reserve and cost-per-month breakdown included." },
      { key: "compare-contrast", title: "Compare & Contrast Matrix", content: input.comparison.narratives.join(" ") },
      { key: "risk-advisory", title: "Risk Advisory", content: "Vehicle-specific risk levels are surfaced for timing and reserve planning." },
      { key: "advisor-notes", title: "Advisor Notes", content: narrative.comparisonExplanation },
      { key: "next-steps", title: "Next Steps", content: narrative.nextStepCta },
      { key: "disclaimers", title: "Disclaimers", content: "Informational projections only. Not legal, tax, or investment advice." },
    ],
    disclaimer: "This report is generated from mock intelligence estimates and should be validated with live market and underwriting data.",
  };
}
