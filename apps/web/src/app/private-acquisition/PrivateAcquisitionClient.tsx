"use client";

import { useEffect, useMemo, useState } from "react";
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

const wizardSteps = ["intro", "basics", "budget", "ownership", "intent", "review", "processing"] as const;
type WizardStep = (typeof wizardSteps)[number];
const STORAGE_KEY = "vex.privateAcquisition.profile";

function isWizardStep(value: string | null): value is WizardStep {
  return Boolean(value && wizardSteps.includes(value as WizardStep));
}

export function PrivateAcquisitionClient() {
  const router = useRouter();

  const [profile, setProfile] = useState<AcquisitionProfile>(defaultAcquisitionProfile);
  const [step, setStep] = useState<WizardStep>("intro");
  const [error, setError] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsedSaved = acquisitionProfileSchema.safeParse(JSON.parse(saved));
        if (parsedSaved.success) {
          setProfile(parsedSaved.data as AcquisitionProfileInput as AcquisitionProfile);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const requested = new URLSearchParams(window.location.search).get("step");
    if (isWizardStep(requested)) {
      setStep(requested);
    }
  }, []);

  const updateStep = (nextStep: WizardStep) => {
    setStep(nextStep);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("step", nextStep);
      window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    } else {
      router.replace(`/private-acquisition?step=${nextStep}`, { scroll: false });
    }
  };

  const canSubmit = useMemo(() => {
    return profile.clientName.trim().length > 1 && profile.email.includes("@") && profile.location.trim().length > 1;
  }, [profile]);

  const updateProfile = <K extends keyof AcquisitionProfile>(key: K, value: AcquisitionProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    const idx = wizardSteps.indexOf(step);
    const maybeNext = wizardSteps[idx + 1];
    if (maybeNext && maybeNext !== "processing") {
      updateStep(maybeNext);
    }
  };

  const previousStep = () => {
    const idx = wizardSteps.indexOf(step);
    const maybePrevious = wizardSteps[idx - 1];
    if (maybePrevious) {
      updateStep(maybePrevious);
    }
  };

  const reset = () => {
    setProfile(defaultAcquisitionProfile);
    setError(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    updateStep("intro");
  };

  const run = async () => {
    setError(null);
    const parsed = acquisitionProfileSchema.safeParse(profile);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Profile is incomplete.");
      return;
    }
    updateStep("processing");
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
        {hydrated ? <span data-testid="acq-hydrated" className="sr-only">hydrated</span> : null}

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Wizard progress" data-testid="acq-step-nav">
          {wizardSteps.slice(1, -1).map((wizardStep) => (
            <span
              key={wizardStep}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${step === wizardStep ? "border-[#f1d38a]/60 text-[#f1d38a]" : "border-white/10 text-[var(--text-muted)]"}`}
              aria-current={step === wizardStep ? "step" : undefined}
            >
              {wizardStep}
            </span>
          ))}
        </nav>

        {step === "intro" ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-6" data-testid="acq-intro-step">
            <h2 className="text-2xl text-[#fff8eb]">Private Acquisition Concierge</h2>
            <p className="mt-3 text-sm text-[var(--text-soft)]">Begin a guided consultation to generate a personalized acquisition report with recommendations, projections, and market risk advisory.</p>
            <div className="mt-5 flex gap-3">
              <button className="gold-button" disabled={!hydrated} onClick={() => updateStep("basics")} data-testid="acq-begin-consultation">Begin Consultation</button>
            </div>
          </section>
        ) : null}

        {step === "basics" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="acq-step-basics">
            <label className="text-sm">Name<input className="field-base mt-2" value={profile.clientName} onChange={(event) => updateProfile("clientName", event.target.value)} /></label>
            <label className="text-sm">Email<input className="field-base mt-2" value={profile.email} onChange={(event) => updateProfile("email", event.target.value)} /></label>
            <label className="text-sm">Phone (optional)<input className="field-base mt-2" value={profile.phone ?? ""} onChange={(event) => updateProfile("phone", event.target.value)} /></label>
            <label className="text-sm">Location<input className="field-base mt-2" value={profile.location} onChange={(event) => updateProfile("location", event.target.value)} /></label>
          </div>
        ) : null}

        {step === "budget" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="acq-step-budget">
            <label className="text-sm">Budget Minimum<input className="field-base mt-2" type="number" value={profile.budget.minimum} onChange={(event) => updateProfile("budget", { ...profile.budget, minimum: Number(event.target.value) })} /></label>
            <label className="text-sm">Budget Comfortable<input className="field-base mt-2" type="number" value={profile.budget.comfortable} onChange={(event) => updateProfile("budget", { ...profile.budget, comfortable: Number(event.target.value) })} /></label>
            <label className="text-sm">Budget Maximum<input className="field-base mt-2" type="number" value={profile.budget.maximum} onChange={(event) => updateProfile("budget", { ...profile.budget, maximum: Number(event.target.value) })} /></label>
            <label className="text-sm">Monthly Comfort<input className="field-base mt-2" type="number" value={profile.budget.monthlyComfort ?? 0} onChange={(event) => updateProfile("budget", { ...profile.budget, monthlyComfort: Number(event.target.value) })} /></label>
          </div>
        ) : null}

        {step === "ownership" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="acq-step-ownership">
            <label className="text-sm">Annual Mileage<input className="field-base mt-2" type="number" value={profile.ownership.annualMileage} onChange={(event) => updateProfile("ownership", { ...profile.ownership, annualMileage: Number(event.target.value) })} /></label>
            <label className="text-sm">Expected Duration (years)
              <select className="field-base mt-2" value={profile.ownership.expectedDurationYears} onChange={(event) => updateProfile("ownership", { ...profile.ownership, expectedDurationYears: Number(event.target.value) as AcquisitionProfile["ownership"]["expectedDurationYears"] })}>
                {[1, 2, 3, 4, 5, 6, 7].map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="text-sm">Reliability Importance
              <select className="field-base mt-2" value={profile.ownership.reliabilityImportance} onChange={(event) => updateProfile("ownership", { ...profile.ownership, reliabilityImportance: event.target.value as AcquisitionProfile["ownership"]["reliabilityImportance"] })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
            <label className="text-sm">Depreciation Sensitivity
              <select className="field-base mt-2" value={profile.ownership.depreciationSensitivity} onChange={(event) => updateProfile("ownership", { ...profile.ownership, depreciationSensitivity: event.target.value as AcquisitionProfile["ownership"]["depreciationSensitivity"] })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
          </div>
        ) : null}

        {step === "intent" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="acq-step-intent">
            <label className="text-sm">Primary Use Case
              <select className="field-base mt-2" value={profile.useCases[0]} onChange={(event) => updateProfile("useCases", [event.target.value as AcquisitionProfile["useCases"][number]])}>
                <option value="daily">Daily</option><option value="weekend">Weekend</option><option value="collector">Collector</option><option value="business-image">Business image</option><option value="track">Track</option><option value="lifestyle">Luxury lifestyle</option>
              </select>
            </label>
            <label className="text-sm">Emotional Intent
              <select className="field-base mt-2" value={profile.emotionalIntent[0]} onChange={(event) => updateProfile("emotionalIntent", [event.target.value as AcquisitionProfile["emotionalIntent"][number]])}>
                <option value="understated">Understated</option><option value="exotic">Exotic</option><option value="aggressive">Aggressive</option><option value="elegant">Elegant</option><option value="rare">Rare</option><option value="comfortable">Comfortable</option><option value="high-tech">High-tech</option><option value="analog-raw">Analog/raw</option>
              </select>
            </label>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="mt-8 space-y-5" data-testid="acq-review-step">
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-xl text-[#fff8eb]">Review Your Acquisition Profile</h2>
              <p className="mt-3 text-sm text-[var(--text-soft)]">{profile.clientName} · {profile.email} · {profile.location}</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Budget: ${profile.budget.minimum.toLocaleString()} - ${profile.budget.maximum.toLocaleString()}</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Use case: {profile.useCases.join(", ")} · Intent: {profile.emotionalIntent.join(", ")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="ghost-button" onClick={previousStep} data-testid="acq-previous">Previous</button>
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

        {step !== "intro" && step !== "review" && step !== "processing" ? (
          <div className="mt-6 flex flex-wrap gap-3" data-testid="acq-step-controls">
            <button className="ghost-button" onClick={previousStep} data-testid="acq-previous">Previous</button>
            <button className="gold-button" onClick={nextStep} data-testid="acq-next">Next</button>
            <button className="ghost-button" onClick={reset}>Reset</button>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-300" role="alert">{error}</p> : null}
      </section>
    </main>
  );
}
