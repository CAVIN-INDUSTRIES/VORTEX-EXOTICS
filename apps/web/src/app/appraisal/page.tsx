"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { createAppraisal } from "@/lib/api";
import styles from "./appraisal.module.css";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const m = mileage === "" ? undefined : Number(mileage);
    if (mileage !== "" && Number.isNaN(Number(mileage))) {
      setError("Mileage must be a number.");
      return;
    }
    const vinTrim = vin.trim();
    const hasVin = vinTrim.length === 17;
    if (vinTrim.length > 0 && !hasVin) {
      setError("VIN must be exactly 17 characters (letters and digits, no I/O/Q).");
      return;
    }
    const hasNotes = notes.trim().length > 0;
    if (!hasVin && m === undefined && !condition && !hasNotes) {
      setError("Enter at least mileage and condition, a full VIN, or notes.");
      return;
    }

    setLoading(true);
    try {
      const data = await createAppraisal(
        {
          ...(hasVin ? { vin: vinTrim.toUpperCase() } : {}),
          ...(m !== undefined && !Number.isNaN(m) ? { mileage: Math.max(0, Math.floor(m)) } : {}),
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
    <>
      <Header />
      <main id="main-content" className={styles.main}>
        <h1 className={styles.title}>Trade-in intake</h1>
        <p className={styles.subtitle}>
          Submit your vehicle for review. Your dealer will follow up shortly — no account required.
        </p>

        {result ? (
          <div className={styles.result}>
            <p className={styles.estimateLabel}>Submitted</p>
            <p className={styles.estimateValue} style={{ fontSize: "1.1rem" }}>
              {result.message}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Reference: {result.id}</p>
            <Link href={`/checkout?tradeInId=${result.id}`} className={styles.cta}>
              Continue to checkout
            </Link>
            <Link href="/checkout" className={styles.ctaSecondary}>
              Back to checkout
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              VIN (optional, 17 chars)
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className={styles.input}
                placeholder="e.g. 1HGBH41JXMN109186"
                maxLength={17}
                autoComplete="off"
              />
            </label>
            <label className={styles.label}>
              Mileage
              <input
                type="number"
                min={0}
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className={styles.input}
                placeholder="e.g. 15000"
              />
            </label>
            <label className={styles.label}>
              Condition
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as (typeof CONDITIONS)[number] | "")}
                className={styles.input}
              >
                <option value="">— Select —</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Notes (optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.input}
                rows={3}
                maxLength={2000}
                placeholder="Anything the dealer should know"
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.cta}>
              {loading ? "Submitting…" : "Submit for review"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default function AppraisalPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className={styles.main}>
          <p className={styles.subtitle}>Loading…</p>
        </main>
      }
    >
      <AppraisalForm />
    </Suspense>
  );
}
