import { OwnershipCostProjection, VehicleRecord } from "@/acquisition/types/contracts";

export function calculateOwnershipCost(vehicle: VehicleRecord): OwnershipCostProjection {
  const annualWearReserve = vehicle.tireCostEstimate / 2 + vehicle.brakeCostEstimate / 3;
  const annualTotal = vehicle.annualInsuranceEstimate + vehicle.annualMaintenanceEstimate + annualWearReserve;
  return { vehicleId: vehicle.id, annualInsurance: vehicle.annualInsuranceEstimate, annualMaintenance: vehicle.annualMaintenanceEstimate, annualWearReserve, annualTotal };
}
