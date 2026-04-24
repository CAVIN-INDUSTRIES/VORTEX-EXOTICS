import Image from "next/image";
import Link from "next/link";
import { FEATURED_VEHICLES, formatPrice } from "@/lib/vehicles";
import { responsiveImage } from "@/lib/media/responsiveImage";

const categoryStories = [
  {
    title: "Ultra Rare",
    copy: "Inventory where scarcity, allocation posture, replacement difficulty, or collector attention changes the acquisition conversation.",
    signal: "Access-first",
  },
  {
    title: "Investment Grade",
    copy: "Vehicles framed by specification quality, mileage posture, desirability, and long-term ownership confidence rather than surface drama alone.",
    signal: "Market-aware",
  },
  {
    title: "Track Focused",
    copy: "Motorsport-bred machines where aero, braking, chassis, response, and driver intent are part of the reason the car deserves the room.",
    signal: "Technical proof",
  },
];

export function CollectionNarrativeEngine() {
  const signatureVehicle = FEATURED_VEHICLES.find((vehicle) => vehicle.make === "Bugatti") ?? FEATURED_VEHICLES[0];

  return (
    <section className="mt-12 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
        <div className="cinema-panel rounded-[2rem] p-7 sm:p-9">
          <p className="section-kicker">Collection narrative</p>
          <h2 className="section-title">A private archive should explain why each car deserves access.</h2>
          <p className="section-copy">
            The VEX collection is organized around acquisition standards: rarity, condition class, market confidence,
            verification posture, and how the vehicle fits a serious collector or high-intent buyer.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-[#d8d0c2]">
            {["Curated intake before public exposure", "Visible confidence signals before inquiry", "Concierge path for acquisition and delivery"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-[#f1d38a]" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <Link
          href={`/inventory/${signatureVehicle.id}`}
          prefetch={false}
          data-analytics-event="vehicle_detail_engagement"
          data-analytics-surface="collection_signature_highlight"
          data-analytics-vehicle-id={String(signatureVehicle.id)}
          className="group glass-panel overflow-hidden rounded-[2rem]"
        >
          <div className="grid min-h-full md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[20rem]">
              <Image
                {...responsiveImage(signatureVehicle.image, "editorial")}
                alt={`${signatureVehicle.year} ${signatureVehicle.make} ${signatureVehicle.model}`}
                fill
                className="luxury-photo object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-9">
              <div>
                <p className="section-kicker">Signature vehicle highlight</p>
                <h3 className="mt-5 font-[var(--font-display)] text-4xl leading-none text-[#fff8eb]">
                  {signatureVehicle.year} {signatureVehicle.make} {signatureVehicle.model}
                </h3>
                <p className="mt-5 text-sm leading-7 text-[#d8d0c2]">{signatureVehicle.description}</p>
              </div>
              <div className="mt-8 grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[#a99f8d]">Rarity</span>
                  <span className="text-[#fff8eb]">{signatureVehicle.rarityTier}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[#a99f8d]">Confidence</span>
                  <span className="text-[#fff8eb]">{signatureVehicle.verificationStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#a99f8d]">Private file</span>
                  <span className="text-[#f1d38a]">{formatPrice(signatureVehicle.price)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {categoryStories.map((story) => (
          <article key={story.title} className="glass-panel rounded-[1.65rem] p-6">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#f1d38a]/70">{story.signal}</p>
            <h3 className="mt-4 text-2xl text-[#fff8eb]">{story.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#d8d0c2]">{story.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
