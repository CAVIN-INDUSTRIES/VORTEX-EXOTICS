export type LuxuryLoadingStateProps = {
  label?: string;
  detail?: string;
  className?: string;
};

export function LuxuryLoadingState({
  label = "Preparing private room",
  detail = "Curating the next surface with verified context.",
  className = "",
}: LuxuryLoadingStateProps) {
  return (
    <div className={`vex-state vex-state-loading ${className}`.trim()} role="status" aria-live="polite">
      <span className="vex-state-orbit" aria-hidden="true" />
      <p className="vex-state-kicker">VEX</p>
      <h2>{label}</h2>
      <p>{detail}</p>
    </div>
  );
}
