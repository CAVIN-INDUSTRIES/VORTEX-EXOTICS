"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./RouteTransitionFX.module.css";

/**
 * App-router transition overlay.
 * Shows a quick luxe wipe between routes to make navigation feel intentional.
 */
export function RouteTransitionFX() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const prevPath = useRef<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    setPhase("in");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPhase("out"), 170);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    };
  }, [pathname, reducedMotion]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("idle"), 220);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (reducedMotion) return null;
  if (phase === "idle") return null;

  return (
    <div
      className={`${styles.root} ${phase === "in" ? styles.in : styles.out}`}
      aria-hidden
    />
  );
}

