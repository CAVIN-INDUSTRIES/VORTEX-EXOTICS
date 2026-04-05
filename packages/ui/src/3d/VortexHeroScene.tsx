"use client";

import { Suspense, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { HeroLuxuryPaintOptions } from "./heroCarMaterial.js";
import { HeroGltfCar } from "./HeroGltfCar.js";
import { ParticleVortex } from "./ParticleVortex.js";
import { VortexBurstParticles } from "./VortexBurstParticles.js";
import { VortexPostFXStack } from "./VortexPostFXStack.js";

export type VortexHeroBrand = {
  particleAccent?: string;
  paintAccentHex?: string;
  environmentPreset?: "city" | "studio" | "night" | "sunset" | "dawn" | "warehouse";
  iridescence?: number;
};

export type VortexHeroSceneProps = {
  scrollY: MutableRefObject<number>;
  glbUrl: string;
  cinematicMode?: boolean;
  /** White-label: tie 3D to tenant CSS / server `TenantCinematic3d` */
  brand?: VortexHeroBrand;
};

function CursorRimLight() {
  const ref = useRef<THREE.SpotLight>(null);
  const { mouse } = useThree();
  useFrame(() => {
    const L = ref.current;
    if (!L) return;
    L.position.x = THREE.MathUtils.lerp(L.position.x, mouse.x * 8, 0.07);
    L.position.y = THREE.MathUtils.lerp(L.position.y, mouse.y * 4 + 3, 0.07);
    L.position.z = 5.5;
  });
  return <spotLight ref={ref} intensity={1.65} angle={0.52} penumbra={0.92} color="#ffe8cc" />;
}

function RotatingCar({
  scrollY,
  glbUrl,
  paintOptions,
}: {
  scrollY: MutableRefObject<number>;
  glbUrl: string;
  paintOptions?: HeroLuxuryPaintOptions;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = state.clock.elapsedTime * 0.055 + scrollY.current * 0.00032;
  });
  return (
    <group ref={group}>
      <HeroGltfCar url={glbUrl} paintOptions={paintOptions} />
    </group>
  );
}

/**
 * Full-viewport hero: PBR car, vortex particles, god-rays + post stack.
 * Consumers pass `glbUrl` (e.g. Khronos ToyCar or tenant CDN asset).
 */
export function VortexHeroScene({ scrollY, glbUrl, cinematicMode = false, brand }: VortexHeroSceneProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const burstIntensity = cinematicMode ? 1.35 : 1;
  const envPreset = brand?.environmentPreset ?? "city";
  const paintOptions: HeroLuxuryPaintOptions | undefined =
    brand?.paintAccentHex || brand?.iridescence != null
      ? {
          accentHex: brand.paintAccentHex,
          iridescence: brand.iridescence,
        }
      : undefined;

  useGLTF.preload(glbUrl);

  return (
    <Canvas
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.02, 6.2], fov: 38 }}
    >
      <color attach="background" args={["#050508"]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 7, 5]} intensity={1.15} color="#d0e0ff" />
      <CursorRimLight />
      <mesh ref={sunRef} position={[8, 6, -6]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshBasicMaterial color="#ffffee" />
      </mesh>
      <Suspense fallback={null}>
        <Environment preset={envPreset} />
        <RotatingCar scrollY={scrollY} glbUrl={glbUrl} paintOptions={paintOptions} />
        <group position={[0, 1.2, 0]}>
          <ParticleVortex
            intensity={burstIntensity}
            scrollY={scrollY}
            accentColor={brand?.particleAccent ?? "#e8d5a4"}
          />
          <VortexBurstParticles intensity={burstIntensity * 0.65} />
        </group>
      </Suspense>
      <VortexPostFXStack sunRef={sunRef} cinematicMode={cinematicMode} />
    </Canvas>
  );
}
