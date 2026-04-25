import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.14), transparent 46%), linear-gradient(140deg, #0a0b10 0%, #14151b 60%, #0f1015 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#f8f3e8",
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: 66, fontWeight: 700, letterSpacing: 4 }}>VEX</span>
          <span style={{ fontSize: 15, letterSpacing: 7, color: "#d4af37", marginTop: 8 }}>ATELIER</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
