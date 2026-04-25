export const acquisitionTheme = {
  colors: {
    matteBlack: "#050508",
    warmCharcoal: "#121216",
    softGold: "#d4af37",
    softGoldBright: "#f1d38a",
    deepBronze: "#7e5a2b",
    textPrimary: "#f6f1e8",
    textMuted: "#c9c0b2",
    panel: "rgba(18, 18, 22, 0.76)",
    panelStrong: "rgba(10, 10, 12, 0.88)",
    line: "rgba(212, 175, 55, 0.22)",
  },
  gradients: {
    hero:
      "radial-gradient(circle at 18% 18%, rgba(241,211,138,0.2), transparent 46%), radial-gradient(circle at 84% 78%, rgba(212,175,55,0.16), transparent 44%), linear-gradient(150deg, #050508 0%, #0f1014 56%, #18140f 100%)",
    panel:
      "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 40%, rgba(212,175,55,0.08) 100%)",
  },
  blur: {
    soft: "blur(14px)",
  },
} as const;

export type AcquisitionTheme = typeof acquisitionTheme;
