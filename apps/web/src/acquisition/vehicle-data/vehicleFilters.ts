import { AcquisitionProfile, VehicleRecord } from "@/acquisition/types/contracts";

export function filterVehiclesForProfile(profile: AcquisitionProfile, records: VehicleRecord[]): VehicleRecord[] {
  return records.filter((vehicle) => {
    const notAvoidedBrand = !profile.preferences.brandsAvoided.some((brand) => brand.toLowerCase() === vehicle.make.toLowerCase());
    const yearInRange = vehicle.year >= profile.preferences.modelYears.minimum && vehicle.year <= profile.preferences.modelYears.maximum;
    const bodyStyleMatch = profile.preferences.bodyStyle.includes(vehicle.bodyStyle);
    const drivetrainMatch = profile.preferences.drivetrain.includes(vehicle.drivetrain);
    const transmissionMatch = profile.preferences.transmission.includes(vehicle.transmission);
    const budgetReachable = vehicle.currentMarketLow <= profile.budget.maximum * 1.2;
    return notAvoidedBrand && yearInRange && bodyStyleMatch && drivetrainMatch && transmissionMatch && budgetReachable;
  });
}
