"use client";

import dynamic from "next/dynamic";
import { DEFAULT_PUBLIC_VEHICLE_GLB } from "@/lib/vehicle3d/defaults";
import { resolveTenantConfigureGlb } from "@/lib/tenantConfigureAssets";

const CinematicCarViewer = dynamic(
  () => import("@vex/ui/3d").then((m) => ({ default: m.CinematicCarViewer })),
  { ssr: false, loading: () => <div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading 3D…</div> },
);

export function ConfigureExperienceClient({ tenantSlug }: { tenantSlug?: string } = {}) {
  const glbUrl = tenantSlug ? resolveTenantConfigureGlb(tenantSlug) : DEFAULT_PUBLIC_VEHICLE_GLB;
  return <CinematicCarViewer glbUrl={glbUrl} />;
}
