"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const tmp = new THREE.Vector2();

/** Maps R3F pointer to `uMouseInfluence` (0–1) for iridescence + flake layers — lerped for smooth, dramatic shifts. */
export function CinematicMouseUniform({ root }: { root: THREE.Object3D | null }) {
  const ref = useRef<THREE.Object3D | null>(null);
  ref.current = root;
  const { mouse } = useThree();
  useFrame(() => {
    const obj = ref.current;
    if (!obj) return;
    const u = obj.userData.__cinematicMouse as THREE.IUniform<THREE.Vector2> | undefined;
    if (!u) return;
    tmp.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
    u.value.lerp(tmp, 0.14);
  });
  return null;
}
