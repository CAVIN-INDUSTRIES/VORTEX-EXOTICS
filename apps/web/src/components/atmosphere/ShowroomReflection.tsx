import { gradients, lighting } from "@vex/design-system";

export function ShowroomReflection({ opacity = 0.5, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`vex-automotive-layer vex-automotive-reflection ${className}`.trim()}
      style={{
        background: `${lighting.showroomKeyLight}, ${gradients.showroom}`,
        opacity,
      }}
    />
  );
}
