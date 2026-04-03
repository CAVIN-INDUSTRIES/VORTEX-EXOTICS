"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getFlags, setFlag } from "@/lib/api";

export default function FeatureFlagsPage() {
  const { token, role } = useAuth();
  const [items, setItems] = useState<Array<{ id: string; key: string; enabled: boolean; updatedAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const canEdit = role === "ADMIN" || role === "GROUP_ADMIN";

  const refresh = useCallback(async () => {
    if (!token) return;
    setErr(null);
    try {
      const data = await getFlags(token);
      setItems(data.items);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load flags");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = async (key: string, enabled: boolean) => {
    if (!token || !canEdit) return;
    setErr(null);
    try {
      const row = await setFlag(token, { key, enabled });
      setItems((prev) => {
        const ix = prev.findIndex((r) => r.key === key);
        if (ix >= 0) {
          const next = [...prev];
          next[ix] = row;
          return next;
        }
        return [...prev, row].sort((a, b) => a.key.localeCompare(b.key));
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  };

  const addFlag = async () => {
    const key = newKey.trim();
    if (!token || !canEdit || !key) return;
    setErr(null);
    try {
      const row = await setFlag(token, { key, enabled: true });
      setNewKey("");
      setItems((prev) => [...prev.filter((r) => r.key !== key), row].sort((a, b) => a.key.localeCompare(b.key)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed");
    }
  };

  return (
    <main style={{ padding: "1.5rem", maxWidth: "640px", margin: "0 auto" }}>
      <Link href="/dashboard" style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
        ← Dashboard
      </Link>
      <h1 style={{ margin: "1rem 0", color: "var(--text-primary)" }}>Feature flags</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.92rem" }}>
        Tenant-scoped toggles for gradual rollouts. Changes are audited on the API.
      </p>
      {loading && <p style={{ color: "var(--text-muted)" }}>Loading…</p>}
      {err && <p style={{ color: "#f66", marginBottom: "0.75rem" }}>{err}</p>}
      {!loading && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {items.map((row) => (
            <li
              key={row.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
            >
              <code style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{row.key}</code>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: canEdit ? "pointer" : "default" }}>
                <input
                  type="checkbox"
                  checked={row.enabled}
                  disabled={!canEdit}
                  onChange={(e) => void toggle(row.key, e.target.checked)}
                />
                <span style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>{row.enabled ? "on" : "off"}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="new_flag_key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value.replace(/\s+/g, "_"))}
            style={{
              flex: "1 1 200px",
              padding: "0.5rem 0.65rem",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
            }}
          />
          <button
            type="button"
            onClick={() => void addFlag()}
            disabled={!newKey.trim()}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--accent)",
              color: "#111",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: newKey.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add (enabled)
          </button>
        </div>
      )}
      {!canEdit && !loading && (
        <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>Ask an admin to change flags.</p>
      )}
    </main>
  );
}
