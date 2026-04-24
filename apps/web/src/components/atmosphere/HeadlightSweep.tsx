import { lighting } from "@vex/design-system";

export function HeadlightSweep({ opacity = 0.5, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-sweep ${className}`.trim()}
      style={{ background: lighting.headlightSweep, opacity }}
    />
  );
}
