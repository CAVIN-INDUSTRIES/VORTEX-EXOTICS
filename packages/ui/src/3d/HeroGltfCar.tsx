"use client";

import { useLayoutEffect } from "react";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { applyHeroLuxuryCarPaint, type HeroLuxuryPaintOptions } from "./heroCarMaterial.js";

export type HeroGltfCarProps = {
  url: string;
  paintOptions?: HeroLuxuryPaintOptions;
};

export function HeroGltfCar({ url, paintOptions }: HeroGltfCarProps) {
  const { scene } = useGLTF(url) as { scene: THREE.Group };

  useLayoutEffect(() => {
    applyHeroLuxuryCarPaint(scene, paintOptions);
  }, [scene, paintOptions]);

  return (
    <Bounds fit clip observe margin={1.12}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}
