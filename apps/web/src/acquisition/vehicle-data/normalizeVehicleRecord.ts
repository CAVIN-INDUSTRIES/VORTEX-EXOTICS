import { VehicleRecord } from "@/acquisition/types/contracts";

export function normalizeVehicleRecord(vehicle: VehicleRecord): VehicleRecord {
  return {
    ...vehicle,
    make: vehicle.make.trim(),
    model: vehicle.model.trim(),
    trim: vehicle.trim.trim(),
    emotionalTags: vehicle.emotionalTags.map((tag) => tag.toLowerCase().trim()),
    marketNotes: vehicle.marketNotes.map((note) => note.trim()),
    sourceNotes: vehicle.sourceNotes.map((note) => note.trim()),
  };
}
