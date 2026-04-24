import Link from "next/link";
import { MotionReveal } from "@/components/site/MotionReveal";

const STEPS = [
  {
    number: "01",
    title: "Apply for access",
    copy: "Buyer and seller profiles are screened for fit, identity, and seriousness before the conversation deepens.",
  },
  {
    number: "02",
    title: "Present with precision",
    copy: "Vehicles are framed with stronger narrative, cleaner visuals, and a premium atmosphere that supports confidence.",
  },
  {
    number: "03",
    title: "Close with concierge support",
    copy: "Inspection, transport, and final handover are guided through a single high-context support lane.",
  },
];

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <MotionReveal className="max-w-3xl">
        <p className="section-kicker">Experience</p>
        <h1 className="section-title">A calmer, more selective route from introduction to closing.</h1>
        <p className="section-copy">
          VEX is built around controlled momentum. The process should feel elegant, legible, and deeply human for both
          buyers and sellers, with every step removing noise instead of adding it.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/inventory" className="gold-button">
            Browse inventory
          </Link>
          <Link href="/contact" className="ghost-button">
            Speak with the team
          </Link>
        </div>
      </MotionReveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <MotionReveal key={step.number} delay={index * 0.08} className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-4xl text-[#f1d38a]">{step.number}</p>
            <h2 className="mt-5 text-2xl text-[#fff8eb]">{step.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#d8d0c2]">{step.copy}</p>
          </MotionReveal>
        ))}
      </div>
    </main>
  );
}
