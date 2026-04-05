"use client";

import type { MutableRefObject } from "react";
import { useMemo } from "react";
import type { Mesh } from "three";
import { Color, Vector2, Vector3 } from "three";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  GodRays,
  LensFlare,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

export type VortexPostFXStackProps = {
  /** Dev / `NEXT_PUBLIC_CINEMATIC_MODE` — stronger bloom + particles elsewhere. */
  cinematicMode?: boolean;
  /** Ref to a small emissive mesh used as god-rays source. */
  sunRef: MutableRefObject<Mesh | null>;
  /** Apex v4: 0–1 scroll / hero visibility — ramps bloom + god-ray weight. */
  apexBoost?: number;
};

/**
 * Full cinematic stack: bloom (highlight-weighted), DOF, god rays, violet–gold lens flare, chroma, grain, vignette.
 * True MRT deferred bloom = optional upgrade (SelectiveBloom + layer pass); this stack stays forward `EffectComposer`.
 */
export function VortexPostFXStack({ cinematicMode = false, sunRef, apexBoost = 0 }: VortexPostFXStackProps) {
  const chroma = useMemo(() => new Vector2(0.0014, 0.0018), []);
  const lensColor = useMemo(() => {
    const c = new Color("#b388ff");
    c.lerp(new Color("#d4af37"), 0.38);
    return c;
  }, []);
  const lensPosition = useMemo(() => new Vector3(8, 6, -6), []);
  const ab = Math.min(1, Math.max(0, apexBoost));
  const bloomIntensity = (cinematicMode ? 2.65 : 0.58) + ab * 0.52;
  /** Higher threshold → bloom reads like an emissive pass (sun + car highlights), not a full-frame haze. */
  const bloomThreshold = cinematicMode ? 0.52 - ab * 0.06 : 0.62 - ab * 0.08;
  const godWeight = (cinematicMode ? 0.9 : 0.55) + ab * 0.42;
  const lensOpacity = (cinematicMode ? 0.26 : 0.14) + ab * 0.2;

  return (
    <EffectComposer multisampling={2} enableNormalPass depthBuffer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={cinematicMode ? 0.09 : 0.055}
        mipmapBlur
        radius={cinematicMode ? 0.72 + ab * 0.08 : 0.52 + ab * 0.12}
      />
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.018}
        bokehScale={cinematicMode ? 4.2 : 2.8}
        height={720}
      />
      <GodRays
        sun={sunRef as MutableRefObject<Mesh>}
        density={0.96}
        decay={0.92}
        weight={godWeight}
        exposure={0.55 + ab * 0.12}
        blur
      />
      <LensFlare
        opacity={lensOpacity}
        colorGain={lensColor}
        glareSize={0.42}
        flareSize={0.55}
        starBurst
        anamorphic
        secondaryGhosts
        animated
        position={lensPosition}
      />
      <ChromaticAberration offset={chroma} radialModulation={true} modulationOffset={0.42} />
      <Noise opacity={cinematicMode ? 0.1 : 0.075} />
      <Vignette eskil={false} offset={0.1} darkness={cinematicMode ? 0.48 : 0.42} />
    </EffectComposer>
  );
}
