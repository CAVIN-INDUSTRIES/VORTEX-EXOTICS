"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createLead, getLeads } from "@/lib/api";

export default function LeadsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<{ items: unknown[] } | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  useEffect(() => {
    if (!token) return;
    getLeads(token, statusFilter ? { status: statusFilter } : undefined)
      .then(setData)
      .catch(() => setData({ items: [] }));
  }, [token, statusFilter]);

  const items = (data?.items ?? []) as { id: string; name: string | null; email: string | null; status: string; vehicleInterest: string | null; assignedTo: { email: string } | null }[];

  const refresh = () => {
    if (!token) return;
    getLeads(token, statusFilter ? { status: statusFilter } : undefined)
      .then(setData)
      .catch(() => setData({ items: [] }));
  };

  const onCreateLead = async () => {
    if (!token) return;
    await createLead(token, { name: leadName || undefined, email: leadEmail || undefined, source: "CRM" });
    setLeadName("");
    setLeadEmail("");
    refresh();
  };

  return (
    <main style={{ padding: "1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0, color: "var(--text-primary)" }}>Leads</h1>
        <Link href="/leads/new" style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#0d0d0d", borderRadius: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Add lead</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", marginBottom: "1rem" }}>
        <input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Lead name" />
        <input value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="Lead email" />
        <button type="button" onClick={onCreateLead}>Quick add</button>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Status</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="LOST">Lost</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name / Email</th>
            <th>Status</th>
            <th>Interest</th>
            <th>Assigned</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((l) => (
            <tr key={l.id}>
              <td>{l.name || l.email || "—"}</td>
              <td>{l.status}</td>
              <td>{l.vehicleInterest || "—"}</td>
              <td>{l.assignedTo?.email ?? "—"}</td>
              <td><Link href={`/leads/${l.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>No leads.</p>}
    </main>
  );
}
