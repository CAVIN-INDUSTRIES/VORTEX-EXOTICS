import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            "radial-gradient(circle at 20% 18%, rgba(241, 211, 138, 0.22), transparent 40%), linear-gradient(135deg, #040507 0%, #0d0f15 65%, #13161d 100%)",
          color: "#f8edd5",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: "-0.08em",
              fontWeight: 700,
            }}
          >
            V
          </div>
          <div
            style={{
              fontSize: 32,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#d4af37",
            }}
          >
            Atelier
          </div>
        </div>
      </div>
    ),
    size
  );
}
