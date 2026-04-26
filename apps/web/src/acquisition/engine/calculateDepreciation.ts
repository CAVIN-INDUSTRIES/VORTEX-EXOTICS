import { VehicleRecord } from "@/acquisition/types/contracts";

export interface DepreciationInput { vehicle: VehicleRecord; annualMileage: number; durationYears: number; scenarioFactor: number; }

export function calculateDepreciation({ vehicle, annualMileage, durationYears, scenarioFactor }: DepreciationInput): number {
  const mileageModifier = Math.max(0.92, 1 + ((annualMileage - 12000) / 100000) * vehicle.mileageSensitivity);
  const baselineRate = durationYears <= 1 ? vehicle.depreciation1Year : durationYears <= 3 ? vehicle.depreciation3Year / 3 : vehicle.depreciation5Year / 5;
  const compounded = 1 - Math.pow(1 - baselineRate * mileageModifier * scenarioFactor, durationYears);
  return Math.max(0, Math.min(0.75, compounded));
}
