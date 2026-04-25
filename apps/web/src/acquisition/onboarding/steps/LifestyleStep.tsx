"use client";

import type { QuestionDefinition } from "@/acquisition/types/contracts";
import { useAcquisitionState } from "@/acquisition/state";
import { ACQUISITION_THEME } from "@/acquisition/config/acquisition-theme";

const QUESTION: QuestionDefinition = {
  id: "lifestyle-signals",
  type: "multi",
  label: "Lifestyle signals",
  options: [
    "Urban driving",
    "Highway touring",
    "Collector events",
    "Business presence",
    "Weekend escapes",
    "Stealth preference",
  ],
  helperText: "Choose all that apply to your ownership rhythm.",
};

const EMOTIONS: QuestionDefinition = {
  id: "desired-emotion",
  type: "multi",
  label: "Desired ownership emotion",
  options: ["Stealth confidence", "Raw drama", "Elegant status", "Collector significance", "Technical precision"],
};

export function LifestyleStep() {
  const { profile, dispatch } = useAcquisitionState();

  const toggleLifestyle = (value: string) => {
    const next = profile.lifestyle.includes(value)
      ? profile.lifestyle.filter((entry) => entry !== value)
      : [...profile.lifestyle, value];
    dispatch({ type: "SET_FIELD", payload: { lifestyle: next } });
  };

  const toggleEmotion = (value: string) => {
    const next = profile.desiredEmotion.includes(value)
      ? profile.desiredEmotion.filter((entry) => entry !== value)
      : [...profile.desiredEmotion, value];
    dispatch({ type: "SET_FIELD", payload: { desiredEmotion: next } });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: ACQUISITION_THEME.colors.goldSoft }}>
          {QUESTION.label}
        </p>
        <p className="mt-2 text-sm text-[#cfc6b8]">{QUESTION.helperText}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUESTION.options?.map((option) => {
            const active = profile.lifestyle.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleLifestyle(option)}
                className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition"
                style={{
                  borderColor: active ? "rgba(241,211,138,0.55)" : "rgba(255,255,255,0.12)",
                  background: active ? "rgba(212,175,55,0.16)" : "rgba(255,255,255,0.03)",
                  color: active ? "#fff8eb" : "#d8d0c2",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: ACQUISITION_THEME.colors.goldSoft }}>
          {EMOTIONS.label}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EMOTIONS.options?.map((option) => {
            const active = profile.desiredEmotion.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleEmotion(option)}
                className="rounded-[1rem] border px-4 py-3 text-left text-sm transition"
                style={{
                  borderColor: active ? "rgba(241,211,138,0.5)" : "rgba(255,255,255,0.12)",
                  background: active ? "rgba(241,211,138,0.11)" : "rgba(255,255,255,0.02)",
                  color: active ? "#fff8eb" : "#d8d0c2",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
