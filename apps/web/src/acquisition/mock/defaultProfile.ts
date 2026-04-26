import { AcquisitionProfile } from "@/acquisition/types/contracts";

export const defaultAcquisitionProfile: AcquisitionProfile = {
  clientName: "Private Client",
  email: "client@example.com",
  phone: "5551234567",
  location: "Miami",
  timeframe: "60-days",
  budget: { minimum: 60000, comfortable: 85000, maximum: 120000, plan: "open", monthlyComfort: 1800, downPayment: 15000 },
  preferences: {
    brandsWanted: ["Lexus", "Porsche"],
    brandsAvoided: [],
    bodyStyle: ["coupe", "sedan"],
    seating: 4,
    drivetrain: ["rwd", "awd"],
    transmission: ["automatic", "dual-clutch"],
    modelYears: { minimum: 2018, maximum: 2024 },
    mileageTolerance: "medium",
  },
  useCases: ["weekend"],
  ownership: {
    expectedDurationYears: 3,
    annualMileage: 8000,
    maintenanceTolerance: "medium",
    depreciationSensitivity: "high",
    reliabilityImportance: "high",
    insuranceSensitivity: "medium",
    riskTolerance: "balanced",
  },
  emotionalIntent: ["elegant", "understated"],
  comparisonWishlist: { likedVehicles: ["lexus-lc500-2021"], compareVehicles: ["lexus-lc500-2021", "porsche-911-carrera-s-2022"], openToAlternatives: true },
  consent: { allowAdvisorFollowUp: true, acknowledgesInformationalEstimates: true },
};
