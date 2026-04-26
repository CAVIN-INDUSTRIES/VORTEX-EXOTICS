import { compareVehicles } from "@/acquisition/comparison/compareVehicles";
import { projectFinancials } from "@/acquisition/engine/financialProjection";
import { assessMarketRisk } from "@/acquisition/engine/marketRisk";
import { rankRecommendations } from "@/acquisition/engine/recommendationRanker";
import { matchVehicles } from "@/acquisition/engine/vehicleMatcher";
import { buildAcquisitionReport } from "@/acquisition/reporting/buildAcquisitionReport";
import { acquisitionProfileSchema } from "@/acquisition/schemas/acquisitionSchemas";
import { AcquisitionProfile } from "@/acquisition/types/contracts";
import { vehicleDataset } from "@/acquisition/vehicle-data/vehicleDataset";

export function runAcquisitionEngine(profile: AcquisitionProfile) {
  const validProfile = acquisitionProfileSchema.parse(profile) as AcquisitionProfile;
  const candidates = matchVehicles(validProfile, vehicleDataset).slice(0, 6);
  const projections = candidates.map((candidate) => projectFinancials(validProfile, candidate.vehicle));
  const risks = candidates.map((candidate) => assessMarketRisk(validProfile, candidate.vehicle));
  const recommendations = rankRecommendations(candidates, risks);
  const comparison = compareVehicles(candidates.slice(0, 4), projections, risks);
  const report = buildAcquisitionReport({ profile: validProfile, recommendations, projections, comparison, marketRisks: risks });
  return { candidates, projections, risks, recommendations, comparison, report };
}
