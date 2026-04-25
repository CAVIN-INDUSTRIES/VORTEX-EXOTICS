import Link from "next/link";
import { MotionReveal } from "@/components/site/MotionReveal";

const sellerBenefits = [
  "Private listing visibility with qualified buyer access",
  "Editorial presentation tuned for rarity and confidence",
  "Concierge support for inspection, transport, and handover",
];

export default function SellPage() {
  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <MotionReveal className="max-w-3xl">
        <p className="section-kicker">Seller entry</p>
        <h1 className="section-title">For owners who want more than exposure.</h1>
        <p className="section-copy">
          Listing with VEX should feel private, intentional, and premium from the first touch.
          We shape the narrative, control the audience, and manage the conversation with collector-grade discipline.
        </p>
      </MotionReveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <MotionReveal className="glass-panel rounded-[2rem] p-7 sm:p-9">
          <p className="section-kicker">Seller promise</p>
          <h2 className="mt-4 text-3xl text-[#fff8eb]">The right buyer, the right framing, the least-friction close.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[#d8d0c2]">
            {sellerBenefits.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#d4af37]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MotionReveal>

        <MotionReveal delay={0.08} className="cinema-panel rounded-[2rem] p-7 sm:p-9">
          <p className="section-kicker">Submission</p>
          <h2 className="mt-4 text-3xl text-[#fff8eb]">Start a private vehicle review.</h2>
          <p className="mt-5 text-base leading-8 text-[#d8d0c2]">
            Share the vehicle, desired timeline, and any important provenance. The team responds with a tailored path,
            not a commodity intake sequence.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/private-acquisition" className="gold-button">
              Begin Private Consultation
            </Link>
            <Link href="/contact" className="gold-button">
              Submit your vehicle
            </Link>
            <Link href="/how-it-works" className="ghost-button">
              Review the process
            </Link>
          </div>
        </MotionReveal>
      </div>
    </main>
  );
}
