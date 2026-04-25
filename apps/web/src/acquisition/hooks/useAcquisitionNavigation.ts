"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acquisitionSteps } from "@/acquisition/flow/WizardConfig";
import type { AcquisitionFlowStepId } from "@/acquisition/types/contracts";

function isFlowStepId(value: string | null): value is AcquisitionFlowStepId {
  if (!value) return false;
  return acquisitionSteps.some((step) => step.id === value);
}

export function useAcquisitionNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStepId = useMemo<AcquisitionFlowStepId>(() => {
    const fromQuery = searchParams.get("step");
    return isFlowStepId(fromQuery) ? fromQuery : acquisitionSteps[0].id;
  }, [searchParams]);

  const activeIndex = useMemo(
    () => acquisitionSteps.findIndex((step) => step.id === activeStepId),
    [activeStepId]
  );

  const setStep = useCallback(
    (step: AcquisitionFlowStepId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step);
      router.replace(`/private-acquisition?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const nextStep = useCallback(() => {
    const next = acquisitionSteps[Math.min(activeIndex + 1, acquisitionSteps.length - 1)];
    setStep(next.id);
  }, [activeIndex, setStep]);

  const previousStep = useCallback(() => {
    const prev = acquisitionSteps[Math.max(activeIndex - 1, 0)];
    setStep(prev.id);
  }, [activeIndex, setStep]);

  return {
    activeStepId,
    activeIndex,
    total: acquisitionSteps.length,
    setStep,
    nextStep,
    previousStep,
  };
}
