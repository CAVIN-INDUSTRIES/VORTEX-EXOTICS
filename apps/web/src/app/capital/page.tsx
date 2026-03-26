"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getRaisePackage } from "@/lib/api";

export default function CapitalPage() {
  const { token, user, loading } = useAuth();
  const [kpi, setKpi] = useState<{
    mrr: number;
    activeTenantCount: number;
    tenantCount: number;
    usageRevenueUsd: number;
    generatedAt: string;
    highlights: string[];
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== "ADMIN") return;
    getRaisePackage(token)
      .then((x) =>
        setKpi({
          mrr: x.mrr,
          activeTenantCount: x.activeTenantCount,
          tenantCount: x.tenantCount,
          usageRevenueUsd: x.usageRevenueUsd,
          generatedAt: x.generatedAt,
          highlights: x.highlights,
        })
      )
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load capital metrics"));
  }, [token, user]);

  if (loading) return <main style={{ padding: "2rem" }}>Loading…</main>;
  return (
    <>
      <Header />
      <main style={{ padding: "2rem", maxWidth: 980, margin: "0 auto" }}>
        <h1>Capital Execution</h1>
        <p>Investor-ready KPI one-pager (MVP).</p>
        {err && <p style={{ color: "#f66" }}>{err}</p>}
        {kpi && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(180px,1fr))", gap: "1rem" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>MRR</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${kpi.mrr.toLocaleString()}</div>
            </div>
            <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Active tenants</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{kpi.activeTenantCount}</div>
            </div>
            <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total tenants</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{kpi.tenantCount}</div>
            </div>
            <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Usage revenue</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${kpi.usageRevenueUsd.toFixed(2)}</div>
            </div>
          </div>
        )}
        {kpi && (
          <>
            <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Generated: {new Date(kpi.generatedAt).toLocaleString()}</p>
            <ul>
              {kpi.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
