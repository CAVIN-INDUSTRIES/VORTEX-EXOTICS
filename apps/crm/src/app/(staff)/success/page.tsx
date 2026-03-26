"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getIterationBacklog, submitPilotFeedback } from "@/lib/api";

type BacklogItem = {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  source: string;
};

export default function SuccessPage() {
  const { token, loading } = useAuth();
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [message, setMessage] = useState("");
  const [nps, setNps] = useState(8);
  const [status, setStatus] = useState<string | null>(null);
  const upsellBannerEnabled = process.env.NEXT_PUBLIC_FLAG_UPSELL_BANNER === "true";

  useEffect(() => {
    if (!token) return;
    getIterationBacklog(token)
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch((e) => setStatus(e instanceof Error ? e.message : "Failed to load backlog"));
  }, [token]);

  async function onSubmit() {
    if (!token || !message.trim()) return;
    try {
      await submitPilotFeedback(token, { rating: nps, message: message.trim(), channel: "in_app" });
      setMessage("");
      setStatus("Feedback submitted");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to submit feedback");
    }
  }

  if (loading) return <main style={{ padding: "2rem" }}>Loading…</main>;

  return (
    <main style={{ padding: "2rem", maxWidth: 980, margin: "0 auto" }}>
      <h1>Customer Success</h1>
      <p>Submit pilot feedback and review auto-generated iteration backlog.</p>
      {upsellBannerEnabled && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: 8, background: "var(--bg-card)" }}>
          <strong>Upsell recommendation:</strong> Teams using AI + Marketplace workflows convert 30% higher. Enable Pro expansion offer.
        </div>
      )}

      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <label>
          NPS score: {nps}
          <input type="range" min={1} max={10} value={nps} onChange={(e) => setNps(Number(e.target.value))} />
        </label>
        <textarea
          rows={4}
          placeholder="Share pilot feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={onSubmit}>Submit feedback</button>
      </div>
      {status && <p>{status}</p>}

      <h2>Iteration backlog</h2>
      <table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Title</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>{x.priority}</td>
              <td title={x.description}>{x.title}</td>
              <td>{x.status}</td>
              <td>{x.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
