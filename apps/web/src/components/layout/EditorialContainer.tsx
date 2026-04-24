import type { ReactNode } from "react";
import { spacing } from "@vex/design-system";

type Width = "shell" | "editorial" | "feature" | "narrative";

const widths: Record<Width, string> = {
  shell: spacing.maxShell,
  editorial: spacing.maxEditorial,
  feature: spacing.maxFeature,
  narrative: spacing.readable,
};

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function EditorialContainer({
  children,
  className,
  width = "shell",
}: {
  children: ReactNode;
  className?: string;
  width?: Width;
}) {
  return (
    <div
      className={cx("mx-auto w-full", className)}
      style={{
        maxWidth: widths[width],
        paddingInline: spacing.pageXWide,
      }}
    >
      {children}
    </div>
  );
}
