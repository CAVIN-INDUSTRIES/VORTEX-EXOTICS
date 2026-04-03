"use client";

import { useReveal } from "@/hooks/useReveal";
import type { PlatformEnginesPayload } from "@/lib/api";
import styles from "./PlatformEnginesSection.module.css";

export function PlatformEnginesSection({ initial }: { initial: PlatformEnginesPayload | null }) {
  const ref = useReveal<HTMLElement>();
  const data = initial;

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-label="Multi-engine platform architecture"
      data-reveal
    >
      <div className={styles.intro}>
        <p className={styles.kicker}>Systems architecture</p>
        <h2 className={styles.title}>Six engines. One operating system for exotic retail.</h2>
        <p className={data ? styles.lede : styles.fallback}>
          {data?.headline ??
            "Edge API, tenant data plane, async workflows, commerce, valuation intelligence, and ERP mesh — orchestrated for multi-location dealers. Connect the marketing site to a live API to see real-time engine status."}
        </p>
      </div>

      <div className={styles.grid}>
        {(data?.engines ?? STATIC_ENGINES).map((e) => (
          <article key={e.id} className={styles.card}>
            <div className={styles.layer}>{e.layer}</div>
            <h3 className={styles.engineName}>{e.name}</h3>
            <p className={styles.detail}>{e.detail}</p>
            <div className={styles.statusRow}>
              <span className={`${styles.status} ${styles[e.status]}`}>{e.status}</span>
            </div>
          </article>
        ))}
      </div>

      {data && (
        <p className={styles.footer}>
          Live snapshot · DB {data.signals.database} · Redis {data.signals.redis} · updated{" "}
          {new Date(data.generatedAt).toLocaleString()}
        </p>
      )}
    </section>
  );
}

const STATIC_ENGINES: PlatformEnginesPayload["engines"] = [
  {
    id: "core-api",
    name: "Core API",
    layer: "Edge",
    detail: "Multi-tenant REST, JWT, RBAC, rate limits",
    status: "standby",
  },
  {
    id: "data-plane",
    name: "Data plane",
    layer: "Persistence",
    detail: "PostgreSQL with tenant isolation",
    status: "standby",
  },
  {
    id: "workflow",
    name: "Workflow engine",
    layer: "Async",
    detail: "BullMQ workers for PDF, cache warm, provisioning",
    status: "standby",
  },
  {
    id: "commerce",
    name: "Commerce engine",
    layer: "Revenue",
    detail: "Stripe, webhooks, usage metering",
    status: "standby",
  },
  {
    id: "valuation",
    name: "Valuation mesh",
    layer: "Intel",
    detail: "External providers, caps, audit trail",
    status: "standby",
  },
  {
    id: "integrations",
    name: "Integration mesh",
    layer: "ERP / DMS",
    detail: "Fortellis, Tekion, dealer webhooks",
    status: "standby",
  },
];
