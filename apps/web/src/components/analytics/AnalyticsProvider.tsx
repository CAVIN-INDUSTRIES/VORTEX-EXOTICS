"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackEvent, trackPageView } from "@/lib/analytics/posthog";

function readAnalyticsDataset(element: HTMLElement) {
  const properties: Record<string, string> = {};

  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!value || key === "analyticsEvent") return;
    if (!key.startsWith("analytics")) return;

    const normalizedKey = key.replace(/^analytics/, "");
    const propertyKey = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
    properties[propertyKey] = value;
  });

  return properties;
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const sessionStartedAt = useRef<number>(Date.now());
  const scrollDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      if (!target?.dataset.analyticsEvent) return;

      trackEvent(target.dataset.analyticsEvent, {
        surface: target.dataset.analyticsSurface,
        label: target.textContent?.trim().slice(0, 120),
        ...readAnalyticsDataset(target),
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const thresholds = [25, 50, 75, 90];

    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depth = Math.round((window.scrollY / scrollable) * 100);
      thresholds.forEach((threshold) => {
        if (depth >= threshold && !scrollDepths.current.has(threshold)) {
          scrollDepths.current.add(threshold);
          trackEvent("scroll_depth", { depth: threshold });
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPageHide() {
      trackEvent("session_duration", {
        durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      });
    }

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  return null;
}
