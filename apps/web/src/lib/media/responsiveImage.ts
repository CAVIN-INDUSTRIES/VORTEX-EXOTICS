import { getBlurData } from "./blurData";
import { getImageSizes, getOptimizedImageUrl, imageQuality } from "./imageLoader";

export function responsiveImage(source: string, profile: "hero" | "vehicleCard" | "editorial" = "vehicleCard") {
  const quality = profile === "hero" ? imageQuality.hero : imageQuality.card;
  const width = profile === "hero" ? 1600 : profile === "editorial" ? 1400 : 1200;

  return {
    src: getOptimizedImageUrl(source, width, quality),
    sizes: getImageSizes(profile),
    placeholder: "blur" as const,
    blurDataURL: getBlurData(source),
    quality,
  };
}

export function vehicleImageProps(source: string) {
  return responsiveImage(source, "vehicleCard");
}
