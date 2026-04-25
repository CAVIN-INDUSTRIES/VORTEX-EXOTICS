"use client";

import type { AcquisitionStepComponentProps } from "@/acquisition/types/contracts";
import { acquisitionTheme } from "@/acquisition/config/acquisition-theme";

function includes(list: string[], value: string) {
  return list.includes(value);
}

export function LifestyleStep({ profile, onProfilePatch, questions }: AcquisitionStepComponentProps) {
  const lifestyleQuestion = questions.find((question) => question.id === "lifestyle");
  const emotionQuestion = questions.find((question) => question.id === "desiredEmotion");

  const toggleLifestyle = (value: string) => {
    const next = includes(profile.lifestyle, value)
      ? profile.lifestyle.filter((entry) => entry !== value)
      : [...profile.lifestyle, value];
    onProfilePatch({ lifestyle: next });
  };

  const toggleEmotion = (value: string) => {
    const next = includes(profile.desiredEmotion, value)
      ? profile.desiredEmotion.filter((entry) => entry !== value)
      : [...profile.desiredEmotion, value];
    onProfilePatch({ desiredEmotion: next });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: acquisitionTheme.colors.softGoldBright }}>
          {lifestyleQuestion?.label ?? "Lifestyle signals"}
        </p>
        <p className="mt-2 text-sm text-[#cfc6b8]">{lifestyleQuestion?.helperText ?? "Choose all that apply to your ownership rhythm."}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {(lifestyleQuestion?.options ?? []).map((option) => {
            const active = includes(profile.lifestyle, option);
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
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: acquisitionTheme.colors.softGoldBright }}>
          {emotionQuestion?.label ?? "Desired ownership emotion"}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(emotionQuestion?.options ?? []).map((option) => {
            const active = includes(profile.desiredEmotion, option);
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
