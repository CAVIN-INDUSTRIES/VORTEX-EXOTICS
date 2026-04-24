import type { ReactNode } from "react";
import { spacing } from "@vex/design-system";

function getTemplate(columns: 2 | 3 | 4) {
  if (columns === 2) return "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))";
  if (columns === 4) return "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))";
  return "repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr))";
}

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function FeatureGrid({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={cx("grid", className)}
      style={{
        gap: spacing.stackLg,
        gridTemplateColumns: getTemplate(columns),
      }}
    >
      {children}
    </div>
  );
}
