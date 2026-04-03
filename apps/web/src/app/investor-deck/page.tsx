"use client";

import { useEffect, useMemo, useState } from "react";
import { getInvestorPackageByToken } from "@/lib/api";

type PilotNet = {
  activePilots: number;
  totalPilotAppraisals: number;
  firstBillingEvents: number;
  publicIntakeToday?: number;
  closedDealsAcrossPilots?: number;
  generatedAt: string;
};

export default function InvestorDeckPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getInvestorPackageByToken>> | null>(null);
  const [livePilot, setLivePilot] = useState<PilotNet | null>(null);
  const [pilotErr, setPilotErr] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  useEffect(() => {
    if (!token) return;
    getInvestorPackageByToken(token).then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, [token]);

  useEffect(() => {
    void fetch("/api/investor/pilot-network")
      .then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as { data?: PilotNet; message?: string; code?: string };
        if (!r.ok) {
          setPilotErr(j.message ?? j.code ?? "Live pilot metrics unavailable");
          return;
        }
        if (j.data && typeof j.data.activePilots === "number") setLivePilot(j.data);
      })
      .catch(() => setPilotErr("Could not load live pilot network metrics"));
  }, []);

  const pilot = livePilot ?? data?.pilotNetwork ?? null;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Investor deck — seed traction</h1>
      <p style={{ color: "var(--text-muted, #aaa)", marginBottom: "1rem" }}>
        View-only package plus live pilot network counters (GET /dealer/pilots via secure proxy).
      </p>
      {!token && <p>Missing investor token. Append <code>?token=…</code> from a generated investor link.</p>}
      {err && <p style={{ color: "#f66" }}>{err}</p>}
      {pilotErr && <p style={{ color: "#f90", fontSize: "0.9rem" }}>{pilotErr}</p>}
      {data && (
        <>
          <p>Package generated: {new Date(data.generatedAt).toLocaleString()}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(180px,1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8 }}>MRR (snapshot)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${data.mrr.toLocaleString()}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8 }}>LTV proxy (MRR × 12)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${(data.mrr * 12).toLocaleString()}</div>
            </div>
          </div>
        </>
      )}
      {pilot && (
        <section style={{ marginTop: "0.5rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem" }}>Live pilot network (seed metrics)</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #888)" }}>
            Updated {new Date(pilot.generatedAt).toLocaleString()}
            {livePilot ? " · live endpoint" : " · embedded in investor package"}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>Active pilots</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pilot.activePilots}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>Pilot appraisals</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pilot.totalPilotAppraisals}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>First billing events</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pilot.firstBillingEvents}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>Public intake (UTC today)</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pilot.publicIntakeToday ?? "—"}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>Closed deals (pilots)</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pilot.closedDealsAcrossPilots ?? "—"}</div>
            </div>
          </div>
        </section>
      )}
      {data && (
        <>
          <h2 style={{ marginTop: "1.25rem" }}>Highlights</h2>
          <ul>
            {data.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
