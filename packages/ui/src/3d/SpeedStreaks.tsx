"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** Subtle radial speed streaks — additive, low opacity (showroom “motion” read). */
export function SpeedStreaks({ count = 10 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.z = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={group} position={[0, 0.9, 1.2]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / count) * Math.PI * 2]}>
          <planeGeometry args={[0.015, 0.9 + (i % 3) * 0.15]} />
          <meshBasicMaterial
            color="#d4b86a"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
