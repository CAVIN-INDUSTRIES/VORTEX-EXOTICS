import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getVehicleById } from "@/lib/vehicles";
import { MotionReveal } from "@/components/site/MotionReveal";

const SERVICE_POINTS = [
  "Private introductions handled by a concierge instead of an anonymous lead queue.",
  "Inspection, transport, and handover aligned around buyer and seller timelines.",
  "Presentation designed for confidence, scarcity, and collector-grade discretion.",
];

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = getVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
  const phoneHref = contactPhone.replace(/\D/g, "");
  const maskedVin = `${"*".repeat(Math.max(0, vehicle.vin.length - 6))}${vehicle.vin.slice(-6)}`;

  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <MotionReveal>
        <Link href="/inventory" className="inline-flex items-center gap-2 text-sm text-[#bcae97] transition hover:text-[#fff8eb]">
          <span aria-hidden="true">←</span>
          Back to inventory
        </Link>
      </MotionReveal>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <MotionReveal className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/25">
            <div className="relative aspect-[16/11]">
              <Image
                src={vehicle.image}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {SERVICE_POINTS.map((point) => (
              <div key={point} className="glass-panel rounded-[1.5rem] p-5 text-sm leading-7 text-[#d8d0c2]">
                {point}
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.08} className="cinema-panel rounded-[2rem] p-7 sm:p-9">
          <p className="section-kicker">{vehicle.badge}</p>
          <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.94] tracking-[-0.05em] text-[#fff8eb]">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#b8ac98]">
            {vehicle.color} | {vehicle.miles.toLocaleString()} miles | VIN {maskedVin}
          </p>
          <p className="mt-5 text-4xl font-semibold text-[#f1d38a]">{formatPrice(vehicle.price)}</p>
          <p className="mt-5 text-base leading-8 text-[#d8d0c2]">{vehicle.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={`/contact?vehicle=${vehicle.id}`} className="gold-button">
              Request more information
            </Link>
            <Link href="/contact" className="ghost-button">
              Schedule private viewing
            </Link>
          </div>

          <div className="mt-8 grid gap-3">
            {[
              { label: "Seller status", value: `Verified since ${vehicle.sellerSince}` },
              { label: "Market stance", value: "Privately presented" },
              { label: "Delivery support", value: "Inspection, transport, and handover" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-[#a99f8d]">{item.label}</span>
                <span className="text-sm text-[#fff8eb]">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-[#f1d38a]/16 bg-[#d4af37]/8 p-5">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#f1d38a]/70">Direct line</p>
            <p className="mt-3 text-sm leading-7 text-[#d8d0c2]">
              A dedicated VEX concierge handles this vehicle from first inquiry through final closing.
            </p>
            {phoneHref ? (
              <a href={`tel:${phoneHref}`} className="mt-4 inline-flex text-lg text-[#fff8eb] transition hover:text-[#f1d38a]">
                {contactPhone}
              </a>
            ) : (
              <p className="mt-4 text-sm text-[#bcae97]">Phone contact is not configured.</p>
            )}
          </div>
        </MotionReveal>
      </div>
    </main>
  );
}
