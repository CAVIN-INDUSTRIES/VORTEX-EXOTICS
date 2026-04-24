"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createStripeCheckoutSession } from "@/lib/api";
import { MotionReveal } from "@/components/site/MotionReveal";

type BillingInterval = "monthly" | "yearly";
type Plan = "CHECK_MY_DEAL" | "VIP_CONCIERGE";

const PLANS: Array<{
  id: Plan;
  name: string;
  desc: string;
  featured?: boolean;
  label: string;
}> = [
  {
    id: "CHECK_MY_DEAL",
    name: "Starter",
    label: "Private Launch",
    desc: "Inventory, CRM, appraisals, and core dealer operations for teams that need a premium market presence quickly.",
  },
  {
    id: "VIP_CONCIERGE",
    name: "Pro",
    label: "Signature Presence",
    desc: "Full portal, analytics, white-label operations, and premium appraisal workflows for a more ambitious operating surface.",
    featured: true,
  },
];

export default function PricingPage() {
  const { token } = useAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const yearlyNote = useMemo(
    () => (billingInterval === "yearly" ? "Annual billing with discount applied in Stripe." : ""),
    [billingInterval]
  );

  const startCheckout = async (plan: Plan) => {
    setError(null);
    if (!token) {
      window.location.href = "/login?redirect=" + encodeURIComponent("/pricing");
      return;
    }
    setLoadingPlan(plan);
    try {
      const session = await createStripeCheckoutSession({ plan, billingInterval }, token);
      if (session.url) window.location.href = session.url;
      else setError("Stripe did not return a checkout URL.");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <MotionReveal className="max-w-3xl">
        <p className="section-kicker">Pricing</p>
        <h1 className="section-title">Dealer platform pricing with a premium public surface.</h1>
        <p className="section-copy">
          The luxury frontend is only one layer. Underneath it, the platform still supports subscriptions,
          inventory, CRM, appraisal, and portal workflows for modern dealer operations.
        </p>
      </MotionReveal>

      <MotionReveal delay={0.06} className="mt-8 flex flex-wrap items-center gap-3">
        {(["monthly", "yearly"] as BillingInterval[]).map((interval) => (
          <button
            key={interval}
            type="button"
            className={`rounded-full px-5 py-2.5 text-sm transition ${
              billingInterval === interval
                ? "bg-[linear-gradient(135deg,#f1d38a,#d4af37)] text-[#111111]"
                : "border border-white/12 bg-white/[0.05] text-[#f5f1e8]"
            }`}
            onClick={() => setBillingInterval(interval)}
          >
            {interval === "monthly" ? "Monthly" : "Annual"}
          </button>
        ))}
        {yearlyNote ? <span className="text-sm text-[#bcae97]">{yearlyNote}</span> : null}
      </MotionReveal>

      {error ? <p className="mt-5 rounded-[1.2rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

      <div className="mt-10 grid gap-5 xl:grid-cols-2">
        {PLANS.map((plan, index) => (
          <MotionReveal key={plan.id} delay={index * 0.08}>
            <section
              className={`rounded-[2rem] border p-7 backdrop-blur-xl ${
                plan.featured
                  ? "border-[#f1d38a]/26 bg-[linear-gradient(180deg,rgba(212,175,55,0.18),rgba(255,255,255,0.05))] shadow-[0_0_90px_rgba(212,175,55,0.08)]"
                  : "glass-panel"
              }`}
            >
              <p className="section-kicker">{plan.label}</p>
              <h2 className="mt-4 text-4xl text-[#fff8eb]">{plan.name}</h2>
              <p className="mt-5 text-base leading-8 text-[#d8d0c2]">{plan.desc}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button type="button" className="gold-button" onClick={() => startCheckout(plan.id)} disabled={loadingPlan === plan.id}>
                  {loadingPlan === plan.id ? "Redirecting..." : "Start subscription"}
                </button>
                <Link href="/portal/subscriptions" className="ghost-button">
                  Manage in portal
                </Link>
              </div>
            </section>
          </MotionReveal>
        ))}
      </div>
    </main>
  );
}
