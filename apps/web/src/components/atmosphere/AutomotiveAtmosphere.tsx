import { CarbonFiberTexture } from "./CarbonFiberTexture";
import { HeadlightSweep } from "./HeadlightSweep";
import { MetallicGradientField } from "./MetallicGradientField";
import { RoadLineDrift } from "./RoadLineDrift";
import { ShowroomReflection } from "./ShowroomReflection";
import { SpecularLightDrift } from "./SpecularLightDrift";

type Variant = "hero" | "collection" | "cta" | "subtle" | "auth" | "inventory";
type Intensity = "low" | "medium" | "high";

const intensityMap: Record<Intensity, number> = {
  low: 0.72,
  medium: 1,
  high: 1.2,
};

const variantClass: Record<Variant, string> = {
  hero: "vex-automotive-hero",
  collection: "vex-automotive-collection",
  cta: "vex-automotive-cta",
  subtle: "vex-automotive-subtle",
  auth: "vex-automotive-auth",
  inventory: "vex-automotive-inventory",
};

export function AutomotiveAtmosphere({
  variant = "subtle",
  intensity = "medium",
}: {
  variant?: Variant;
  intensity?: Intensity;
}) {
  const scale = intensityMap[intensity];

  return (
    <div aria-hidden="true" className={`vex-automotive-atmosphere ${variantClass[variant]}`}>
      <ShowroomReflection opacity={0.3 * scale} />
      <MetallicGradientField opacity={0.26 * scale} />
      <SpecularLightDrift opacity={0.28 * scale} />
      <HeadlightSweep opacity={0.22 * scale} />
      <RoadLineDrift opacity={variant === "hero" || variant === "inventory" ? 0.14 * scale : 0.08 * scale} />
      <CarbonFiberTexture opacity={variant === "auth" ? 0.18 * scale : 0.1 * scale} />
    </div>
  );
}
