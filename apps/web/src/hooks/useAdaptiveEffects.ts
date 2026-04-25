"use client";

import { resolveConfiguratorMaxDpr } from "@vex/3d-configurator";
import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number };

export function useAdaptiveEffects() {
  const reducedMotion = usePrefersReducedMotion();

  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return {
        allowHeavyFx: !reducedMotion,
        effectsLevel: reducedMotion ? "lite" : "full",
        maxDpr: resolveConfiguratorMaxDpr({ reducedMotion }),
      };
    }

    const nav = navigator as NavigatorWithDeviceMemory & { connection?: { saveData?: boolean } };
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const saveData = Boolean(nav.connection?.saveData);
    const constrained = memory <= 4 || cores <= 4 || saveData || reducedMotion;

    return {
      allowHeavyFx: !constrained,
      effectsLevel: constrained ? "lite" : "full",
      maxDpr: resolveConfiguratorMaxDpr({
        reducedMotion,
        deviceMemory: memory,
        hardwareConcurrency: cores,
      }),
    };
  }, [reducedMotion]);
}
