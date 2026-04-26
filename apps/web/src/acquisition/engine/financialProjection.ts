import { AcquisitionProfile, FinancialProjection, ProjectionScenario, VehicleRecord } from "@/acquisition/types/contracts";
import { calculateDepreciation } from "@/acquisition/engine/calculateDepreciation";
import { calculateOwnershipCost } from "@/acquisition/engine/ownershipCost";

const TAX_RATE = 0.07;
function buildScenario(vehicle: VehicleRecord, profile: AcquisitionProfile, scenarioFactor: number): ProjectionScenario {
  const purchasePriceEstimate = vehicle.currentMarketAverage * scenarioFactor;
  const salesTaxEstimate = purchasePriceEstimate * TAX_RATE;
  const annualInsurance = vehicle.annualInsuranceEstimate * (profile.ownership.insuranceSensitivity === "high" ? 1.05 : 1);
  const annualMaintenance = vehicle.annualMaintenanceEstimate * (profile.ownership.maintenanceTolerance === "low" ? 1.08 : 1);
  const annualWearReserve = vehicle.tireCostEstimate / 2 + vehicle.brakeCostEstimate / 3;
  const dep1 = calculateDepreciation({ vehicle, annualMileage: profile.ownership.annualMileage, durationYears: 1, scenarioFactor });
  const dep3 = calculateDepreciation({ vehicle, annualMileage: profile.ownership.annualMileage, durationYears: 3, scenarioFactor });
  const dep5 = calculateDepreciation({ vehicle, annualMileage: profile.ownership.annualMileage, durationYears: 5, scenarioFactor });
  const resaleEstimate1Year = purchasePriceEstimate * (1 - dep1);
  const resaleEstimate3Year = purchasePriceEstimate * (1 - dep3);
  const resaleEstimate5Year = purchasePriceEstimate * (1 - dep5);
  const years = profile.ownership.expectedDurationYears;
  const depreciationLoss = purchasePriceEstimate - (years <= 1 ? resaleEstimate1Year : years <= 3 ? resaleEstimate3Year : resaleEstimate5Year);
  const totalOwnershipCost = salesTaxEstimate + depreciationLoss + years * (annualInsurance + annualMaintenance + annualWearReserve);
  const costPerYear = totalOwnershipCost / years;
  const costPerMonth = costPerYear / 12;
  return { purchasePriceEstimate, salesTaxEstimate, annualInsurance, annualMaintenance, annualWearReserve, resaleEstimate1Year, resaleEstimate3Year, resaleEstimate5Year, totalOwnershipCost, depreciationLoss, costPerYear, costPerMonth };
}

export function projectFinancials(profile: AcquisitionProfile, vehicle: VehicleRecord): FinancialProjection {
  const conservative = buildScenario(vehicle, profile, 1.06);
  const expected = buildScenario(vehicle, profile, 1);
  const optimistic = buildScenario(vehicle, profile, 0.95);
  const ownershipCost = calculateOwnershipCost(vehicle);
  return { vehicleId: vehicle.id, conservative, expected, optimistic, ownershipCost, depreciation: { vehicleId: vehicle.id, conservative, expected, optimistic }, assumptions: ["Projection estimates only. Not financial advice.", "Mock intelligence baseline; market prices can move quickly.", "Tax estimate uses placeholder 7% rate."] };
}
