import Link from "next/link";
import { glass, radius, spacing } from "@vex/design-system";
import type { Vehicle } from "@/lib/vehicles";
import { formatPrice } from "@/lib/vehicles";
import { buildVehicleContactHref, vehicleDisplayName } from "@/lib/inventoryWorkflow";
import { SaveVehicleButton } from "@/components/inventory/SaveVehicleButton";
import { VehicleImageFrame } from "@/components/inventory/VehicleImageFrame";

function metadataPills(vehicle: Vehicle) {
  return [vehicle.verifiedBadge, vehicle.availabilityBadge];
}

export function VehicleCard({ vehicle, inventoryHref }: { vehicle: Vehicle; inventoryHref?: string }) {
  const metadata = metadataPills(vehicle);
  const detailHref = inventoryHref ? `/inventory/${vehicle.id}?${inventoryHref}` : `/inventory/${vehicle.id}`;
  const contactHref = buildVehicleContactHref(vehicle, detailHref);

  return (
    <article
      className="group overflow-hidden border border-white/10 bg-[#090909]/82 transition duration-300 hover:-translate-y-1 hover:border-[#f1d38a]/30"
      style={{ borderRadius: radius.xl, background: glass.cardGlass }}
    >
      <div className="relative">
        <Link
          href={detailHref}
          prefetch={false}
          data-analytics-event="vehicle_detail_engagement"
          data-analytics-surface="vehicle_card_image"
          data-analytics-vehicle-id={String(vehicle.id)}
          data-analytics-vehicle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="block"
        >
          <VehicleImageFrame vehicle={vehicle} />
        </Link>
      </div>

      <div className="space-y-5 p-5 sm:p-6" style={{ padding: spacing.stackLg }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-2xl text-[#fff8eb]">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#bfa987]">{vehicle.trim}</p>
          </div>
          <p className="text-xl font-semibold text-[#f1d38a]">{formatPrice(vehicle.price)}</p>
        </div>

        <p className="text-sm leading-6 text-[#d8d0c2]">{vehicle.editorialHeadline}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-3 text-sm text-[#e8dfd1]">
            <span className="text-[#a99f8d]">Mileage:</span> {vehicle.miles.toLocaleString()} mi
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-sm text-[#e8dfd1]">
            <span className="text-[#a99f8d]">Location:</span> {vehicle.location}
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-sm text-[#e8dfd1]">
            <span className="text-[#a99f8d]">Power:</span> {vehicle.horsepower} hp
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-sm text-[#e8dfd1]">
            <span className="text-[#a99f8d]">Status:</span> {vehicle.availabilityBadge}
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.08em] text-[#bcae97]">
          {metadata.filter(Boolean).join(" · ")}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Link href={contactHref} className="gold-button text-center">
              {vehicle.ctas.primary}
            </Link>
            <Link href={detailHref} className="ghost-button text-center">
              {vehicle.ctas.secondary}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a99f8d]">{vehicleDisplayName(vehicle)}</span>
            <SaveVehicleButton vehicleId={vehicle.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
