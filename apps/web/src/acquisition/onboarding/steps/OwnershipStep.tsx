"use client";

import type { QuestionDefinition } from "@/acquisition/types/contracts";
import type { AcquisitionStepProps } from "@/acquisition/onboarding/types";

function renderQuestion(question: QuestionDefinition, props: AcquisitionStepProps) {
  const { profile, dispatch } = props;
  if (question.id === "ownershipIntent") {
    const current = profile.ownershipIntent;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {(question.options ?? []).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              dispatch({
                type: "set-field",
                field: "ownershipIntent",
                value: option,
              })
            }
            className={`rounded-[1rem] border px-4 py-3 text-left transition ${
              current === option
                ? "border-[#f1d38a]/55 bg-[#d4af37]/14 text-[#fff8eb]"
                : "border-white/10 bg-white/[0.03] text-[#d8d0c2] hover:border-[#f1d38a]/30"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.id === "ownershipDurationMonths") {
    const current = profile.ownershipDurationMonths;
    return (
      <label className="grid gap-2">
        <span className="text-sm text-[#d8d0c2]">{question.label}</span>
        <input
          type="range"
          min={question.min ?? 6}
          max={question.max ?? 120}
          step={question.step ?? 6}
          value={current}
          onChange={(event) =>
            dispatch({
              type: "set-field",
              field: "ownershipDurationMonths",
              value: Number(event.target.value),
            })
          }
        />
        <span className="text-xs uppercase tracking-[0.18em] text-[#bcae97]">{current} months target</span>
      </label>
    );
  }

  return null;
}

export function OwnershipStep(props: AcquisitionStepProps) {
  return (
    <section className="grid gap-5">
      {props.questions.map((question) => (
        <div key={question.id} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
          {renderQuestion(question, props)}
        </div>
      ))}
    </section>
  );
}
