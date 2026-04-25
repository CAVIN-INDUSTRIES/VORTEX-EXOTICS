"use client";

import { useAdaptiveEffects } from "@/hooks/useAdaptiveEffects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getVideoProps } from "@/lib/media/videoLoader";

export function HeroBackgroundVideo({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const { allowHeavyFx } = useAdaptiveEffects();
  const src = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  const poster = process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER;

  if (reducedMotion || !allowHeavyFx || !src) return null;

  return (
    <video
      className={className}
      autoPlay
      loop
      muted
      playsInline
      poster={poster || undefined}
      src={src}
      {...getVideoProps("hero")}
    />
  );
}
