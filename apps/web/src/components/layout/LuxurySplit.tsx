import type { ReactNode } from "react";
import { spacing } from "@vex/design-system";

type Ratio = "balanced" | "lead" | "feature";

const ratios: Record<Ratio, string> = {
  balanced: "minmax(0,1fr) minmax(0,1fr)",
  lead: "minmax(0,0.9fr) minmax(0,1.1fr)",
  feature: "minmax(0,1.1fr) minmax(0,0.9fr)",
};

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function LuxurySplit({
  left,
  right,
  className,
  ratio = "balanced",
  align = "start",
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  ratio?: Ratio;
  align?: "start" | "center" | "end";
}) {
  const alignItems = align === "center" ? "center" : align === "end" ? "end" : "start";

  return (
    <div
      className={cx("luxury-split-layout grid", className)}
      style={{
        gap: spacing.stack2xl,
        alignItems,
        ["--vex-split-columns" as string]: ratios[ratio],
      }}
    >
      <div className="min-w-0">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  );
}
