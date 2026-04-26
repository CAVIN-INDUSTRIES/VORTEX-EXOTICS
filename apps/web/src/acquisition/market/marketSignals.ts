import { VehicleRecord } from "@/acquisition/types/contracts";

export interface MarketSignals { collectorUpside: boolean; oversupplyRisk: boolean; redesignRisk: boolean; liquidityScore: number; }

export function computeMarketSignals(vehicle: VehicleRecord): MarketSignals {
  return {
    collectorUpside: vehicle.rarityScore > 85 || vehicle.depreciation5Year < 0.16,
    oversupplyRisk: vehicle.rarityScore < 68,
    redesignRisk: vehicle.year < new Date().getFullYear() - 4,
    liquidityScore: Math.max(20, Math.min(95, 100 - vehicle.mileageSensitivity * 40 + vehicle.reliabilityScore * 0.2)),
  };
}
