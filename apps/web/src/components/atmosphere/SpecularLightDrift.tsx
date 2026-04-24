import { lighting } from "@vex/design-system";

export function SpecularLightDrift({ opacity = 0.34, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-specular ${className}`.trim()}
      style={{ background: `${lighting.metallicReflection}, ${lighting.sweep}`, opacity }}
    />
  );
}
