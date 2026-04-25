import type { AcquisitionProfile, VehicleRecommendationReport } from "@/acquisition/types/contracts";

function buildSummary(profile: AcquisitionProfile): VehicleRecommendationReport["summary"] {
  const budgetPosition =
    profile.budget >= 900_000
      ? "Ultra-premium allocation range"
      : profile.budget >= 450_000
        ? "Core premium collector range"
        : "Strategic luxury entry range";

  const riskProfile =
    profile.riskTolerance >= 8 ? "High-performance risk accepted" : profile.riskTolerance >= 5 ? "Balanced risk posture" : "Capital-preservation first";

  const ownershipHorizonMonths =
    profile.ownershipDuration === "under-1-year"
      ? 10
      : profile.ownershipDuration === "1-2-years"
        ? 18
        : profile.ownershipDuration === "3-5-years"
          ? 48
          : profile.ownershipDuration === "5-10-years"
            ? 84
            : 120;

  return {
    headline: "Private acquisition intelligence snapshot",
    narrative:
      "This preview balances ownership emotion, downside protection, and liquidity posture using mock market signals while live scoring APIs are staged.",
    budgetPosition,
    riskProfile,
    ownershipHorizonMonths,
    generatedAt: new Date().toISOString(),
  };
}

export function buildMockVehicleReport(profile: AcquisitionProfile): VehicleRecommendationReport {
  const primaryBrand = profile.preferredBrands[0] ?? "Porsche";
  const secondaryBrand = profile.preferredBrands[1] ?? "Ferrari";

  return {
    summary: buildSummary(profile),
    recommendations: [
      {
        id: "top-pick",
        rankLabel: "Top Pick",
        year: 2024,
        make: primaryBrand,
        model: "911 GT3 Touring",
        score: 91.4,
        rationale: "Strong demand resilience, controlled depreciation posture, and high emotional ownership fit.",
        highlights: ["High liquidity", "Collector credibility", "Balanced operating profile"],
        estimatedPriceUsd: Math.max(260000, Math.round(profile.budget * 0.86)),
      },
      {
        id: "runner-up",
        rankLabel: "Runner-Up",
        year: 2023,
        make: secondaryBrand,
        model: "812 GTS",
        score: 88.2,
        rationale: "Premium emotional signature with selective upside and high private-market attention.",
        highlights: ["V12 emotional premium", "Strong private demand", "High status signal"],
        estimatedPriceUsd: Math.max(390000, Math.round(profile.budget * 0.98)),
      },
      {
        id: "safe-choice",
        rankLabel: "Safe Choice",
        year: 2022,
        make: "Bentley",
        model: "Continental GT Speed",
        score: 83.9,
        rationale: "Lower volatility ownership lane with predictable comfort and broad usability.",
        highlights: ["Lower variance", "Grand touring comfort", "Moderate maintenance curve"],
        estimatedPriceUsd: Math.max(210000, Math.round(profile.budget * 0.72)),
      },
    ],
    rankings: [
      { vehicle: `${primaryBrand} 911 GT3 Touring`, overall: 91.4, marketOutlook: 90, ownershipFit: 92, emotionalMatch: 89 },
      { vehicle: `${secondaryBrand} 812 GTS`, overall: 88.2, marketOutlook: 84, ownershipFit: 86, emotionalMatch: 95 },
      { vehicle: "Bentley Continental GT Speed", overall: 83.9, marketOutlook: 82, ownershipFit: 88, emotionalMatch: 78 },
    ],
    financialProjection: {
      totalOwnershipCostUsd: Math.round(profile.budget * 0.22),
      projectedResaleValueUsd: Math.round(profile.budget * 0.74),
      monthlyOwnershipEstimateUsd: Math.round(Math.max(2800, profile.monthlyOwnershipComfort)),
    },
    comparisonGrid: {
      rows: [
        {
          vehicleId: "gt3-touring",
          label: `${primaryBrand} 911 GT3 Touring`,
          marketMomentum: "High",
          costPredictability: "Moderate-High",
          emotionalMatch: "High",
        },
        {
          vehicleId: "812-gts",
          label: `${secondaryBrand} 812 GTS`,
          marketMomentum: "Moderate",
          costPredictability: "Moderate",
          emotionalMatch: "Very High",
        },
        {
          vehicleId: "continental-gt-speed",
          label: "Bentley Continental GT Speed",
          marketMomentum: "Moderate",
          costPredictability: "High",
          emotionalMatch: "Moderate",
        },
      ],
    },
    advisorNotes: [
      "Prioritize vehicles with verified media and maintenance provenance before moving into final sourcing.",
      "Treat this output as a Phase 1 concierge preview while live market integrations are staged.",
      "Phase 2 scoring will introduce real-time depreciation and volatility feeds.",
    ],
  };
}

export const mockVehicleRecommendationReport = buildMockVehicleReport({
  budget: 620_000,
  preferredBrands: ["Porsche", "Ferrari"],
  ownershipIntent: "Collector asset",
  ownershipDuration: "3-5-years",
  drivingFrequency: "weekly",
  lifestyle: ["Weekend escapes", "Networking events"],
  riskTolerance: 7,
  monthlyOwnershipComfort: 7800,
  financingPreference: "cash",
  desiredEmotion: ["Collector prestige", "Stealth wealth"],
  compareVehicles: ["Porsche 911 GT3 RS", "Ferrari 812 GTS"],
  avoidedBrands: ["Maserati"],
  mustHaveFeatures: ["Provenance docs", "Low miles"],
});
