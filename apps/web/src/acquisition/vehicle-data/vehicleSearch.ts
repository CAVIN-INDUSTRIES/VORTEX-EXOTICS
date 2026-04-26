import { VehicleRecord } from "@/acquisition/types/contracts";

export function searchVehicleDataset(records: VehicleRecord[], query: string): VehicleRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return records;
  }

  return records.filter((vehicle) => {
    const haystack = `${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.generation} ${vehicle.emotionalTags.join(" ")}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
