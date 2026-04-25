"use client";

import { useMemo } from "react";
import Link from "next/link";
import { acquisitionSteps } from "@/acquisition/flow/WizardConfig";
import { useAcquisitionNavigation } from "@/acquisition/hooks/useAcquisitionNavigation";
import { useAcquisitionState } from "@/acquisition/state";
import { AcquisitionProgressBar } from "@/acquisition/components/AcquisitionProgressBar";

export function AcquisitionWizard() {
  const { profile, state, dispatch } = useAcquisitionState();
  const { activeStepId, activeIndex, total, setStep, nextStep, previousStep } = useAcquisitionNavigation();

  const step = useMemo(() => acquisitionSteps.find((candidate) => candidate.id === activeStepId) ?? acquisitionSteps[0], [activeStepId]);
  const StepComponent = step.component;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= total - 1;

  return (
    <section className="rounded-[2rem] border border-[#f1d38a]/20 bg-[linear-gradient(150deg,rgba(12,11,10,0.95),rgba(22,20,18,0.92))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] sm:p-8">
      <AcquisitionProgressBar current={activeIndex + 1} total={total} stepTitle={step.title} />

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#f1d38a]/76">Step {activeIndex + 1}</p>
          <button
            type="button"
            className="rounded-full border border-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-[#d9cfbe] transition hover:border-[#f1d38a]/42 hover:text-[#fff8eb]"
            onClick={() => dispatch({ type: "RESET" })}
          >
            Reset
          </button>
        </div>
        <h2 className="mt-3 text-2xl text-[#fff8eb]">{step.title}</h2>
        <p className="mt-2 text-sm leading-7 text-[#cfc6b8]">{step.description}</p>

        <div className="mt-6">
          <StepComponent profile={profile} dispatch={dispatch} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {acquisitionSteps.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => setStep(candidate.id)}
              className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] transition ${
                index === activeIndex
                  ? "border-[#f1d38a]/50 bg-[#d4af37]/14 text-[#fff2d2]"
                  : "border-white/10 text-[#bdb4a8] hover:border-white/24 hover:text-[#f8f3ea]"
              }`}
            >
              {candidate.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={previousStep}
            disabled={isFirst}
            className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#d8cdbd] transition hover:border-white/28 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full border border-[#f1d38a]/46 bg-[linear-gradient(135deg,rgba(241,211,138,0.24),rgba(212,175,55,0.2))] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#fff6de] transition hover:border-[#f1d38a]/72"
            >
              Continue
            </button>
          ) : (
            <Link
              href="/private-acquisition/report-preview"
              className="rounded-full border border-[#f1d38a]/52 bg-[linear-gradient(135deg,rgba(241,211,138,0.28),rgba(212,175,55,0.22))] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#fff6de] transition hover:border-[#f1d38a]/75"
            >
              Generate Preview
            </Link>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs leading-6 text-[#aa9f8e]">
        Progress is saved locally and can be resumed anytime from this device.
      </p>
    </section>
  );
}
