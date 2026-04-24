import { lighting } from "@vex/design-system";

export function RoadLineDrift({ opacity = 0.2, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-road ${className}`.trim()}
      style={{ background: lighting.roadLineDrift, opacity }}
    />
  );
}
