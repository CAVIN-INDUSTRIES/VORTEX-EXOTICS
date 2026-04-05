"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** Point light that follows NDC mouse — showroom rim on the car. */
export function MouseFillLight({ strength = 1 }: { strength?: number }) {
  const ref = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();
  useFrame(() => {
    const L = ref.current;
    if (!L) return;
    L.position.x = THREE.MathUtils.lerp(L.position.x, mouse.x * 6, 0.08);
    L.position.y = THREE.MathUtils.lerp(L.position.y, mouse.y * 3.2 + 2, 0.08);
    L.position.z = 4.2;
  });
  return <pointLight ref={ref} intensity={1.15 * strength} color="#fff4dd" distance={14} decay={2} />;
}
