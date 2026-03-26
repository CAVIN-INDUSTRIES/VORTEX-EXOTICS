"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { createBillingPortalSession, createTierCheckoutSession, getCurrentTenantBilling, getPricingPlans } from "@/lib/api";
import styles from "./subscriptions.module.css";

export default function PortalSubscriptionsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState<Array<{ tier: "STARTER" | "PRO" | "ENTERPRISE"; name: string; monthly: number; yearly: number; features: string[] }>>([]);
  const [billingTier, setBillingTier] = useState<string>("STARTER");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/portal/subscriptions");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    Promise.all([getPricingPlans(), getCurrentTenantBilling(token)])
      .then(([planResp, billing]) => {
        setPlans(planResp.plans);
        setBillingTier(billing.billingTier);
      })
      .catch(() => {
        setPlans([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const startTierCheckout = async (tier: "STARTER" | "PRO" | "ENTERPRISE", interval: "monthly" | "yearly") => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const session = await createTierCheckoutSession({ tier, interval }, token);
      if (session.url) window.location.href = session.url;
      else setError("Stripe did not return a checkout URL.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
    } finally {
      setSubmitting(false);
    }
  };

  const openBillingPortal = async () => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const portal = await createBillingPortalSession({ returnUrl: `${window.location.origin}/portal/subscriptions` }, token);
      window.location.href = portal.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to open billing portal");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <>
        <Header />
        <main id="main-content" className={styles.main}><p className={styles.loading}>Loading…</p></main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className={styles.main}>
        <Link href="/portal" className={styles.back}>← Portal</Link>
        <h1 className={styles.title}>Subscriptions</h1>

        {loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Billing tier</h2>
              <p className={styles.desc}>Current tier: <strong>{billingTier}</strong></p>
              <div className={styles.actions}>
                <button type="button" onClick={openBillingPortal} disabled={submitting} className={styles.cta} data-magnetic="true" data-sfx="button">
                  Open billing portal
                </button>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Upgrade plan</h2>
              <div className={styles.list}>
                {plans.map((plan) => (
                  <div key={plan.tier} className={styles.card}>
                    <p><strong>{plan.name}</strong> ({plan.tier})</p>
                    <p className={styles.desc}>${plan.monthly}/mo or ${plan.yearly}/yr</p>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => startTierCheckout(plan.tier, "monthly")} disabled={submitting} className={styles.cta} data-magnetic="true" data-sfx="button">
                        Monthly
                      </button>
                      <button type="button" onClick={() => startTierCheckout(plan.tier, "yearly")} disabled={submitting} className={styles.ctaSecondary} data-magnetic="true" data-sfx="button">
                        Annual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </main>
    </>
  );
}
