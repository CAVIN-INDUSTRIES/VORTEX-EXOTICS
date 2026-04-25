type AcquisitionProgressBarProps = {
  current: number;
  total: number;
  stepTitle: string;
};

export function AcquisitionProgressBar({ current, total, stepTitle }: AcquisitionProgressBarProps) {
  const clampedCurrent = Math.min(Math.max(1, current), total);
  const activeIndex = clampedCurrent - 1;
  const progress = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;

  return (
    <div className="rounded-[1.4rem] border border-white/12 bg-black/28 p-4">
      <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.24em] text-[#b8aa8f]">
        <span>Consultation progress</span>
        <span>
          Step {clampedCurrent} / {total}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#b88b52,#d4af37,#f1d38a)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: total }, (_, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <span
              key={index}
              className={`rounded-full border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.2em] ${
                isActive
                  ? "border-[#f1d38a]/60 bg-[#d4af37]/18 text-[#fff2d2]"
                  : isComplete
                    ? "border-[#d4af37]/35 bg-[#d4af37]/8 text-[#e0c899]"
                    : "border-white/10 bg-white/[0.03] text-[#9f9279]"
              }`}
            >
              {index === activeIndex ? stepTitle : `Stage ${index + 1}`}
            </span>
          );
        })}
      </div>
    </div>
  );
}
