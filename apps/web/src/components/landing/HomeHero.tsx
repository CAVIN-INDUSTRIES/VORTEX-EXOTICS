"use client";

import { DealerProgramHero } from "./DealerProgramHero";
import { DynamicHeroShell } from "@/components/hero/DynamicHeroShell";

/** Default: cinematic v2. Set `NEXT_PUBLIC_CINEMATIC_HERO_V2=0` to restore legacy hero. */
function cinematicHeroV2Enabled(): boolean {
  const v = process.env.NEXT_PUBLIC_CINEMATIC_HERO_V2;
  if (v === "0" || v === "false") return false;
  return true;
}

/** Home hero: Vortex cinematic engine by default; legacy dealer hero when opted out. */
export function HomeHero() {
  if (cinematicHeroV2Enabled()) {
    return <DynamicHeroShell />;
  }
  return <DealerProgramHero />;
}
