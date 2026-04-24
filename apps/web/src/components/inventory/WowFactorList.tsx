import { typography } from "@vex/design-system";

export function WowFactorList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-2" : "grid gap-3"}>
      {items.map((item) => (
        <div
          key={item}
          className="group flex items-start gap-3 rounded-[1rem] px-3 py-2 text-sm leading-6 text-[#e6dece] transition duration-500 hover:bg-white/[0.035]"
        >
          <span
            className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[#f1d38a] shadow-[0_0_0_5px_rgba(212,175,55,0.08)] transition duration-500 group-hover:shadow-[0_0_0_6px_rgba(212,175,55,0.12)]"
            aria-hidden="true"
          />
          <span style={typography.bodyStandard}>{item}</span>
        </div>
      ))}
    </div>
  );
}
