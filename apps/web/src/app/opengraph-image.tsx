import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/siteUrl";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const origin = getSiteUrl().origin;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 64px",
          background:
            "radial-gradient(circle at 18% 18%, rgba(241,211,138,0.2), transparent 45%), radial-gradient(circle at 84% 82%, rgba(212,175,55,0.14), transparent 40%), linear-gradient(150deg, #050508 0%, #0e1016 58%, #141212 100%)",
          color: "#f6f1e8",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 1,
              background: "linear-gradient(90deg, transparent, #f1d38a, transparent)",
            }}
          />
          <span style={{ fontSize: 26, letterSpacing: "0.32em", textTransform: "uppercase", color: "#f1d38a" }}>
            VEX Atelier
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 940 }}>
          <span style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
            Private Market Luxury Automotive Platform
          </span>
          <span style={{ fontSize: 30, lineHeight: 1.3, color: "#d8d0c2" }}>
            Verified inventory, concierge acquisition, and appraisal flows in one controlled operating environment.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#bba88a" }}>
          <span>Inventory • Appraisals • Concierge</span>
          <span>{origin}</span>
        </div>
      </div>
    ),
    size
  );
}
