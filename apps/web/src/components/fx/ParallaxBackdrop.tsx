"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./ParallaxBackdrop.module.css";

function canRunParallax(): boolean {
  if (typeof window === "undefined") return false;
  const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
  const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  return hover && fine;
}

export function ParallaxBackdrop() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);
  const target = useRef({ px: 0.5, py: 0.35, sy: 0 });
  const cur = useRef({ px: 0.5, py: 0.35, sy: 0 });

  useEffect(() => {
    setEnabled(canRunParallax() && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const onMove = (e: PointerEvent) => {
      target.current.px = e.clientX / Math.max(1, window.innerWidth);
      target.current.py = e.clientY / Math.max(1, window.innerHeight);
    };
    const onScroll = () => {
      target.current.sy = window.scrollY;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const tick = () => {
      const t = target.current;
      const c = cur.current;
      c.px += (t.px - c.px) * 0.08;
      c.py += (t.py - c.py) * 0.08;
      c.sy += (t.sy - c.sy) * 0.08;

      root.style.setProperty("--px", c.px.toFixed(4));
      root.style.setProperty("--py", c.py.toFixed(4));
      root.style.setProperty("--sy", `${c.sy.toFixed(0)}px`);

      raf.current = window.requestAnimationFrame(tick);
    };
    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={rootRef} className={styles.root} aria-hidden />;
}

