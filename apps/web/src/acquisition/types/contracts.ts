import type { ComponentType } from "react";

export type AcquisitionProfile = {
  budget: number;
  preferredBrands: string[];
  ownershipIntent: string;
  lifestyle: string[];
  riskTolerance: number;
  ownershipDuration: number;
  desiredEmotion: string[];
  compareVehicles: string[];
};

export type AcquisitionFlowState = {
  started: boolean;
  activeStepId: string;
  completedStepIds: string[];
  profile: AcquisitionProfile;
  updatedAt: string;
};

export type QuestionInputType = "select" | "slider" | "multi";

export type QuestionDefinition = {
  id: string;
  type: QuestionInputType;
  label: string;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  profileKey: keyof AcquisitionProfile;
};

export type AcquisitionStepComponentProps = {
  profile: AcquisitionProfile;
  onProfilePatch: (patch: Partial<AcquisitionProfile>) => void;
};

export type AcquisitionWizardStep = {
  id: string;
  title: string;
  subtitle: string;
  component: ComponentType<AcquisitionStepComponentProps>;
};

export type ReportFinancialProjection = {
  estimatedPurchasePrice: number;
  estimatedThreeYearDepreciationPct: number;
  estimatedOwnershipCostAnnual: number;
  projectedThreeYearValue: number;
};

export type ReportComparisonGrid = {
  metrics: string[];
  vehicles: Array<{
    vehicle: string;
    scores: number[];
  }>;
};

export type VehicleRecommendationReport = {
  summary: {
    clientIntent: string;
    profileHighlights: string[];
    generatedAt: string;
    confidenceScore: number;
  };
  recommendations: Array<{
    rank: number;
    vehicle: string;
    score: number;
    rationale: string;
    highlights: string[];
  }>;
  rankings: Array<{
    vehicle: string;
    overall: number;
    marketOutlook: number;
    ownershipFit: number;
    emotionalMatch: number;
  }>;
  financialProjection: ReportFinancialProjection;
  comparisonGrid: ReportComparisonGrid;
};
