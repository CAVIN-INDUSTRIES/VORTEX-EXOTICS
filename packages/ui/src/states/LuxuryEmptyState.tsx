import * as React from "react";

export type LuxuryEmptyStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
};

export function LuxuryEmptyState({
  title = "No qualified matches yet",
  message = "The collection is intentionally narrow. Adjust the criteria or request concierge sourcing for a private fit.",
  action,
  className = "",
}: LuxuryEmptyStateProps) {
  return (
    <section className={`vex-state ${className}`.trim()}>
      <p className="vex-state-kicker">Private archive</p>
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="vex-state-action">{action}</div> : null}
    </section>
  );
}
