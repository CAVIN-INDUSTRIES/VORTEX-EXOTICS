"use client";

import { useId, useState } from "react";
import { VexAnimatedMetric, VexPageHeader, VexPanel } from "@vex/ui";
import { useAuth } from "@/contexts/AuthContext";
import { submitAutonomousWorkflow } from "@/lib/api";

const WORKFLOWS = [
  { value: "valuation_sweep" as const, label: "Valuation sweep" },
  { value: "lead_nurture" as const, label: "Lead nurture" },
  { value: "appraisal_marketplace_push" as const, label: "Appraisal marketplace push" },
];

export default function AutonomousDashboardPage() {
  const formId = useId();
  const { token, role } = useAuth();
  const [workflowId, setWorkflowId] = useState(`wf_${Date.now()}`);
  const [workflowType, setWorkflowType] = useState<(typeof WORKFLOWS)[number]["value"]>("valuation_sweep");
  const [enabled, setEnabled] = useState(true);
  const [maxParallelRuns, setMaxParallelRuns] = useState(10);
  const [tenantDailyCostCapUsd, setTenantDailyCostCapUsd] = useState(25);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = (role === "ADMIN" || role === "GROUP_ADMIN") && !!token;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canSubmit) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const data = await submitAutonomousWorkflow(token, {
        id: workflowId.trim() || `wf_${Date.now()}`,
        workflowType,
        enabled,
        maxParallelRuns,
        tenantDailyCostCapUsd,
      });
      const lines = [
        JSON.stringify(data, null, 2),
        !data.queued
          ? "\nNote: Audit/event records were written but no Redis queue job ran (REDIS_URL unset or unreachable)."
          : "",
      ].filter(Boolean);
      setResult(lines.join("\n"));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="crm-shell">
      <VexPageHeader title="Autonomous Dealer OS v2" subtitle="Monitor workflow orchestration, decision trails, and guardrails." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "0.85rem", marginBottom: "1rem" }}>
        <VexAnimatedMetric label="Workflow" value="Daily valuation sweep" />
        <VexAnimatedMetric label="Status" value="Running" />
        <VexAnimatedMetric label="Circuit breaker" value="Healthy" />
        <VexAnimatedMetric label="Parallel limit" value="50 / tenant" />
      </div>
      <VexPanel style={{ padding: "1rem", marginBottom: "1rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>
          Autonomous operations remain tenant-scoped and auditable, with manual override pathways for protected workflows.
        </p>
      </VexPanel>

      <VexPanel style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}>Queue workflow</h2>
        {!canSubmit && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            Admin or group admin sign-in required to enqueue autonomous jobs.
          </p>
        )}
        <form id={formId} onSubmit={(e) => void onSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "420px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Run ID</span>
            <input
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              disabled={!canSubmit}
              style={{ padding: "0.5rem", background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Workflow type</span>
            <select
              value={workflowType}
              onChange={(e) => setWorkflowType(e.target.value as (typeof WORKFLOWS)[number]["value"])}
              disabled={!canSubmit}
              style={{ padding: "0.5rem", background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            >
              {WORKFLOWS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: canSubmit ? "pointer" : "default" }}>
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} disabled={!canSubmit} />
            <span style={{ fontSize: "0.9rem" }}>Enabled</span>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Max parallel runs (1–50)</span>
            <input
              type="number"
              min={1}
              max={50}
              value={maxParallelRuns}
              onChange={(e) => setMaxParallelRuns(Number(e.target.value))}
              disabled={!canSubmit}
              style={{ padding: "0.5rem", background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Daily cost cap (USD)</span>
            <input
              type="number"
              min={0}
              max={500}
              step={1}
              value={tenantDailyCostCapUsd}
              onChange={(e) => setTenantDailyCostCapUsd(Number(e.target.value))}
              disabled={!canSubmit}
              style={{ padding: "0.5rem", background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit || busy}
            style={{
              padding: "0.65rem",
              background: "var(--accent)",
              color: "#111",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: canSubmit && !busy ? "pointer" : "not-allowed",
            }}
          >
            {busy ? "Queueing…" : "Queue workflow"}
          </button>
        </form>
        {err && <p style={{ marginTop: "0.75rem", color: "#f66", fontSize: "0.9rem" }}>{err}</p>}
        {result && (
          <pre
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              background: "rgba(0,0,0,0.25)",
              borderRadius: 6,
              fontSize: "0.8rem",
              overflow: "auto",
              color: "var(--text-secondary)",
            }}
          >
            {result}
          </pre>
        )}
      </VexPanel>
    </main>
  );
}
