import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VEX Atelier luxury automotive platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 16% 20%, rgba(241,211,138,0.26), transparent 52%), radial-gradient(circle at 84% 74%, rgba(212,175,55,0.22), transparent 48%), linear-gradient(150deg, #050508 8%, #0b0c0f 58%, #121116 100%)",
          color: "#fff8eb",
          padding: "64px 72px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 10,
              height: 58,
              borderRadius: 999,
              background:
                "linear-gradient(180deg, rgba(241,211,138,0), rgba(241,211,138,0.96), rgba(241,211,138,0))",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 18, letterSpacing: "0.36em", textTransform: "uppercase", color: "#f1d38a" }}>
              Vortex Exotics
            </span>
            <span style={{ marginTop: 8, fontSize: 44, letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.06 }}>
              VEX Atelier
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.03, letterSpacing: "-0.03em", maxWidth: 920 }}>
            Luxury automotive platform for private inventory and appraisal intelligence.
          </div>
          <div style={{ fontSize: 26, color: "#d9cfbe", maxWidth: 980, lineHeight: 1.4 }}>
            Concierge-led acquisition flow, dealer CRM operations, and a cinematic market-ready digital storefront.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
