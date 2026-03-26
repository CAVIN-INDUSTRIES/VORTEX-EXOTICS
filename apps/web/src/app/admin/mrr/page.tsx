"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getOwnerMrrDashboard } from "@/lib/api";

type MrrData = {
  totalMrr: number;
  activeTenants: number;
  usageByKind: Array<{ kind: string; quantity: number; amountUsd: number }>;
  generatedAt: string;
};

export default function AdminMrrPage() {
  const { token, user, loading } = useAuth();
  const [data, setData] = useState<MrrData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== "ADMIN") return;
    getOwnerMrrDashboard(token).then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, [token, user]);

  if (loading) return <main style={{ padding: "2rem" }}>Loading…</main>;
  if (!user || user.role !== "ADMIN") {
    return (
      <>
        <Header />
        <main style={{ padding: "2rem" }}>
          <h1>Forbidden</h1>
          <p>Admin role required.</p>
          <Link href="/portal">Back</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Live MRR Dashboard</h1>
        {err && <p style={{ color: "#f66" }}>{err}</p>}
        {data && (
          <>
            <p style={{ color: "var(--text-muted)" }}>Updated: {new Date(data.generatedAt).toLocaleString()}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(180px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>MRR (estimated)</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>${data.totalMrr.toLocaleString()}</div>
              </div>
              <div style={{ background: "var(--bg-card)", borderRadius: 8, padding: "1rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Active tenants</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{data.activeTenants}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Usage kind</th><th>Quantity</th><th>Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                {data.usageByKind.map((r) => (
                  <tr key={r.kind}>
                    <td>{r.kind}</td>
                    <td>{r.quantity}</td>
                    <td>${r.amountUsd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  );
}
