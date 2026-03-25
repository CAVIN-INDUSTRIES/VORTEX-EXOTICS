"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./MagneticFX.module.css";

function shouldEnableMagnetic(): boolean {
  if (typeof window === "undefined") return false;
  const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
  const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  return hover && fine;
}

export function MagneticFX() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const enable = shouldEnableMagnetic() && !reducedMotion;
    if (!enable) return;

    const cleanup: Array<() => void> = [];

    const attach = (el: HTMLElement) => {
      if ((el as any).__vexMagneticAttached) return;
      (el as any).__vexMagneticAttached = true;

      el.classList.add(styles.magnetic);

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / Math.max(1, r.width);
        const y = (e.clientY - r.top) / Math.max(1, r.height);
        const dx = (x - 0.5) * 10;
        const dy = (y - 0.5) * 10;
        el.style.setProperty("--mx", `${dx.toFixed(2)}px`);
        el.style.setProperty("--my", `${dy.toFixed(2)}px`);
        el.style.setProperty("--hx", `${(x * 100).toFixed(2)}%`);
        el.style.setProperty("--hy", `${(y * 100).toFixed(2)}%`);
      };
      const onLeave = () => {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave, { passive: true });

      cleanup.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-magnetic='true']").forEach(attach);
    };

    scan();

    const obs = new MutationObserver(() => scan());
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    cleanup.push(() => obs.disconnect());

    return () => cleanup.forEach((fn) => fn());
  }, [reducedMotion]);

  return null;
}

