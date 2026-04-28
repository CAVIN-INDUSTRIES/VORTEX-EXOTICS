import Link from "next/link";
import { FEATURED_VEHICLES } from "@/lib/vehicles";
import { EditorialContainer, SectionShell } from "@/components/layout";
import { VehicleCard } from "@/components/VehicleCard";
import { MotionReveal } from "@/components/site/MotionReveal";

const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const trustSignals = ["Verified sellers", "Escrow-ready support", "Human concierge", "Private transactions"];

export default function HomePage() {
  const featured = FEATURED_VEHICLES.slice(0, 3);

  return (
    <main id="main-content">
      <SectionShell id="universe" variant="compact">
        <EditorialContainer width="feature">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Private market platform</p>
            <h1 className="section-title mt-5">Buy and sell exotic vehicles without the noise.</h1>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              VEX is a simpler private channel for verified inventory, market-aware pricing, and concierge deal execution.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/inventory" className="gold-button" data-analytics-event="hero_cta_click">
                Browse Inventory
              </Link>
              <Link href="/appraisal" className="ghost-button" data-analytics-event="concierge_cta_click">
                Request Appraisal
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d8d0c2]">
              {trustSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-white/10 px-3 py-2">
                  {signal}
                </span>
              ))}
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">How it works</p>
            <h2 className="section-title mt-5">Three steps. One private transaction flow.</h2>
            <p className="section-copy mx-auto mt-5">
              Discover verified inventory, review pricing context, and close with concierge support.
            </p>
            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                { title: "Discover", copy: "Curated inventory built for serious buyers." },
                { title: "Verify", copy: "Confidence and pricing context before contact." },
                { title: "Close", copy: "Escrow, docs, and delivery support in one lane." },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl border border-white/10 p-5">
                  <h3 className="text-xl text-[#fff8eb]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#d8d0c2]">{step.copy}</p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="compact">
        <EditorialContainer>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Featured inventory</p>
              <h2 className="mt-3 text-3xl text-[#fff8eb]">Current selection</h2>
            </div>
            <Link href="/inventory" className="ghost-button">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featured.map((vehicle, index) => (
              <MotionReveal key={vehicle.id} delay={index * 0.05}>
                <VehicleCard vehicle={vehicle} />
              </MotionReveal>
            ))}
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <MotionReveal className="mx-auto max-w-3xl rounded-2xl border border-white/10 p-8 text-center">
            <p className="section-kicker">Need help now?</p>
            <h2 className="section-title mt-5">Talk to a concierge.</h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              We can help with acquisition strategy, valuation review, and private listing support.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="gold-button">
                Request Private Access
              </Link>
              <Link href="/inventory" className="ghost-button">
                Continue Browsing
              </Link>
            </div>
            <div className="mt-6 text-sm text-[#d8d0c2]">
              <p>{contactPhone || "Phone contact available on request"}</p>
              <p>{contactEmail || "Email contact available on request"}</p>
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>
    </main>
  );
}
