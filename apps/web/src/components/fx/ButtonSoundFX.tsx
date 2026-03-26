"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function canPlayUiSounds(): boolean {
  if (typeof window === "undefined") return false;
  const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
  const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  return hover && fine;
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const p = new URLSearchParams(window.location.search).get("sfx");
    if (p === "off" || p === "0") return true;
    if (p === "on" || p === "1") return false;
    return window.localStorage.getItem("vex:sfx:mute") === "1";
  } catch {
    return true;
  }
}

export function ButtonSoundFX() {
  const reducedMotion = usePrefersReducedMotion();
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (reducedMotion || !canPlayUiSounds() || isMuted()) return;

    const getCtx = () => {
      if (ctxRef.current) return ctxRef.current;
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
      return ctxRef.current;
    };

    const playClick = (velocity = 0.18) => {
      const ctx = getCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.045);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(velocity, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    };

    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const btn = t?.closest?.("[data-sfx='button'], [data-magnetic='true']");
      if (!btn) return;
      playClick(0.12);
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
    };
  }, [reducedMotion]);

  return null;
}

