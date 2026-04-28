import Link from "next/link";

const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="shell grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-montserrat)] text-[0.7rem] uppercase tracking-[0.38em] text-[#f1d38a]">VEX Atelier</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[1.3rem] leading-none text-[#f5f1e8]">
            Private automotive operating environment
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#cfc4b2]">
            Concierge-led inventory, acquisition flow, and dealer-grade operational continuity for premium automotive clients.
          </p>
        </div>

        <div className="space-y-3 text-sm text-[#cfc4b2]">
          <p className="uppercase tracking-[0.24em] text-[#f1d38a]/70">Explore</p>
          <Link href="/inventory" className="block transition hover:text-[#fff8eb]">Inventory</Link>
          <Link href="/how-it-works" className="block transition hover:text-[#fff8eb]">Experience</Link>
          <Link href="/sell" className="block transition hover:text-[#fff8eb]">Sell</Link>
        </div>

        <div className="space-y-3 text-sm text-[#cfc4b2]">
          <p className="uppercase tracking-[0.24em] text-[#f1d38a]/70">Company</p>
          <Link href="/pricing" className="block transition hover:text-[#fff8eb]">Pricing</Link>
          <Link href="/privacy" className="block transition hover:text-[#fff8eb]">Privacy</Link>
          <Link href="/terms" className="block transition hover:text-[#fff8eb]">Terms</Link>
        </div>

        <div className="space-y-3 text-sm text-[#cfc4b2]">
          <p className="uppercase tracking-[0.24em] text-[#f1d38a]/70">Direct</p>
          <a href={contactPhone ? `tel:${contactPhone.replace(/\D/g, "")}` : undefined} className="block transition hover:text-[#fff8eb]">
            {contactPhone || "Phone on request"}
          </a>
          <a href={contactEmail ? `mailto:${contactEmail}` : undefined} className="block transition hover:text-[#fff8eb]">
            {contactEmail || "Email on request"}
          </a>
          <p className="pt-2 text-xs uppercase tracking-[0.24em] text-[#9f927d]">Human-led response only</p>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="shell flex flex-col gap-3 py-5 text-xs uppercase tracking-[0.18em] text-[#9f927d] md:flex-row md:items-center md:justify-between">
          <p>Copyright {year} VEX Atelier</p>
          <p>Private acquisitions, selective consignment, premium automotive operations</p>
        </div>
      </div>
    </footer>
  );
}
