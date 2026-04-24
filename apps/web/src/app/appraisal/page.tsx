"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createAppraisal } from "@/lib/api";
import { MotionReveal } from "@/components/site/MotionReveal";

const CONDITIONS = ["excellent", "good", "fair", "poor"] as const;

function AppraisalForm() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId");
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number] | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const parsedMileage = mileage === "" ? undefined : Number(mileage);
    if (mileage !== "" && Number.isNaN(parsedMileage)) {
      setError("Mileage must be a number.");
      return;
    }

    const vinTrim = vin.trim();
    const hasVin = vinTrim.length === 17;
    if (vinTrim.length > 0 && !hasVin) {
      setError("VIN must be exactly 17 characters.");
      return;
    }

    const hasNotes = notes.trim().length > 0;
    if (!hasVin && parsedMileage === undefined && !condition && !hasNotes) {
      setError("Enter at least mileage and condition, a full VIN, or notes.");
      return;
    }

    setLoading(true);
    try {
      const data = await createAppraisal(
        {
          ...(hasVin ? { vin: vinTrim.toUpperCase() } : {}),
          ...(parsedMileage !== undefined && !Number.isNaN(parsedMileage)
            ? { mileage: Math.max(0, Math.floor(parsedMileage)) }
            : {}),
          ...(condition ? { condition } : {}),
          ...(hasNotes ? { notes: notes.trim() } : {}),
        },
        { tenantId }
      );
      setResult({ id: data.id, message: data.message });
    } catch {
      setError("Failed to submit appraisal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <MotionReveal className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="glass-panel rounded-[2rem] p-7 sm:p-9">
          <p className="section-kicker">Trade-in intake</p>
          <h1 className="section-title">A premium vehicle review flow without the friction.</h1>
          <p className="section-copy max-w-xl">
            Submit the vehicle for review and your dealer will follow up shortly. No account required,
            no noisy onboarding, just the details needed to start a serious conversation.
          </p>
        </div>

        <div className="cinema-panel rounded-[2rem] p-7 sm:p-9">
          {result ? (
            <div>
              <p className="section-kicker">Submitted</p>
              <p className="mt-4 text-3xl text-[#fff8eb]">{result.message}</p>
              <p className="mt-3 text-sm text-[#bcae97]">Reference: {result.id}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href={`/checkout?tradeInId=${result.id}`} className="gold-button">
                  Continue to checkout
                </Link>
                <Link href="/checkout" className="ghost-button">
                  Back to checkout
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-[#ddd4c6]">VIN (optional, 17 chars)</span>
                <input
                  type="text"
                  value={vin}
                  onChange={(event) => setVin(event.target.value.toUpperCase())}
                  className="field-base"
                  placeholder="e.g. 1HGBH41JXMN109186"
                  maxLength={17}
                  autoComplete="off"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#ddd4c6]">Mileage</span>
                <input
                  type="number"
                  min={0}
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  className="field-base"
                  placeholder="e.g. 15000"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#ddd4c6]">Condition</span>
                <select
                  value={condition}
                  onChange={(event) => setCondition(event.target.value as (typeof CONDITIONS)[number] | "")}
                  className="field-base"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#ddd4c6]">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="field-base min-h-32"
                  rows={4}
                  maxLength={2000}
                  placeholder="Anything the dealer should know"
                />
              </label>

              {error ? <p className="rounded-[1.2rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
              <button type="submit" disabled={loading} className="gold-button w-full">
                {loading ? "Submitting..." : "Submit for review"}
              </button>
            </form>
          )}
        </div>
      </MotionReveal>
    </main>
  );
}

export default function AppraisalPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="shell py-20">
          <p className="text-[#d8d0c2]">Loading...</p>
        </main>
      }
    >
      <AppraisalForm />
    </Suspense>
  );
}
