import { colors, spacing, typography } from "@vex/design-system";

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function EditorialHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={cx(centered ? "mx-auto text-center" : "", className)} style={{ maxWidth: spacing.readable }}>
      {eyebrow ? (
        <p className="section-kicker" style={{ ...typography.sectionEyebrow, color: colors.goldSoft }}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="section-title"
        style={{
          ...typography.displaySection,
          marginTop: eyebrow ? spacing.stackSm : 0,
        }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className="section-copy"
          style={{
            ...typography.bodyLarge,
            marginTop: spacing.stackMd,
            color: colors.textSoft,
            maxWidth: spacing.readable,
            marginInline: centered ? "auto" : undefined,
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
