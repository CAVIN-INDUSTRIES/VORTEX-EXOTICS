"use client";

import { resolveConfiguratorMaxDpr } from "@vex/3d-configurator";
import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number };

export function useAdaptiveEffects() {
  const reducedMotion = usePrefersReducedMotion();

  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return { allowHeavyFx: !reducedMotion, maxDpr: resolveConfiguratorMaxDpr({ reducedMotion }) };
    }

    const nav = navigator as NavigatorWithDeviceMemory;
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const constrained = memory <= 4 || cores <= 4 || reducedMotion;

    return {
      allowHeavyFx: !constrained,
      maxDpr: resolveConfiguratorMaxDpr({
        reducedMotion,
        deviceMemory: memory,
        hardwareConcurrency: cores,
      }),
    };
  }, [reducedMotion]);
}
