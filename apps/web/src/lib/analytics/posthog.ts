"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

let initialized = false;

export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return false;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    persistence: "localStorage+cookie",
  });

  initialized = true;
  return true;
}

export function trackEvent(event: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  if (!initialized) {
    initAnalytics();
  }

  if (!initialized) return;

  posthog.capture(event, {
    path: window.location.pathname,
    ...properties,
  });
}

export function trackPageView(path: string) {
  trackEvent("$pageview", { path });
}
