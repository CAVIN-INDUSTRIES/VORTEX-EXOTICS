"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { runAcquisitionEngine } from "@/acquisition/engine/runAcquisitionEngine";
import { defaultAcquisitionProfile } from "@/acquisition/mock/defaultProfile";
import { AcquisitionProfileInput, acquisitionProfileSchema } from "@/acquisition/schemas/acquisitionSchemas";
import { AcquisitionProfile } from "@/acquisition/types/contracts";

const processingMessages = [
  "Reviewing ownership profile",
  "Matching vehicle candidates",
  "Modeling depreciation exposure",
  "Comparing ownership costs",
  "Preparing advisor report",
];

export function PrivateAcquisitionClient() {
  const [profile, setProfile] = useState<AcquisitionProfile>(defaultAcquisitionProfile);
  const [step, setStep] = useState<"wizard" | "review" | "processing">("wizard");
  const [error, setError] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);
  const router = useRouter();

  const canSubmit = useMemo(() => {
    return profile.clientName.trim().length > 1 && profile.email.includes("@") && profile.location.trim().length > 1;
  }, [profile]);

  const updateProfile = <K extends keyof AcquisitionProfile>(key: K, value: AcquisitionProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const run = async () => {
    setError(null);
    const parsed = acquisitionProfileSchema.safeParse(profile);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Profile is incomplete.");
      return;
    }
    setStep("processing");
    for (let i = 0; i < processingMessages.length; i += 1) {
      setProcessingIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 320));
    }
    const result = runAcquisitionEngine(parsed.data as AcquisitionProfileInput as AcquisitionProfile);
    sessionStorage.setItem("vex.privateAcquisition.report", JSON.stringify(result.report));
    router.push("/private-acquisition/report-preview");
  };

  return (
    <main className="shell py-10" data-testid="private-acquisition-root">
      <section className="cinema-panel rounded-3xl p-6 md:p-10">
        <p className="section-kicker">Private Source Acquisition</p>
        <h1 className="section-title">Acquisition Intelligence Consultation</h1>
        <p className="section-copy">A premium, advisor-style workflow designed for private luxury and exotic vehicle sourcing.</p>

        {step === "wizard" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="acq-wizard-step">
            <label className="text-sm">Name<input className="field-base mt-2" value={profile.clientName} onChange={(event) => updateProfile("clientName", event.target.value)} /></label>
            <label className="text-sm">Email<input className="field-base mt-2" value={profile.email} onChange={(event) => updateProfile("email", event.target.value)} /></label>
            <label className="text-sm">Phone (optional)<input className="field-base mt-2" value={profile.phone ?? ""} onChange={(event) => updateProfile("phone", event.target.value)} /></label>
            <label className="text-sm">Location<input className="field-base mt-2" value={profile.location} onChange={(event) => updateProfile("location", event.target.value)} /></label>
            <label className="text-sm">Budget Minimum<input className="field-base mt-2" type="number" value={profile.budget.minimum} onChange={(event) => updateProfile("budget", { ...profile.budget, minimum: Number(event.target.value) })} /></label>
            <label className="text-sm">Budget Comfortable<input className="field-base mt-2" type="number" value={profile.budget.comfortable} onChange={(event) => updateProfile("budget", { ...profile.budget, comfortable: Number(event.target.value) })} /></label>
            <label className="text-sm">Budget Maximum<input className="field-base mt-2" type="number" value={profile.budget.maximum} onChange={(event) => updateProfile("budget", { ...profile.budget, maximum: Number(event.target.value) })} /></label>
            <label className="text-sm">Annual Mileage<input className="field-base mt-2" type="number" value={profile.ownership.annualMileage} onChange={(event) => updateProfile("ownership", { ...profile.ownership, annualMileage: Number(event.target.value) })} /></label>
            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button className="gold-button" onClick={() => setStep("review")} data-testid="acq-review-button">Review Your Acquisition Profile</button>
              <button className="ghost-button" onClick={() => setProfile(defaultAcquisitionProfile)}>Reset</button>
            </div>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="mt-8 space-y-5" data-testid="acq-review-step">
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-xl text-[#fff8eb]">Review Your Acquisition Profile</h2>
              <p className="mt-3 text-sm text-[var(--text-soft)]">{profile.clientName} · {profile.email} · {profile.location}</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Budget: ${profile.budget.minimum.toLocaleString()} - ${profile.budget.maximum.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button className="ghost-button" onClick={() => setStep("wizard")}>Edit Step</button>
              <button className="gold-button" disabled={!canSubmit} onClick={run} data-testid="acq-generate-report">Generate Report</button>
            </div>
          </div>
        ) : null}

        {step === "processing" ? (
          <div className="mt-8 rounded-2xl border border-[#f1d38a]/25 bg-black/30 p-6" aria-live="polite" data-testid="acq-processing">
            <h2 className="text-xl text-[#fff8eb]">Building your acquisition intelligence profile...</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
              {processingMessages.map((message, index) => (
                <li key={message} className={index <= processingIndex ? "text-[#f1d38a]" : "opacity-60"}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-300" role="alert">{error}</p> : null}
      </section>
    </main>
  );
}
