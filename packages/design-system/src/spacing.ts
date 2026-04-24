export const spacing = {
  pageX: "clamp(1.25rem, 3vw, 2rem)",
  pageXWide: "clamp(1.25rem, 3.6vw, 2.5rem)",
  sectionY: "clamp(5rem, 9vw, 8rem)",
  sectionYCompact: "clamp(3.5rem, 6vw, 5rem)",
  sectionYHero: "clamp(5.5rem, 10vw, 9rem)",
  sectionYCinematic: "clamp(5.25rem, 11vw, 8.75rem)",
  stackXs: "0.5rem",
  stackSm: "0.875rem",
  stackMd: "1.25rem",
  stackLg: "2rem",
  stackXl: "3rem",
  stack2xl: "4rem",
  maxShell: "80rem",
  maxEditorial: "74rem",
  maxFeature: "88rem",
  readable: "42rem",
  readableNarrow: "34rem",
} as const;

export type VexSpacingToken = keyof typeof spacing;
