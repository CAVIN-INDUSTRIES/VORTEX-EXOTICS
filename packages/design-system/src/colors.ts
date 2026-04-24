export const colors = {
  ink: "#050506",
  obsidian: "#070707",
  charcoal: "#101010",
  graphite: "#17181c",
  panel: "rgba(17, 17, 17, 0.72)",
  panelStrong: "rgba(24, 24, 24, 0.82)",
  panelSoft: "rgba(19, 19, 22, 0.58)",
  white: "#fff8eb",
  text: "#f6f1e8",
  textSoft: "#d8d0c2",
  textMuted: "#a99f8d",
  gold: "#d4af37",
  goldSoft: "#f1d38a",
  champagne: "#f3d79a",
  goldDeep: "#8a6b2e",
  steel: "#8fd8ff",
  platinum: "#d7dce6",
  brake: "#8d3026",
  signal: "#c7f0d8",
} as const;

export type VexColorToken = keyof typeof colors;
