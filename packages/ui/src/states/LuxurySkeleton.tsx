export type LuxurySkeletonProps = {
  lines?: number;
  className?: string;
};

export function LuxurySkeleton({ lines = 3, className = "" }: LuxurySkeletonProps) {
  return (
    <div className={`vex-skeleton ${className}`.trim()} aria-hidden="true">
      <span className="vex-skeleton-media" />
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} className="vex-skeleton-line" style={{ width: `${92 - index * 14}%` }} />
      ))}
    </div>
  );
}
