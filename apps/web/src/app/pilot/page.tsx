"use client";

import { useState } from "react";
import Link from "next/link";
import { onboardPilotSelfServe, requestPilotEmailVerificationCode } from "@/lib/api";

const BUSINESS_SIZES = [
  { value: "1_5", label: "1–5 employees" },
  { value: "6_20", label: "6–20" },
  { value: "21_50", label: "21–50" },
  { value: "51_PLUS", label: "51+" },
] as const;

const VOLUMES = [
  { value: "UNDER_10", label: "Under 10 / mo" },
  { value: "UNDER_50", label: "10–50 / mo" },
  { value: "UNDER_200", label: "50–200 / mo" },
  { value: "OVER_200", label: "200+ / mo" },
] as const;

/** Display pricing (align with Stripe price IDs in env; shown before checkout). */
const TIER_PRICING: Record<"STARTER" | "PRO", { monthly: number; yearly: number; label: string }> = {
  STARTER: { monthly: 799, yearly: 7990, label: "Starter" },
  PRO: { monthly: 2499, yearly: 24990, label: "Pro" },
};

export default function PilotPage() {
  const [dealerName, setDealerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [businessSize, setBusinessSize] = useState<(typeof BUSINESS_SIZES)[number]["value"]>("6_20");
  const [expectedMonthlyVolume, setExpectedMonthlyVolume] = useState<(typeof VOLUMES)[number]["value"]>("UNDER_50");
  const [tier, setTier] = useState<"STARTER" | "PRO">("STARTER");
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const price = TIER_PRICING[tier];
  const displayPrice = interval === "yearly" ? price.yearly : price.monthly;
  const period = interval === "yearly" ? "/year (billed annually)" : "/mo";

  async function sendCode() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Enter a valid business email first.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await requestPilotEmailVerificationCode(email.trim());
      setCodeSent(true);
      setMsg("Check your inbox for a 6-digit code (and the server log if email is not configured).");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    setMsg("");
    try {
      const out = await onboardPilotSelfServe({
        email: email.trim(),
        dealerName,
        password,
        businessSize,
        expectedMonthlyVolume,
        tier,
        interval,
        captchaToken: "dev-placeholder",
        enableDemoData: true,
        emailVerificationCode: verificationCode.trim() || undefined,
      });
      if (out.checkout?.url) {
        window.location.href = out.checkout.url;
        return;
      }
      setMsg(
        `Pilot tenant ready (${out.tenantId}). Stripe checkout is not configured; sign in to CRM with ${email}. Demo appraisal: ${out.demoAppraisalUrl ?? "—"}`
      );
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem", lineHeight: 1.5 }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Pilot onboarding</h1>
      <p style={{ color: "var(--text-muted, #888)", marginBottom: "1.25rem" }}>
        Verify your email, then continue to Stripe. You get a tenant, CRM access, automatic subdomain routing, and a
        shareable appraisal link.
      </p>

      <section
        style={{
          marginBottom: "1rem",
          padding: "0.85rem",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Pricing preview</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted, #aaa)", marginBottom: "0.5rem" }}>
          First month is collected at checkout via Stripe (configure <code>STRIPE_PRICE_STARTER</code> /{" "}
          <code>STRIPE_PRICE_PRO</code> to match these SKUs).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.92rem" }}>
          <div>
            <strong>Starter</strong>
            <br />${TIER_PRICING.STARTER.monthly.toLocaleString()}
            /mo · ${TIER_PRICING.STARTER.yearly.toLocaleString()}/yr
          </div>
          <div>
            <strong>Pro</strong>
            <br />${TIER_PRICING.PRO.monthly.toLocaleString()}
            /mo · ${TIER_PRICING.PRO.yearly.toLocaleString()}/yr
          </div>
        </div>
      </section>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          placeholder="Dealership name"
          value={dealerName}
          onChange={(e) => setDealerName(e.target.value)}
          style={inputStyle}
          autoComplete="organization"
        />
        <input
          placeholder="Business email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          autoComplete="email"
        />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={() => void sendCode()} disabled={loading} style={secondaryBtn}>
            {codeSent ? "Resend code" : "Send verification code"}
          </button>
          {codeSent && <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Code sent.</span>}
        </div>
        <input
          placeholder="6-digit email code"
          inputMode="numeric"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          style={inputStyle}
          autoComplete="one-time-code"
        />
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #777)" }}>
          Dev: set <code>PILOT_SKIP_EMAIL_VERIFY=1</code> on the API to skip the code requirement.
        </p>
        <input
          placeholder="Password (min 8 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
        />

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Business size</span>
          <select
            value={businessSize}
            onChange={(e) => setBusinessSize(e.target.value as typeof businessSize)}
            style={inputStyle}
          >
            {BUSINESS_SIZES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Expected monthly appraisal volume</span>
          <select
            value={expectedMonthlyVolume}
            onChange={(e) => setExpectedMonthlyVolume(e.target.value as typeof expectedMonthlyVolume)}
            style={inputStyle}
          >
            {VOLUMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Plan</span>
            <select value={tier} onChange={(e) => setTier(e.target.value as "STARTER" | "PRO")} style={inputStyle}>
              <option value="STARTER">Starter</option>
              <option value="PRO">Pro</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Billing interval</span>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value as "monthly" | "yearly")}
              style={inputStyle}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
        </div>
        <p style={{ fontSize: "0.95rem", margin: 0 }}>
          Selected: <strong>{price.label}</strong> — <strong>${displayPrice.toLocaleString()}</strong>
          {period}
        </p>

        <button
          type="button"
          onClick={() => void submit()}
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.65rem 1rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            borderRadius: 8,
            border: "none",
            background: "var(--accent, #c9a227)",
            color: "#111",
          }}
        >
          {loading ? "Starting…" : "Continue to checkout"}
        </button>
      </div>

      {msg && (
        <p style={{ marginTop: "1rem", color: "var(--text-muted, #aaa)" }} role="status">
          {msg}
        </p>
      )}

      <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
        <Link href="/dealer/pilot" style={{ color: "var(--accent, #c9a227)" }}>
          Already enrolled? Open pilot dashboard
        </Link>
      </p>
    </main>
  );
}

const inputStyle = {
  padding: "0.5rem 0.65rem",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "var(--bg-card, #1a1a1a)",
  color: "inherit",
} as const;

const secondaryBtn = {
  padding: "0.45rem 0.75rem",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
} as const;
