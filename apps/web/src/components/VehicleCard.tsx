import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import { formatPrice } from "@/lib/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/inventory/${vehicle.id}`}
      className="group glass-panel overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-[#f1d38a]/24"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 980px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-[#f1d38a]/22 bg-black/55 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-[#f1d38a]">
          {vehicle.badge}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="font-[var(--font-display)] text-3xl leading-none tracking-[-0.04em] text-[#fff8eb]">
            {vehicle.year} {vehicle.make}
          </p>
          <p className="mt-1 text-base text-[#d8d0c2]">{vehicle.model}</p>
        </div>
        <p className="text-sm text-[#a99f8d]">
          {vehicle.color} | {vehicle.miles.toLocaleString()} mi
        </p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xl font-semibold text-[#f1d38a]">{formatPrice(vehicle.price)}</p>
          <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-[#f5f1e8] transition group-hover:border-[#f1d38a]/30 group-hover:text-[#fff8eb]">
            View detail
          </span>
        </div>
      </div>
    </Link>
  );
}
