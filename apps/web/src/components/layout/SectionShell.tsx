import type { ReactNode } from "react";
import { spacing } from "@vex/design-system";

type SectionVariant = "default" | "hero" | "compact" | "cinematic" | "dark";

const variantClasses: Record<SectionVariant, string> = {
  default: "relative overflow-hidden",
  hero: "relative overflow-hidden",
  compact: "relative overflow-hidden",
  cinematic: "relative overflow-hidden",
  dark: "relative overflow-hidden",
};

const variantPadding: Record<SectionVariant, string> = {
  default: spacing.sectionY,
  hero: spacing.sectionYHero,
  compact: spacing.sectionYCompact,
  cinematic: spacing.sectionYCinematic,
  dark: spacing.sectionY,
};

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SectionShell({
  children,
  className,
  variant = "default",
  atmosphere,
  id,
}: {
  children: ReactNode;
  className?: string;
  variant?: SectionVariant;
  atmosphere?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cx(variantClasses[variant], className)}
      style={{ paddingBlock: variantPadding[variant] }}
    >
      {atmosphere}
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
