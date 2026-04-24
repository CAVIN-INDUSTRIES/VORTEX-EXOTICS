import * as React from "react";

export type LuxuryErrorStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
};

export function LuxuryErrorState({
  title = "The signal was interrupted",
  message = "We could not load this private surface. The issue can be reviewed while you retry the request.",
  action,
  className = "",
}: LuxuryErrorStateProps) {
  return (
    <section className={`vex-state vex-state-error ${className}`.trim()} role="alert">
      <p className="vex-state-kicker">System notice</p>
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="vex-state-action">{action}</div> : null}
    </section>
  );
}
