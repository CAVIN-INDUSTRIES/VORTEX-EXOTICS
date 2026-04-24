import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfigureExperienceClient } from "../ConfigureExperienceClient";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/i;

export function generateMetadata({ params }: { params: { tenantSlug: string } }) {
  const slug = params.tenantSlug;
  return {
    title: `Configure · ${slug} · VEX`,
    description: "Tenant-scoped 3D configuration — luxury velocity, white-label assets.",
  };
}

export default function ConfigureTenantPage({ params }: { params: { tenantSlug: string } }) {
  const tenantSlug = params.tenantSlug?.trim() ?? "";
  if (!SLUG_RE.test(tenantSlug)) notFound();

  return (
    <main id="main-content" className="home-main home-landing" style={{ minHeight: "100vh" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {tenantSlug} · Build your Vortex
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginTop: "0.5rem" }}>
            Configure (tenant preview)
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "36rem", marginTop: "0.75rem" }}>
            Loads dealer-specific GLB when mapped in <code style={{ fontSize: "0.85em" }}>resolveTenantConfigureGlb</code> — same{" "}
            <code style={{ fontSize: "0.85em" }}>@vex/ui/3d</code> stack as the public hero.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <Link href="/build" style={{ color: "var(--accent-bright)" }}>
              Open full build flow →
            </Link>
          </p>
          <div
            style={{
              marginTop: "2rem",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              overflow: "visible",
            }}
          >
            <ConfigureExperienceClient tenantSlug={tenantSlug} />
          </div>
        </div>
      </main>
  );
}
