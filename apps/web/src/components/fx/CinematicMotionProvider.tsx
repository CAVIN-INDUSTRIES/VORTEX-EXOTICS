"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdaptiveEffects } from "@/hooks/useAdaptiveEffects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { destroyLenis, initLenis } from "@/lib/scroll/lenis";

const SCENE_BY_PATH: Array<{ test: (path: string) => boolean; scene: string }> = [
  { test: (path) => path === "/", scene: "home" },
  { test: (path) => path.startsWith("/inventory"), scene: "inventory" },
  { test: (path) => path.startsWith("/build"), scene: "build" },
  { test: (path) => path.startsWith("/portal"), scene: "portal" },
];

function getScene(pathname: string): string {
  return SCENE_BY_PATH.find((item) => item.test(pathname))?.scene ?? "default";
}

export function CinematicMotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const { allowHeavyFx, effectsLevel } = useAdaptiveEffects();

  useEffect(() => {
    document.documentElement.dataset.scene = getScene(pathname);
    document.documentElement.dataset.effects = effectsLevel;
    if (reduced) document.documentElement.classList.add("reduced-motion");
    else document.documentElement.classList.remove("reduced-motion");
  }, [effectsLevel, pathname, reduced]);

  useEffect(() => {
    async function setup() {
      if (reduced || !allowHeavyFx) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);

      gsap.registerPlugin(ScrollTrigger);
      initLenis({ onScroll: ScrollTrigger.update });
    }

    setup().catch(() => {});
    return () => {
      destroyLenis();
    };
  }, [allowHeavyFx, reduced]);

  return <>{children}</>;
}
