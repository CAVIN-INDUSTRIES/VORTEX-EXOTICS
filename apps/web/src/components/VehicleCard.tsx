import Image from "next/image";
import Link from "next/link";
import { colors, radius, spacing, typography } from "@vex/design-system";
import { formatPrice } from "@/lib/vehicles";
import type { Vehicle } from "@/lib/vehicles";
import { vehicleImageProps } from "@/lib/media/responsiveImage";

function getVehicleMetadata(vehicle: Vehicle) {
  const mileageQuality = vehicle.miles < 500 ? "Delivery-mile" : vehicle.miles < 1500 ? "Low-mile" : "Driven";

  return [
    vehicle.verificationStatus,
    mileageQuality,
    vehicle.conditionClass,
    vehicle.acquisitionStatus,
  ];
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const metadata = getVehicleMetadata(vehicle);

  return (
    <Link
      href={`/inventory/${vehicle.id}`}
      prefetch={false}
      data-analytics-event="vehicle_detail_engagement"
      data-analytics-surface="vehicle_card"
      data-analytics-vehicle-id={String(vehicle.id)}
      data-analytics-vehicle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      className="group glass-panel archive-card vehicle-tile overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#f1d38a]/32"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          {...vehicleImageProps(vehicle.image)}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="luxury-photo object-cover transition duration-700 group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_22%),linear-gradient(0deg,rgba(0,0,0,0.82),rgba(0,0,0,0.08)_58%,transparent)]" />
        <span
          className="absolute left-4 top-4 rounded-full border border-[#f1d38a]/22 bg-black/55 px-3 py-1 text-[#f1d38a]"
          style={{ ...typography.metadata }}
        >
          {vehicle.badge}
        </span>
      </div>
      <div className="space-y-4 p-5" style={{ padding: spacing.stackLg }}>
        <div className="space-y-2">
          <p className="text-[#fff8eb]" style={{ ...typography.displaySection, fontSize: "clamp(2rem, 4vw, 2.45rem)" }}>
            {vehicle.year} {vehicle.make}
          </p>
          <p className="text-base text-[#d8d0c2]" style={{ ...typography.bodyLarge, marginTop: 0 }}>
            {vehicle.model}
          </p>
        </div>
        <div className="editorial-rule" />
        <p className="text-sm text-[#a99f8d]" style={{ ...typography.metadata, color: colors.textMuted, letterSpacing: "0.18em" }}>
          {vehicle.color} · {vehicle.miles.toLocaleString()} miles
        </p>
        <div
          className="grid gap-2 border border-[#f1d38a]/12 bg-[#d4af37]/7 p-3"
          style={{ borderRadius: radius.lg }}
        >
          <p style={{ ...typography.metadata, color: colors.goldSoft }}>Rarity tier</p>
          <p className="text-sm leading-6 text-[#fff8eb]">{vehicle.rarityTier}</p>
          <p className="text-xs leading-5 text-[#a99f8d]">
            {vehicle.drivetrain} · {vehicle.performance}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center leading-4 text-[#cfc4b2]"
              style={{ ...typography.metadata, letterSpacing: "0.14em" }}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p style={{ ...typography.metadata, color: colors.textMuted }}>Private file value</p>
            <p className="mt-2 text-xl font-semibold text-[#f1d38a]">{formatPrice(vehicle.price)}</p>
          </div>
          <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-[#f5f1e8] transition group-hover:border-[#f1d38a]/30 group-hover:text-[#fff8eb]">
            Private file
          </span>
        </div>
      </div>
    </Link>
  );
}
