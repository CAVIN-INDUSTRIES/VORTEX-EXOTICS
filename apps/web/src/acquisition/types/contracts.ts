import type { ComponentType } from "react";

export type AcquisitionFlowStepId = "ownership" | "budget" | "preferences" | "lifestyle" | "finalize";

export type OwnershipDurationOption =
  | "under-1-year"
  | "1-2-years"
  | "3-5-years"
  | "5-10-years"
  | "long-term-collector";

export type DrivingFrequencyOption = "daily" | "weekly" | "monthly" | "rarely";
export type FinancingPreferenceOption = "cash" | "financing" | "lease" | "open";

export type AcquisitionProfile = {
  budget: number;
  preferredBrands: string[];
  ownershipIntent: string;
  ownershipDuration: OwnershipDurationOption;
  drivingFrequency: DrivingFrequencyOption;
  lifestyle: string[];
  riskTolerance: number;
  monthlyOwnershipComfort: number;
  financingPreference: FinancingPreferenceOption;
  desiredEmotion: string[];
  compareVehicles: string[];
  avoidedBrands: string[];
  mustHaveFeatures: string[];
};

export function defaultAcquisitionProfile(): AcquisitionProfile {
  return {
    budget: 350_000,
    preferredBrands: [],
    ownershipIntent: "Weekend exotic",
    ownershipDuration: "3-5-years",
    drivingFrequency: "weekly",
    lifestyle: [],
    riskTolerance: 5,
    monthlyOwnershipComfort: 5200,
    financingPreference: "open",
    desiredEmotion: [],
    compareVehicles: [],
    avoidedBrands: [],
    mustHaveFeatures: [],
  };
}

export type QuestionInputType = "select" | "slider" | "multi" | "number";

export type QuestionDefinition = {
  id: string;
  type: QuestionInputType;
  label: string;
  helperText?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  required?: boolean;
  profileKey?: keyof AcquisitionProfile;
};

export type AcquisitionStepComponentProps = {
  profile: AcquisitionProfile;
  questions: QuestionDefinition[];
  onProfilePatch: (patch: Partial<AcquisitionProfile>) => void;
};

export type AcquisitionStepDefinition = {
  id: AcquisitionFlowStepId;
  title: string;
  description: string;
  questions: QuestionDefinition[];
  component: ComponentType<AcquisitionStepComponentProps>;
};

export type AcquisitionWizardStep = AcquisitionStepDefinition;

export type VehicleRecommendation = {
  vehicleId: string;
  vehicle: string;
  score: number;
};

export type VehicleRecommendationItem = VehicleRecommendation;

export type RecommendationRow = {
  vehicleId: string;
  score: number;
};

export type VehicleRecommendationReport = {
  summary: {
    headline: string;
    narrative: string;
    budgetPosition: string;
    riskProfile: string;
    ownershipHorizonMonths: number;
    generatedAt: string;
  };
  recommendations: Array<{
    id: string;
    rankLabel: string;
    year: number;
    make: string;
    model: string;
    score: number;
    rationale: string;
    highlights: string[];
    estimatedPriceUsd: number;
  }>;
  rankings: Array<{
    vehicle: string;
    overall: number;
    marketOutlook: number;
    ownershipFit: number;
    emotionalMatch: number;
  }>;
  financialProjection: {
    totalOwnershipCostUsd: number;
    projectedResaleValueUsd: number;
    monthlyOwnershipEstimateUsd: number;
  };
  comparisonGrid: {
    rows: Array<{
      vehicleId: string;
      label: string;
      marketMomentum: string;
      costPredictability: string;
      emotionalMatch: string;
    }>;
  };
  advisorNotes: string[];
};
