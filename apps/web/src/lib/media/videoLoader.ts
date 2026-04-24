export type VideoIntent = "hero" | "ambient" | "editorial";

export function shouldPreloadVideo(intent: VideoIntent) {
  return intent === "hero" ? "metadata" : "none";
}

export function getVideoProps(intent: VideoIntent = "ambient") {
  return {
    muted: true,
    playsInline: true,
    preload: shouldPreloadVideo(intent),
  } as const;
}
