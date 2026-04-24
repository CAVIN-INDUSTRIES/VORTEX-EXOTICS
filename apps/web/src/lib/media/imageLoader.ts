export const imageQuality = {
  thumbnail: 58,
  card: 72,
  hero: 82,
} as const;

export function getOptimizedImageUrl(src: string, width = 1200, quality: number = imageQuality.card) {
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }

  return src;
}

export function getImageSizes(profile: "hero" | "vehicleCard" | "editorial" = "vehicleCard") {
  if (profile === "hero") return "(max-width: 1100px) 100vw, 42vw";
  if (profile === "editorial") return "(max-width: 980px) 100vw, 50vw";
  return "(max-width: 980px) 100vw, (max-width: 1500px) 50vw, 33vw";
}
