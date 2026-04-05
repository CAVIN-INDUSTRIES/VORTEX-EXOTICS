import { DEFAULT_PUBLIC_VEHICLE_GLB } from "@/lib/vehicle3d/defaults";

/** Demo map: production resolves slug → tenant CDN GLB via API / env. */
const TENANT_CONFIGURE_GLB: Record<string, string> = {
  vex: DEFAULT_PUBLIC_VEHICLE_GLB,
  demo: DEFAULT_PUBLIC_VEHICLE_GLB,
};

export function resolveTenantConfigureGlb(tenantSlug: string): string {
  const key = tenantSlug.trim().toLowerCase();
  return TENANT_CONFIGURE_GLB[key] ?? DEFAULT_PUBLIC_VEHICLE_GLB;
}
