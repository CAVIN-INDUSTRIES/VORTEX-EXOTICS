"use client";

import dynamic from "next/dynamic";

const HeroParticleField = dynamic(
  () => import("./HeroParticleField").then((mod) => mod.HeroParticleField),
  { ssr: false }
);

export function HeroParticleFieldClient() {
  return <HeroParticleField />;
}
