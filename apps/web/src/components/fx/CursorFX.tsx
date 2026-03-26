"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./CursorFX.module.css";

function supportsFancyCursor(): boolean {
  if (typeof window === "undefined") return false;
  // Avoid on touch / pen devices and when hover isn't available
  const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
  const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  return hover && fine;
}

export function CursorFX() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const raf = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sparksRef = useRef<Array<HTMLSpanElement | null>>([]);
  const sparkIdx = useRef(0);
  const lastSparkAt = useRef(0);

  const state = useMemo(
    () => ({
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      mx: 0,
      my: 0,
      down: false,
      interactive: false,
    }),
    []
  );

  useEffect(() => {
    const ok = supportsFancyCursor() && !reducedMotion;
    setEnabled(ok);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("cursor-fx");
      return;
    }

    document.documentElement.classList.add("cursor-fx");
    return () => {
      document.documentElement.classList.remove("cursor-fx");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const onMove = (e: PointerEvent) => {
      state.x = e.clientX;
      state.y = e.clientY;
    };
    const onDown = () => {
      state.down = true;
      root.dataset.down = "1";
    };
    const onUp = () => {
      state.down = false;
      delete root.dataset.down;
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest?.("a,button,[role='button'],[data-cursor='interactive']");
      if (interactive) {
        root.dataset.mode = "interactive";
        state.interactive = true;
      } else {
        delete root.dataset.mode;
        state.interactive = false;
      }
    };

    const spawnSpark = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSparkAt.current < 70) return;
      lastSparkAt.current = now;
      const list = sparksRef.current;
      const idx = sparkIdx.current % list.length;
      sparkIdx.current += 1;
      const el = list[idx];
      if (!el) return;
      const ox = (Math.random() - 0.5) * 22;
      const oy = (Math.random() - 0.5) * 22;
      const s = 0.7 + Math.random() * 0.7;
      const a = 0.45 + Math.random() * 0.45;
      el.style.setProperty("--sx", `${x + ox}px`);
      el.style.setProperty("--sy", `${y + oy}px`);
      el.style.setProperty("--ss", s.toFixed(2));
      el.style.setProperty("--sa", a.toFixed(2));
      el.dataset.active = "1";
      window.setTimeout(() => {
        delete el.dataset.active;
      }, 260);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    const tick = () => {
      // fast cursor
      state.mx += (state.x - state.mx) * 0.45;
      state.my += (state.y - state.my) * 0.45;
      // trailing glow
      state.tx += (state.x - state.tx) * 0.12;
      state.ty += (state.y - state.ty) * 0.12;

      root.style.setProperty("--cx", `${state.mx}px`);
      root.style.setProperty("--cy", `${state.my}px`);
      root.style.setProperty("--tx", `${state.tx}px`);
      root.style.setProperty("--ty", `${state.ty}px`);
      if (state.interactive) spawnSpark(state.mx, state.my);

      raf.current = window.requestAnimationFrame(tick);
    };

    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerover", onOver);
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [enabled, state]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden>
      <div className={styles.trail} />
      <div className={styles.dot} />
      <div className={styles.ring} />
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            sparksRef.current[i] = el;
          }}
          className={styles.spark}
        />
      ))}
    </div>
  );
}

