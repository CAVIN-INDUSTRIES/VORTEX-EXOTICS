import Link from "next/link";
import { colors, radius, typography } from "@vex/design-system";
import { FEATURED_VEHICLES, formatPrice } from "@/lib/vehicles";
import { AutomotiveAtmosphere } from "@/components/atmosphere";
import { EditorialContainer, EditorialHeader, FeatureGrid, SectionShell } from "@/components/layout";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleImageFrame } from "@/components/inventory/VehicleImageFrame";
import { MotionReveal } from "@/components/site/MotionReveal";

const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const trustSignals = [
  "Dealer verification badge",
  "Verified seller identity",
  "Secure escrow coordination",
  "White-glove logistics",
  "Concierge acquisition flow",
  "Financing layer support",
];

const operatingPillars = [
  {
    number: "01",
    title: "Curated before listed",
    copy: "Inventory enters with rarity, condition, configuration, and ownership context already framed for a serious buyer.",
  },
  {
    number: "02",
    title: "Confidence before contact",
    copy: "Verification, provenance posture, and transaction readiness are surfaced before the conversation turns private.",
  },
  {
    number: "03",
    title: "Concierge through close",
    copy: "Appraisal, escrow, documentation, transport, and handoff stay inside one calmer operating lane.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    copy: "Browse a tighter collection organized around fit, quality, and acquisition readiness rather than raw volume.",
  },
  {
    number: "02",
    title: "Verify",
    copy: "Review seller confidence, vehicle posture, pricing context, and provenance notes before opening a private thread.",
  },
  {
    number: "03",
    title: "Align",
    copy: "Clarify buyer intent, timing, trade context, and financing posture with a human concierge layer.",
  },
  {
    number: "04",
    title: "Close",
    copy: "Coordinate escrow, documentation, logistics, and final delivery with fewer handoffs and less noise.",
  },
];

const proofColumns = [
  {
    label: "Verification layer",
    title: "Trust is part of the presentation.",
    items: [
      "Seller identity review",
      "Dealer or specialist confidence signal",
      "VIN and listing consistency checks",
      "Condition and provenance notes",
    ],
  },
  {
    label: "Market layer",
    title: "Appraisal gives the experience financial gravity.",
    items: [
      "Pricing posture against comparables",
      "Mileage, rarity, and configuration fit",
      "Collector-grade desirability framing",
      "Exit confidence for future ownership",
    ],
  },
];

const collectionBadges = ["Verified", "Concierge available", "Condition class noted", "Private inquiry"];

const finalSignals = [
  { label: "Response standard", value: "24h" },
  { label: "Concierge ownership", value: "1:1" },
  { label: "Private handoff", value: "Human-led" },
];

