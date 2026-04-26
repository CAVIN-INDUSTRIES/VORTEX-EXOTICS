export type RiskTolerance = "low" | "balanced" | "high";
export type OwnershipPurpose = "daily" | "weekend" | "collector" | "business-image" | "track" | "lifestyle";
export type BodyStyle =
  | "coupe"
  | "convertible"
  | "sedan"
  | "wagon"
  | "suv"
  | "hatchback"
  | "roadster";
export type BudgetPlan = "cash" | "finance" | "lease" | "open";
export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export interface AcquisitionProfile {
  clientName: string;
  email: string;
  phone?: string;
  location: string;
  timeframe: "immediate" | "30-days" | "60-days" | "90-days" | "exploring";
  budget: {
    minimum: number;
    comfortable: number;
    maximum: number;
    plan: BudgetPlan;
    monthlyComfort?: number;
    downPayment?: number;
  };
  preferences: {
    brandsWanted: string[];
    brandsAvoided: string[];
    bodyStyle: BodyStyle[];
    seating: 2 | 4 | 5;
    drivetrain: Array<"rwd" | "awd" | "fwd">;
    transmission: Array<"automatic" | "manual" | "dual-clutch">;
    modelYears: {
      minimum: number;
      maximum: number;
    };
    mileageTolerance: "low" | "medium" | "high";
  };
  useCases: OwnershipPurpose[];
  ownership: {
    expectedDurationYears: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    annualMileage: number;
    maintenanceTolerance: "low" | "medium" | "high";
    depreciationSensitivity: "low" | "medium" | "high";
    reliabilityImportance: "low" | "medium" | "high";
    insuranceSensitivity: "low" | "medium" | "high";
    riskTolerance: RiskTolerance;
  };
  emotionalIntent: Array<
    "understated" | "exotic" | "aggressive" | "elegant" | "rare" | "comfortable" | "high-tech" | "analog-raw"
  >;
  comparisonWishlist: {
    likedVehicles: string[];
    compareVehicles: string[];
    openToAlternatives: boolean;
  };
  consent: {
    allowAdvisorFollowUp: boolean;
    acknowledgesInformationalEstimates: boolean;
  };
}

export interface VehicleRecord {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  generation: string;
  bodyStyle: BodyStyle;
  drivetrain: "rwd" | "awd" | "fwd";
  transmission: "automatic" | "manual" | "dual-clutch";
  engine: string;
  horsepower: number;
  torque: number;
  curbWeight: number;
  msrpOriginal: number;
  currentMarketLow: number;
  currentMarketHigh: number;
  currentMarketAverage: number;
  mileageSensitivity: number;
  depreciation1Year: number;
  depreciation3Year: number;
  depreciation5Year: number;
  annualMaintenanceEstimate: number;
  annualInsuranceEstimate: number;
  tireCostEstimate: number;
  brakeCostEstimate: number;
  reliabilityScore: number;
  luxuryScore: number;
  performanceScore: number;
  rarityScore: number;
  dailyUsabilityScore: number;
  emotionalTags: string[];
  ownershipUseCases: OwnershipPurpose[];
  knownRisks: string[];
  marketNotes: string[];
  imageUrls: string[];
  sourceNotes: string[];
}

export interface VehicleScoreBreakdown {
  budgetFit: number;
  ownershipFit: number;
  emotionalFit: number;
  marketStrength: number;
  depreciationRisk: number;
  reliability: number;
  luxuryAlignment: number;
  performanceAlignment: number;
  practicality: number;
  maintenanceRisk: number;
  weightedTotal: number;
  appliedWeights: {
    budgetFit: number;
    ownershipFit: number;
    emotionalFit: number;
    marketStrength: number;
    depreciationRisk: number;
    reliability: number;
    luxuryAlignment: number;
    performanceAlignment: number;
    practicality: number;
    maintenanceRisk: number;
  };
}

export interface VehicleCandidate {
  vehicle: VehicleRecord;
  score: VehicleScoreBreakdown;
  fitTags: string[];
  tradeoffs: string[];
}

export interface VehicleRecommendation {
  type:
    | "best-overall"
    | "best-financial"
    | "best-emotional"
    | "safest-ownership"
    | "highest-upside"
    | "wildcard"
    | "avoid-caution";
  vehicleId: string;
  title: string;
  whySelected: string;
  tradeoffs: string[];
  buyerTypeFit: string;
  riskToWatch: string;
}

export interface ProjectionScenario {
  purchasePriceEstimate: number;
  salesTaxEstimate: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualWearReserve: number;
  resaleEstimate1Year: number;
  resaleEstimate3Year: number;
  resaleEstimate5Year: number;
  totalOwnershipCost: number;
  depreciationLoss: number;
  costPerYear: number;
  costPerMonth: number;
}

export interface DepreciationProjection {
  vehicleId: string;
  conservative: ProjectionScenario;
  expected: ProjectionScenario;
  optimistic: ProjectionScenario;
}

export interface OwnershipCostProjection {
  vehicleId: string;
  annualInsurance: number;
  annualMaintenance: number;
  annualWearReserve: number;
  annualTotal: number;
}

export interface FinancialProjection {
  vehicleId: string;
  conservative: ProjectionScenario;
  expected: ProjectionScenario;
  optimistic: ProjectionScenario;
  ownershipCost: OwnershipCostProjection;
  depreciation: DepreciationProjection;
  assumptions: string[];
}

export interface MarketRiskProfile {
  vehicleId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  positiveSignals: string[];
  negativeSignals: string[];
  advisorNotes: string[];
}

export interface ComparisonResult {
  comparedVehicleIds: string[];
  metrics: Record<string, Record<string, number | string>>;
  winnerByMetric: Record<string, string>;
  narratives: string[];
}

export interface ReportSection {
  key:
    | "cover"
    | "executive-summary"
    | "client-profile"
    | "top-recommendation"
    | "ranked-options"
    | "financial-projection"
    | "market-outlook"
    | "depreciation-forecast"
    | "ownership-cost-forecast"
    | "compare-contrast"
    | "risk-advisory"
    | "advisor-notes"
    | "next-steps"
    | "disclaimers";
  title: string;
  content: string;
}

export interface AdvisorNarrative {
  executiveSummary: string;
  topPickReasoning: string;
  financialOutlook: string;
  marketCaution: string;
  comparisonExplanation: string;
  nextStepCta: string;
}

export interface AcquisitionReport {
  generatedAtIso: string;
  profile: AcquisitionProfile;
  recommendations: VehicleRecommendation[];
  projections: FinancialProjection[];
  comparison: ComparisonResult;
  marketRisks: MarketRiskProfile[];
  narrative: AdvisorNarrative;
  sections: ReportSection[];
  disclaimer: string;
}

export interface LeadSubmissionPayload {
  contact: Pick<AcquisitionProfile, "clientName" | "email" | "phone" | "location">;
  acquisitionProfile: AcquisitionProfile;
  recommendationSummary: string;
  selectedVehicles: string[];
  reportSummary: string;
  timestampIso: string;
  sourceRoute: string;
  consentFlags: AcquisitionProfile["consent"];
}
