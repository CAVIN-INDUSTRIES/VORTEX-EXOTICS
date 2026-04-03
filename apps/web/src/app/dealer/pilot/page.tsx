"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getBillingUsage, inviteFirstCustomer, submitPilotNps } from "@/lib/api";

const POLL_MS = 15_000;

function qrDataUrlForLink(url: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(url)}`;
}

function DealerPilotDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, loading: authLoading } = useAuth();
  const [usage, setUsage] = useState<Awaited<ReturnType<typeof getBillingUsage>> | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [nps, setNps] = useState(8);
  const [npsMessage, setNpsMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [postCheckout, setPostCheckout] = useState(false);

  const loadUsage = useCallback(async () => {
    if (!token) return;
    setMsg("");
    try {
      const data = await getBillingUsage(token);
      setUsage(data);
    } catch (e) {
      setMsg((e as Error).message);
    }
  }, [token]);

  useEffect(() => {
    if (token) void loadUsage();
  }, [token, loadUsage]);

  useEffect(() => {
    if (!token) return;
    const t = setInterval(() => void loadUsage(), POLL_MS);
    return () => clearInterval(t);
  }, [token, loadUsage]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("vex_pilot_post_checkout") === "1") {
        setPostCheckout(true);
      }
    } catch {
      // ignore
    }
    const stripe = searchParams.get("stripe");
    if (stripe === "success") {
      setPostCheckout(true);
      try {
        sessionStorage.setItem("vex_pilot_post_checkout", "1");
      } catch {
        // ignore
      }
      setToast("Payment received — your pilot workspace is live.");
      router.replace("/dealer/pilot", { scroll: false });
      const t = setTimeout(() => setToast(null), 9000);
      return () => clearTimeout(t);
    }
    if (stripe === "cancel") {
      setToast("Checkout was cancelled — you can return to /pilot anytime to finish enrollment.");
      const t = setTimeout(() => setToast(null), 10000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [searchParams, router]);

  async function invite() {
    if (!token) return setMsg("Login required");
    if (!inviteEmail.trim()) return setMsg("Enter a customer email or use “Copy invite link” below.");
    try {
      await inviteFirstCustomer(token, { email: inviteEmail.trim() });
      setMsg("Invite recorded as a lead.");
      setInviteEmail("");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  async function copyInviteLink() {
    const url = usage?.pilot?.inviteCustomerUrl;
    if (!url || typeof navigator === "undefined" || !navigator.clipboard) {
      setMsg("Could not copy link.");
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMsg("Branded marketplace link copied.");
  }

  async function submitNps() {
    if (!token) return setMsg("Login required");
    try {
      await submitPilotNps(token, { rating: nps, message: npsMessage || "Pilot feedback" });
      setMsg("Thanks — feedback recorded.");
      setNpsMessage("");
      await loadUsage();
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  const cap = usage?.valuation.dailyCapUsd ?? 5;
  const spent = usage?.valuation.spentTodayUsd ?? 0;
  const pct = cap > 0 ? Math.min(100, (spent / cap) * 100) : 0;
  const pilot = usage?.pilot;
  const showNps = pilot?.showNpsAfterFirstAppraisalClose ?? false;
  const projRem = usage?.valuation.projectedRemainingEodUsd;
  const inviteUrl = pilot?.inviteCustomerUrl ?? "";

  if (authLoading) {
    return (
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
        <p style={{ color: "var(--text-muted, #888)" }}>Loading…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Dealer pilot dashboard</h1>
        <p style={{ marginBottom: "1rem" }}>Sign in with your pilot admin account to view usage and invite customers.</p>
        <Link href="/login" style={{ color: "var(--accent, #c9a227)" }}>
          Go to login
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem", lineHeight: 1.5 }}>
      {toast && (
        <div
          role="status"
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            background: "rgba(201,162,39,0.15)",
            border: "1px solid rgba(201,162,39,0.4)",
            color: "var(--text-primary, #eee)",
          }}
        >
          {toast}
        </div>
      )}
      {postCheckout && inviteUrl && (
        <section
          style={{
            marginBottom: "1.25rem",
            padding: "1.1rem 1.25rem",
            borderRadius: 10,
            border: "1px solid rgba(201,162,39,0.45)",
            background: "linear-gradient(135deg, rgba(201,162,39,0.14) 0%, rgba(255,255,255,0.04) 100%)",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 0.5rem" }}>You are live — run your first appraisal</h2>
          <p style={{ margin: "0 0 0.85rem", fontSize: "0.92rem", color: "var(--text-muted, #bbb)" }}>
            Payment is on file. Open the branded intake flow (same link you will share with customers) or jump straight in below.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", alignItems: "center" }}>
            <Link
              href={inviteUrl}
              style={{
                display: "inline-block",
                padding: "0.65rem 1.1rem",
                borderRadius: 8,
                background: "var(--accent, #c9a227)",
                color: "#111",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start first appraisal
            </Link>
            <button
              type="button"
              onClick={() => void copyInviteLink()}
              disabled={!pilot?.inviteCustomerUrl}
              style={{
                padding: "0.55rem 0.9rem",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
                color: "inherit",
                cursor: pilot?.inviteCustomerUrl ? "pointer" : "not-allowed",
              }}
            >
              {copied ? "Invite link copied" : "Copy invite link for customers"}
            </button>
          </div>
        </section>
      )}
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>Dealer pilot dashboard</h1>
      <p style={{ color: "var(--text-muted, #888)", marginBottom: "1.25rem" }}>
        Live valuation spend vs the ${cap}/day guardrail, remaining budget projection, and your first-customer motion.
      </p>

      <section
        style={{
          marginTop: "0.5rem",
          padding: "1rem",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Usage meter (valuations)</h2>
        <div
          style={{
            height: 10,
            borderRadius: 5,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent, #c9a227)", transition: "width 0.3s" }} />
        </div>
        {usage ? (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>
              Spend today: ${spent.toFixed(2)} / ${cap.toFixed(2)} guardrail (${usage.valuation.remainingTodayUsd.toFixed(2)}{" "}
              remaining now)
            </li>
            {projRem != null && usage.valuation.projectedSpendEodUsd != null && (
              <li>
                EOD projection: ~${usage.valuation.projectedSpendEodUsd.toFixed(2)} spend · ~$
                {projRem.toFixed(2)} headroom left at current pace
              </li>
            )}
            <li>Valuation calls today: {usage.valuation.callsToday}</li>
            <li>Public appraisals today (intake): {usage.valuation.publicIntakeToday ?? 0}</li>
            <li>Appraisals (all time in workspace): {pilot?.appraisalCount ?? "—"}</li>
            <li>
              Usage this month: {usage.usageMonth.quantity} events · ${usage.usageMonth.amountUsd.toFixed(2)}
            </li>
            {pilot?.pilotSubdomain && (
              <li>
                Subdomain slug: <code>{pilot.pilotSubdomain}</code> (unique; falls back automatically if taken)
              </li>
            )}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted, #888)" }}>Loading usage…</p>
        )}
        <button type="button" onClick={() => void loadUsage()} style={{ marginTop: "0.75rem" }}>
          Refresh
        </button>
      </section>

      <section
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Branded invite link</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted, #888)", marginBottom: "0.75rem" }}>
          Copy or scan — leads land in your tenant-scoped workspace.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          {inviteUrl ? (
            <img src={qrDataUrlForLink(inviteUrl)} width={140} height={140} alt="QR code for invite link" style={{ borderRadius: 8 }} />
          ) : null}
          <div>
            <button type="button" onClick={() => void copyInviteLink()} disabled={!pilot?.inviteCustomerUrl}>
              {copied ? "Copied" : "Copy invite link"}
            </button>
            <p style={{ fontSize: "0.8rem", wordBreak: "break-all", marginTop: "0.5rem", color: "var(--text-muted, #888)" }}>
              {pilot?.inviteCustomerUrl ?? "—"}
            </p>
            <Link
              href={inviteUrl || "#"}
              style={{ display: "inline-block", marginTop: "0.75rem", color: "var(--accent, #c9a227)", fontWeight: 600 }}
            >
              Invite first customer (open appraisal)
            </Link>
          </div>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>Or create a lead by email:</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
          <input
            placeholder="customer@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "0.45rem 0.5rem" }}
          />
          <button type="button" onClick={() => void invite()}>
            Send invite
          </button>
        </div>
      </section>

      {usage?.activity && (
        <section
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Recent activity</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "0.75rem" }}>
            <div>
              <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Appraisals</h3>
              <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.88rem" }}>
                {usage.activity.appraisals.length === 0 && <li>—</li>}
                {usage.activity.appraisals.map((a) => (
                  <li key={a.id}>
                    {a.status} · {new Date(a.updatedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Closed deals (orders)</h3>
              <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.88rem" }}>
                {usage.activity.closedDeals.length === 0 && <li>—</li>}
                {usage.activity.closedDeals.map((o) => (
                  <li key={o.id}>
                    {o.status} · ${(o.totalAmount ?? 0).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>Usage events</h3>
              <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.88rem" }}>
                {usage.activity.usageEvents.length === 0 && <li>—</li>}
                {usage.activity.usageEvents.slice(0, 6).map((u) => (
                  <li key={u.id}>
                    {u.kind} · {new Date(u.createdAt).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {showNps && (
        <section
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Quick NPS (after your first deal-desk close)</h2>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>Score 0–10</span>
            <input type="number" min={0} max={10} value={nps} onChange={(e) => setNps(Number(e.target.value))} />
          </label>
          <textarea
            placeholder="What would make this indispensable?"
            value={npsMessage}
            onChange={(e) => setNpsMessage(e.target.value)}
            rows={3}
            style={{ display: "block", width: "100%", marginTop: "0.5rem" }}
          />
          <button type="button" onClick={() => void submitNps()} style={{ marginTop: "0.5rem" }}>
            Submit
          </button>
        </section>
      )}

      {!postCheckout && (
        <section style={{ marginTop: "1.25rem" }}>
          <Link
            href={inviteUrl || "/appraisal"}
            style={{
              display: "inline-block",
              padding: "0.65rem 1rem",
              borderRadius: 8,
              background: "var(--accent, #c9a227)",
              color: "#111",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            First appraisal quick-start
          </Link>
        </section>
      )}

      {msg && (
        <p style={{ marginTop: "1rem", color: "var(--text-muted, #aaa)" }} role="status">
          {msg}
        </p>
      )}
    </main>
  );
}

export default function DealerPilotDashboardPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
          <p style={{ color: "var(--text-muted, #888)" }}>Loading…</p>
        </main>
      }
    >
      <DealerPilotDashboardInner />
    </Suspense>
  );
}