export default function HomePage() {
  const spotlightVehicle = FEATURED_VEHICLES[0];

  return (
    <main id="main-content">
      <SectionShell
        id="universe"
        variant="compact"
        className="cinematic-gate-hero relative overflow-hidden"
        atmosphere={<AutomotiveAtmosphere variant="hero" intensity="medium" />}
      >
        <EditorialContainer width="feature" className="hero-stage relative z-[4]">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <MotionReveal className="hero-copy-lux max-w-2xl">
              <p className="section-kicker" style={{ ...typography.sectionEyebrow }}>
                Private market operating layer
              </p>
              <h1 className="hero-title-lux mt-6 max-w-[11ch] text-[#fff8eb]" style={typography.displayHero}>
                Serious exotic acquisition needs a calmer front door.
              </h1>
              <p className="hero-lede-lux mt-7 max-w-xl sm:text-lg" style={{ ...typography.bodyLarge, color: colors.textSoft }}>
                VEX organizes verified collection access, valuation confidence, and white-glove transaction flow inside one
                controlled automotive environment. The experience should read like a private registry, not a crowded listing wall.
              </p>

              <div className="hero-actions-lux mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/inventory"
                  className="gold-button"
                  data-magnetic="true"
                  data-analytics-event="hero_cta_click"
                  data-analytics-surface="homepage_hero"
                >
                  Explore Inventory
                </Link>
                <Link
                  href="/appraisal"
                  className="ghost-button"
                  data-magnetic="true"
                  data-analytics-event="concierge_cta_click"
                  data-analytics-surface="homepage_hero"
                >
                  Request Private Appraisal
                </Link>
              </div>

              <div className="hero-trust-strip mt-9" aria-label="Platform trust signals">
                {["Verified provenance posture", "Private seller visibility", "Human-led close coordination", "White-glove delivery support"].map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>

              <div className="hero-metrics-lux mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { value: `${FEATURED_VEHICLES.length}`, label: "featured vehicles" },
                  { value: "24h", label: "response target" },
                  { value: "1:1", label: "concierge ownership" },
                ].map((metric) => (
                  <div key={metric.label} className="glass-panel editorial-stat stat-glass rounded-[1.35rem] p-5">
                    <p style={{ ...typography.metadata, color: colors.textMuted }}>{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-[#fff8eb]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08} className="relative">
              <div className="gate-specular-line" aria-hidden />
              <div
                className="vault-panel gate-showpiece relative overflow-hidden p-6 sm:p-8 md:[transform:perspective(1400px)_rotateY(-7deg)_rotateX(2deg)] md:transition-transform md:duration-500 md:hover:[transform:perspective(1400px)_rotateY(-3deg)_rotateX(0deg)]"
                style={{ borderRadius: radius.heroPanel }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12),transparent_34%,transparent_68%,rgba(241,211,138,0.14))]" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p style={{ ...typography.metadata, color: colors.goldSoft }}>Current spotlight</p>
                      <p className="mt-2 text-xl text-[#fff8eb]">
                        {spotlightVehicle.year} {spotlightVehicle.make} {spotlightVehicle.model}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#f1d38a]/18 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f1d38a]">
                      {spotlightVehicle.badge}
                    </span>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[1.75rem]">
                    <div className="relative">
                      <VehicleImageFrame vehicle={spotlightVehicle} variant="hero" priority />
                      <div className="absolute inset-x-4 bottom-4">
                        <p className="text-3xl font-medium tracking-[-0.05em] text-[#fff8eb]">
                          {formatPrice(spotlightVehicle.price)}
                        </p>
                        <p className="mt-1 text-sm text-[#d8d0c2]">
                          {spotlightVehicle.color} | {spotlightVehicle.miles.toLocaleString()} miles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                    <p className="text-sm leading-7 text-[#d8d0c2]">
                      {spotlightVehicle.description} Presented with verification posture, market framing, and enough editorial structure
                      to feel like an acquisition brief instead of a commodity card.
                    </p>
                    <Link href={`/inventory/${spotlightVehicle.id}`} className="ghost-button text-center" data-magnetic="true">
                      View Vehicle
                    </Link>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="compact">
        <EditorialContainer>
          <MotionReveal className="glass-panel rounded-[1.75rem] px-6 py-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.76rem] uppercase tracking-[0.28em] text-[#d9cfbe]">
              {trustSignals.map((signal) => (
                <span key={signal} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#d4af37]" aria-hidden="true" />
                  {signal}
                </span>
              ))}
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <MotionReveal>
              <EditorialHeader
                eyebrow="Platform structure"
                title="The homepage now needs one clear job: explain why this is a better way to transact."
                description="The strongest version of VEX is not louder. It is clearer. Inventory quality, confidence signals, and concierge ownership should stack in a predictable order so the visitor understands the product before they start browsing."
              />
            </MotionReveal>

            <FeatureGrid columns={3}>
              {operatingPillars.map((pillar, index) => (
                <MotionReveal key={pillar.title} delay={index * 0.06} className="glass-panel rounded-[1.75rem] p-6">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#f1d38a]/20 bg-[#d4af37]/10 text-sm font-semibold text-[#f1d38a]">
                    {pillar.number}
                  </div>
                  <h3 className="text-2xl text-[#fff8eb]">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#d8d0c2]">{pillar.copy}</p>
                </MotionReveal>
              ))}
            </FeatureGrid>
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="cinematic">
        <EditorialContainer>
          <MotionReveal className="vault-panel rounded-[2rem] p-7 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <EditorialHeader
                  eyebrow="Transaction flow"
                  title="A serious private deal should tighten as it moves forward."
                  description="The core VEX loop is simple: discovery, verification, concierge alignment, and a controlled close. The page should communicate that sequence without repeating itself across five different sections."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {processSteps.map((step, index) => (
                  <MotionReveal
                    key={step.number}
                    delay={index * 0.05}
                    className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5"
                  >
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#f1d38a]/70">{step.number}</p>
                    <h3 className="mt-4 text-2xl text-[#fff8eb]">{step.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#d8d0c2]">{step.copy}</p>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="default">
        <EditorialContainer>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <MotionReveal>
              <EditorialHeader
                eyebrow="Proof before desire"
                title="Luxury buyers still buy confidence before they buy rarity."
                description="The visual layer creates intrigue. The operating layer removes uncertainty. Verification signals and market posture should be visible before the buyer commits to a call, an appraisal, or a private inquiry."
              />
            </MotionReveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {proofColumns.map((column, index) => (
                <MotionReveal key={column.title} delay={index * 0.08} className="glass-panel rounded-[1.9rem] p-7">
                  <p className="section-kicker">{column.label}</p>
                  <h3 className="mt-4 text-3xl text-[#fff8eb]">{column.title}</h3>
                  <div className="mt-6 grid gap-3">
                    {column.items.map((item) => (
                      <div key={item} className="rounded-[1.2rem] border border-white/10 bg-black/24 px-4 py-3 text-sm text-[#d8d0c2]">
                        {item}
                      </div>
                    ))}
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="cinematic" atmosphere={<AutomotiveAtmosphere variant="collection" intensity="medium" />}>
        <EditorialContainer>
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="space-y-6">
              <MotionReveal>
                <EditorialHeader
                  eyebrow="Featured collection"
                  title="The inventory section should feel like a private vault, not a generic grid."
                  description="Fewer cards, stronger hierarchy, cleaner metadata, and visible confidence cues make the collection feel qualified before a user ever opens a detail page."
                />
              </MotionReveal>

              <MotionReveal delay={0.05} className="flex flex-wrap gap-3">
                {collectionBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[#f1d38a]/18 bg-[#d4af37]/10 px-4 py-2 text-xs uppercase text-[#f1d38a]"
                  >
                    {badge}
                  </span>
                ))}
              </MotionReveal>

              <MotionReveal delay={0.1} className="vault-panel rounded-[2rem] p-7">
                <p className="section-kicker">Collection posture</p>
                <div className="mt-5 space-y-5">
                  {[
                    "Each featured vehicle needs stronger editorial framing and less decorative repetition.",
                    "Trust and transaction cues should sit near the asset, not several scrolls later.",
                    "The collection preview should lead naturally into inventory exploration instead of feeling like another isolated module.",
                  ].map((note) => (
                    <p key={note} className="border-b border-white/10 pb-5 text-sm leading-7 text-[#d8d0c2] last:border-b-0 last:pb-0">
                      {note}
                    </p>
                  ))}
                </div>
              </MotionReveal>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {FEATURED_VEHICLES.slice(0, 6).map((vehicle, index) => (
                <MotionReveal key={vehicle.id} delay={index * 0.05}>
                  <VehicleCard vehicle={vehicle} />
                </MotionReveal>
              ))}
            </div>
          </div>
        </EditorialContainer>
      </SectionShell>

      <SectionShell variant="cinematic" atmosphere={<AutomotiveAtmosphere variant="cta" intensity="high" />}>
        <EditorialContainer>
          <MotionReveal className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="vault-panel rounded-[2rem] p-7 sm:p-10">
              <p className="section-kicker">Final private access</p>
              <h2 className="section-title">
                Ready to open a discreet acquisition channel, consign with context, or structure a serious private deal?
              </h2>
              <p className="section-copy max-w-xl">
                Reach the team for curated acquisition support, appraisal review, seller-first qualification, or access to inventory
                that should not be presented like an open marketplace.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {finalSignals.map((signal) => (
                  <div key={signal.label} className="rounded-[1.25rem] border border-white/10 bg-black/24 p-4">
                    <p style={{ ...typography.metadata, color: colors.textMuted }}>{signal.label}</p>
                    <p className="mt-3 text-xl text-[#fff8eb]">{signal.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="gold-button"
                  data-magnetic="true"
                  data-analytics-event="concierge_cta_click"
                  data-analytics-surface="homepage_final_cta"
                >
                  Request Private Access
                </Link>
                <Link
                  href="/inventory"
                  className="ghost-button"
                  data-magnetic="true"
                  data-analytics-event="collection_engagement"
                  data-analytics-surface="homepage_final_cta"
                >
                  Explore The Collection
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-7 sm:p-10">
              <p className="section-kicker">Response protocol</p>
              <h3 className="mt-4 text-3xl text-[#fff8eb]">One human-owned path from first inquiry to final handoff.</h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-[#d8d0c2]">
                <p>Each inquiry should move into a controlled conversation with verification, timing, and next-step clarity.</p>
                <p>{contactPhone || "Phone line configured on request"}</p>
                <p>{contactEmail || "Email contact configured on request"}</p>
                <p>Human response only. No generic queue. No low-context handoff.</p>
              </div>
            </div>
          </MotionReveal>
        </EditorialContainer>
      </SectionShell>
    </main>
  );
}
