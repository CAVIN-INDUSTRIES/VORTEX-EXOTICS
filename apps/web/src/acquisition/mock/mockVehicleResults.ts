import type { AcquisitionProfile, VehicleRecommendationReport } from "@/acquisition/types/contracts";

function profileSnapshot(profile: AcquisitionProfile) {
  return {
    budget: profile.budget,
    preferredBrands: profile.preferredBrands,
    ownershipIntent: profile.ownershipIntent,
    lifestyle: profile.lifestyle,
    riskTolerance: profile.riskTolerance,
    ownershipDuration: profile.ownershipDuration,
    desiredEmotion: profile.desiredEmotion,
  };
}

export function buildMockVehicleReport(profile: AcquisitionProfile): VehicleRecommendationReport {
  const budgetBand = profile.budget >= 500_000 ? "ultra-premium" : profile.budget >= 250_000 ? "premium" : "entry-luxury";
  const primaryBrand = profile.preferredBrands[0] ?? "Porsche";

  return {
    summary: {
      profileSnapshot: profileSnapshot(profile),
      acquisitionGoal:
        profile.ownershipIntent === "investment_hold"
          ? "Protect downside while preserving collector upside."
          : "Balance emotional ownership with practical operating confidence.",
      budgetBand,
      confidenceScore: Math.min(94, 72 + Math.round(profile.riskTolerance * 22)),
      generatedAt: new Date().toISOString(),
    },
    recommendations: [
      {
        id: "top-pick",
        label: "Top Pick",
        vehicle: `${primaryBrand} 911 GT3 Touring`,
        fitScore: 91,
        rationale: "Strong demand resilience, controlled depreciation profile, and high emotional ownership yield.",
      },
      {
        id: "runner-up",
        label: "Runner-Up",
        vehicle: "Ferrari 812 GTS",
        fitScore: 88,
        rationale: "High emotional signature with premium liquidity for selective exits.",
      },
      {
        id: "safe-choice",
        label: "Safe Choice",
        vehicle: "Bentley Continental GT Speed",
        fitScore: 84,
        rationale: "Lower volatility ownership posture and superior long-distance comfort.",
      },
    ],
    rankings: [
      { vehicle: `${primaryBrand} 911 GT3 Touring`, score: 91 },
      { vehicle: "Ferrari 812 GTS", score: 88 },
      { vehicle: "Bentley Continental GT Speed", score: 84 },
    ],
    financialProjection: {
      purchaseBudget: profile.budget,
      estimatedThreeYearDepreciationPct: Math.max(12, 26 - Math.round(profile.riskTolerance * 8)),
      estimatedAnnualOwnershipCost: Math.round(profile.budget * 0.082),
      financingOutlook:
        profile.financingPreference === "cash"
          ? "Cash profile reduces financing drag and increases negotiation leverage."
          : "Structure financing to preserve liquidity and cap downside risk.",
    },
    comparisonGrid: {
      columns: ["Vehicle", "Liquidity", "Depreciation Risk", "Emotional Match", "Operating Cost"],
      rows: [
        ["911 GT3 Touring", "High", "Low-Moderate", "High", "Moderate"],
        ["812 GTS", "Moderate", "Moderate", "Very High", "High"],
        ["Continental GT", "Moderate", "Low", "Moderate", "Moderate"],
      ],
    },
  };
}
