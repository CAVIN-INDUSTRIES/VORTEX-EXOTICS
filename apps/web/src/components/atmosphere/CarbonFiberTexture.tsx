import { lighting } from "@vex/design-system";

export function CarbonFiberTexture({ opacity = 0.18, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-carbon ${className}`.trim()}
      style={{ background: lighting.carbonFiberOverlay, opacity }}
    />
  );
}
