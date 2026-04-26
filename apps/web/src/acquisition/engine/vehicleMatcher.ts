import { AcquisitionProfile, VehicleCandidate, VehicleRecord } from "@/acquisition/types/contracts";
import { scoreVehicle } from "@/acquisition/engine/scoreVehicles";
import { filterVehiclesForProfile } from "@/acquisition/vehicle-data/vehicleFilters";

export function matchVehicles(profile: AcquisitionProfile, vehicles: VehicleRecord[]): VehicleCandidate[] {
  const filtered = filterVehiclesForProfile(profile, vehicles);
  return filtered.map((vehicle) => {
      const score = scoreVehicle(profile, vehicle);
      const fitTags: string[] = [];
      if (score.budgetFit >= 75) fitTags.push("Budget aligned");
      if (score.reliability >= 80) fitTags.push("Reliability confidence");
      if (score.emotionalFit >= 75) fitTags.push("Emotional alignment");
      if (profile.preferences.brandsWanted.some((brand) => brand.toLowerCase() === vehicle.make.toLowerCase())) fitTags.push("Preferred brand");
      const tradeoffs = [...(score.maintenanceRisk < 55 ? ["Higher maintenance volatility"] : []), ...(score.depreciationRisk < 55 ? ["Depreciation sensitivity to monitor"] : [])];
      return { vehicle, score, fitTags, tradeoffs };
    })
    .sort((a, b) => b.score.weightedTotal - a.score.weightedTotal);
}
