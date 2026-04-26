import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { defaultAcquisitionProfile } from "@/acquisition/mock/defaultProfile";
import { calculateDepreciation } from "@/acquisition/engine/calculateDepreciation";
import { projectFinancials } from "@/acquisition/engine/financialProjection";
import { assessMarketRisk } from "@/acquisition/engine/marketRisk";
import { rankRecommendations } from "@/acquisition/engine/recommendationRanker";
import { scoreVehicle } from "@/acquisition/engine/scoreVehicles";
import { matchVehicles } from "@/acquisition/engine/vehicleMatcher";
import { acquisitionProfileSchema } from "@/acquisition/schemas/acquisitionSchemas";
import { vehicleDataset } from "@/acquisition/vehicle-data/vehicleDataset";

describe("acquisition engine", () => {
  it("scores and matches vehicles", () => {
    const matched = matchVehicles(defaultAcquisitionProfile, vehicleDataset);
    assert.ok(matched.length > 0);
    assert.ok(matched[0].score.weightedTotal > 0);
  });

  it("calculates depreciation bounds", () => {
    const value = calculateDepreciation({ vehicle: vehicleDataset[0], annualMileage: 10000, durationYears: 3, scenarioFactor: 1 });
    assert.ok(value >= 0 && value <= 0.75);
  });

  it("projects financials with scenarios", () => {
    const projection = projectFinancials(defaultAcquisitionProfile, vehicleDataset[0]);
    assert.ok(projection.expected.totalOwnershipCost > 0);
    assert.ok(projection.conservative.purchasePriceEstimate > projection.optimistic.purchasePriceEstimate);
  });

  it("computes market risk", () => {
    const risk = assessMarketRisk(defaultAcquisitionProfile, vehicleDataset[0]);
    assert.ok(risk.riskScore >= 0 && risk.riskScore <= 100);
  });

  it("ranks recommendation categories", () => {
    const candidates = matchVehicles(defaultAcquisitionProfile, vehicleDataset).slice(0, 5);
    const risks = candidates.map((candidate) => assessMarketRisk(defaultAcquisitionProfile, candidate.vehicle));
    const recommendations = rankRecommendations(candidates, risks);
    assert.ok(recommendations.length > 2);
  });

  it("validates profile errors", () => {
    const parsed = acquisitionProfileSchema.safeParse({ ...defaultAcquisitionProfile, budget: { ...defaultAcquisitionProfile.budget, minimum: 200000, comfortable: 100000, maximum: 90000 } });
    assert.equal(parsed.success, false);
  });

  it("handles empty candidate set", () => {
    const candidates = matchVehicles(defaultAcquisitionProfile, []);
    assert.deepEqual(candidates, []);
  });

  it("adapts scoring for daily profile", () => {
    const dailyProfile = { ...defaultAcquisitionProfile, useCases: ["daily"] as const };
    const score = scoreVehicle(dailyProfile, vehicleDataset[0]);
    assert.ok(score.appliedWeights.practicality > 3);
  });
});
