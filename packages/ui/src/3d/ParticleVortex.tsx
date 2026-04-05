"use client";

import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VEX_POINTS = 180;

/** Stylized “VEX” particle field — three clusters + spiral drift (logo-adjacent, not vector typography). */
export function ParticleVortex({
  intensity = 1,
  scrollY,
  accentColor = "#e8d5a4",
}: {
  intensity?: number;
  scrollY?: MutableRefObject<number>;
  /** Tenant accent (`--accent-bright`) for white-label energy field */
  accentColor?: string;
}) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(VEX_POINTS * 3);
    let i = 0;
    const pushCluster = (cx: number, spread: number, count: number) => {
      for (let k = 0; k < count && i < VEX_POINTS; k++) {
        pos[i * 3] = cx + (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
        i++;
      }
    };
    pushCluster(-1.35, 0.85, 70);
    pushCluster(0, 0.75, 55);
    pushCluster(1.25, 0.9, 55);
    while (i < VEX_POINTS) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      i++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const sy = scrollY?.current ?? 0;
    pts.rotation.y = t * 0.11 * intensity + sy * 0.00025;
    pts.rotation.x = Math.sin(t * 0.14) * 0.06 * intensity;
    pts.position.y = Math.sin(t * 0.2) * 0.08 * intensity;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        transparent
        opacity={0.42 * intensity}
        size={0.032}
        sizeAttenuation
        color={accentColor}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
