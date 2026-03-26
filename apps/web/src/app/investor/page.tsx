"use client";

import { useEffect, useMemo, useState } from "react";
import { getInvestorPackageByToken } from "@/lib/api";

type InvestorPackage = {
  generatedAt: string;
  tenantCount: number;
  activeTenantCount: number;
  mrr: number;
  usageRevenueUsd: number;
  highlights: string[];
};

export default function InvestorPage() {
  const [data, setData] = useState<InvestorPackage | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    const sp = new URLSearchParams(window.location.search);
    return sp.get("token") ?? "";
  }, []);

  useEffect(() => {
    if (!token) return;
    getInvestorPackageByToken(token).then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, [token]);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Investor Data Room (View Only)</h1>
      {!token && <p>Missing investor token.</p>}
      {err && <p style={{ color: "#f66" }}>{err}</p>}
      {data && (
        <>
          <p>Generated: {new Date(data.generatedAt).toLocaleString()}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(180px,1fr))", gap: "1rem" }}>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8 }}>MRR</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${data.mrr.toLocaleString()}</div>
            </div>
            <div style={{ background: "#10141f", borderRadius: 8, padding: "1rem" }}>
              <div style={{ opacity: 0.8 }}>LTV proxy (MRR x 12)</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${(data.mrr * 12).toLocaleString()}</div>
            </div>
          </div>
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
