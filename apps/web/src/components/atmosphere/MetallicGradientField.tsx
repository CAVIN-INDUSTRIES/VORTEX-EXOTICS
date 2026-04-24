import { gradients, lighting } from "@vex/design-system";

export function MetallicGradientField({ opacity = 0.42, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-metallic ${className}`.trim()}
      style={{
        background: `${lighting.metallicReflection}, ${lighting.champagneRimLight}, ${lighting.platinumGlow}, ${lighting.brakeLightAccent}, ${gradients.collection}`,
        opacity,
      }}
    />
  );
}
