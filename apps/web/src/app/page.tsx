import Link from "next/link";
import { typography } from "@vex/design-system";
import { FEATURED_VEHICLES } from "@/lib/vehicles";
import { AutomotiveAtmosphere } from "@/components/atmosphere";
import { EditorialContainer, EditorialHeader, SectionShell } from "@/components/layout";
import { VehicleCard } from "@/components/VehicleCard";
import { MotionReveal } from "@/components/site/MotionReveal";

const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const finalSignals = [
  { label: "Response standard", value: "24h" },
  { label: "Concierge ownership", value: "1:1" },
  { label: "Private handoff", value: "Human-led" },
];

export default function HomePage() {
  const spotlightVehicles = FEATURED_VEHICLES.slice(0, 3);

  return (
    <main id="main-content">
      <SectionShell
        id="universe"
        variant="default"
        className="cinematic-gate-hero relative overflow-hidden"
        atmosphere={<AutomotiveAtmosphere variant="hero" intensity="medium" />}
      >
        <EditorialContainer className="hero-stage relative z-[4]">
          <MotionReveal className="mx-auto max-w-4xl text-center">
            <p className="section-kicker" style={{ ...typography.sectionEyebrow }}>
              Private market operating layer
            </p>
            <h1 className="hero-title-lux mt-6 text-[#fff8eb]" style={typography.displayHero}>
              A cleaner path to private exotic acquisition.
            </h1>
            <p className="hero-lede-lux mx-auto mt-7 max-w-3xl sm:text-lg">
              VEX keeps inventory, valuation, and concierge execution in one consistent flow so buyers can move from discovery to
              close without clutter.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/inventory" className="gold-button">
                Explore Inventory
              </Link>
              <Link href="/appraisal" className="ghost-button">
                Request Appraisal
              </Link>
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <MotionReveal>
              <EditorialHeader
                eyebrow="How it works"
                title="Simple workflow for high-intent buyers and sellers."
                description="Browse verified vehicles, review pricing context, and connect directly with concierge support. No extra modules or detours."
              />
            </MotionReveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Discover", copy: "Curated inventory with clear pricing and specs." },
                { title: "Verify", copy: "Review condition, provenance, and valuation posture." },
                { title: "Close", copy: "Work directly with concierge through handoff." },
              ].map((item, index) => (
                <MotionReveal key={item.title} delay={index * 0.05} className="rounded-xl border border-white/10 p-5">
                  <h3 className="text-xl text-[#fff8eb]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#d8d0c2]">{item.copy}</p>
                </MotionReveal>
              ))}
            </div>
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <MotionReveal className="mb-8">
            <EditorialHeader
              eyebrow="Featured inventory"
              title="Current vehicles"
              description="A compact view of active listings with direct paths to details and private access."
            />
          </MotionReveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {spotlightVehicles.map((vehicle, index) => (
              <MotionReveal key={vehicle.id} delay={index * 0.06}>
                <VehicleCard vehicle={vehicle} />
              </MotionReveal>
            ))}
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="cinematic" atmosphere={<AutomotiveAtmosphere variant="cta" intensity="medium" />}>
        <EditorialContainer>
          <MotionReveal className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-2xl border border-white/10 p-7 sm:p-10">
              <p className="section-kicker">Private access</p>
              <h2 className="section-title">Ready to move forward?</h2>
              <p className="section-copy max-w-xl">
                Reach the team for acquisition support, appraisal review, or selective consignment.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {finalSignals.map((signal) => (
                  <div key={signal.label} className="rounded-lg border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-[#a99f8d]">{signal.label}</p>
                    <p className="mt-2 text-lg text-[#fff8eb]">{signal.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="gold-button">
                  Request Private Access
                </Link>
                <Link href="/inventory" className="ghost-button">
                  Explore Collection
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 p-7 sm:p-10">
              <p className="section-kicker">Response protocol</p>
              <h3 className="mt-4 text-3xl text-[#fff8eb]">One human-owned path from first inquiry to final handoff.</h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-[#d8d0c2]">
                <p>{contactPhone || "Phone line configured on request"}</p>
                <p>{contactEmail || "Email contact configured on request"}</p>
                <p>Human response only. No generic queue.</p>
              </div>
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>
    </main>
  );
}
