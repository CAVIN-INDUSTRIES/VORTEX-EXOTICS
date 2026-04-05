import Link from "next/link";
import { Header } from "@/components/Header";
import { ConfigureExperienceClient } from "./ConfigureExperienceClient";

export const metadata = {
  title: "Configure · VEX",
  description: "Real-time 3D configuration — colors, wheels, interior, live pricing.",
};

export default function ConfigurePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="home-main home-landing" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Build your Vortex
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginTop: "0.5rem" }}>
          Configure (preview)
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "36rem", marginTop: "0.75rem" }}>
          Live material swaps, wheel packs, and Stripe checkout wiring ship in the next slice. This route hosts the shared{" "}
          <code style={{ fontSize: "0.85em" }}>@vex/ui/3d</code> viewer.
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
          <ConfigureExperienceClient />
        </div>
      </div>
    </main>
    </>
  );
}
