export type AcquisitionAiStub = {
  status: "not-configured";
  note: string;
};

export function getAcquisitionAiStatus(): AcquisitionAiStub {
  return {
    status: "not-configured",
    note: "AI commentary pipeline will be enabled in Phase 2.",
  };
}
