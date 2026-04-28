"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { VehicleCard } from "@/components/VehicleCard";
import { EditorialContainer, SectionShell } from "@/components/layout";
import { MotionReveal } from "@/components/site/MotionReveal";
import { FEATURED_VEHICLES, formatPrice } from "@/lib/vehicles";
import type { InventoryFilters } from "@/lib/inventoryWorkflow";
import { defaultInventoryFilters, writeInventoryFilters } from "@/lib/inventoryWorkflow";

const collectionTabs = [
  {
    label: "All",
    tag: "All",
    intro: "Full curated inventory.",
  },
  {
    label: "Ultra Rare",
    tag: "Ultra Rare",
    intro: "Scarcity-led inventory for collector buyers.",
  },
  {
    label: "Track Focused",
    tag: "Track Focused",
    intro: "Driver-first exotics with motorsport DNA.",
  },
  {
    label: "Grand Touring",
    tag: "Grand Touring",
    intro: "Comfort-driven luxury vehicles for daily ownership.",
  },
];

const priceRanges = [
  { label: "All pricing", value: "all" },
  { label: "Under $250k", value: "under-250" },
  { label: "$250k-$500k", value: "250-500" },
  { label: "$500k-$1M", value: "500-1000" },
  { label: "$1M+", value: "1000-plus" },
];

const mileageRanges = [
  { label: "All mileage", value: "all" },
  { label: "Under 1k", value: "under-1000" },
  { label: "Under 5k", value: "under-5000" },
  { label: "Under 15k", value: "under-15000" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price high-low", value: "price-desc" },
  { label: "Price low-high", value: "price-asc" },
  { label: "Mileage low-high", value: "miles-asc" },
  { label: "Rarity", value: "rarity" },
];

const rarityOrder = ["Ultra Rare", "Investment Grade", "Track Focused", "Grand Touring", "Open-Air"];

function filterByPrice(price: number | null, value: string) {
  if (price === null || value === "all") {
    return true;
  }

  if (value === "under-250") return price < 250000;
  if (value === "250-500") return price >= 250000 && price <= 500000;
  if (value === "500-1000") return price > 500000 && price <= 1000000;
  return price > 1000000;
}

function filterByMileage(miles: number, value: string) {
  if (value === "all") return true;
  if (value === "under-1000") return miles < 1000;
  if (value === "under-5000") return miles < 5000;
  return miles < 15000;
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs transition ${
        active
          ? "border-[#f1d38a]/42 bg-[#d4af37]/16 text-[#fff6de]"
          : "border-white/10 bg-white/[0.04] text-[#cfc4b2] hover:border-[#f1d38a]/22 hover:text-[#fff8eb]"
      }`}
    >
      {label}
    </button>
  );
}

export function InventoryPageClient({ initialFilters }: { initialFilters: InventoryFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const filters = initialFilters;
  const { collection, make, priceRange, mileageRange, sort } = filters;

  const updateFilters = (next: Partial<InventoryFilters>) => {
    const params = writeInventoryFilters({
      ...filters,
      ...next,
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const makes = ["All", ...Array.from(new Set(FEATURED_VEHICLES.map((vehicle) => vehicle.make)))];
  const activeCollection = collectionTabs.find((tab) => tab.label === collection) ?? collectionTabs[0];

  const filtered = useMemo(() => {
    const byCollection =
      activeCollection.tag === "All"
        ? FEATURED_VEHICLES
        : FEATURED_VEHICLES.filter((vehicle) => vehicle.collectionTags.includes(activeCollection.tag));

    return byCollection.filter((vehicle) => {
      const matchesMake = make === "All" || vehicle.make === make;
      return matchesMake && filterByPrice(vehicle.price, priceRange) && filterByMileage(vehicle.miles, mileageRange);
    });
  }, [activeCollection.tag, make, mileageRange, priceRange]);

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      if (sort === "price-desc") return (right.price ?? 0) - (left.price ?? 0);
      if (sort === "price-asc") return (left.price ?? 0) - (right.price ?? 0);
      if (sort === "miles-asc") return left.miles - right.miles;
      if (sort === "rarity") return rarityOrder.indexOf(left.rarityTier) - rarityOrder.indexOf(right.rarityTier);
      return right.year - left.year;
    });
  }, [filtered, sort]);

  const pendingImageCount = sorted.filter((vehicle) => vehicle.primaryImage.status === "pending").length;
  const topVehicle = sorted[0] ?? FEATURED_VEHICLES[0];
  const hasActiveFilters = collection !== "All" || make !== "All" || priceRange !== "all" || mileageRange !== "all" || sort !== "newest";

  const resetFilters = () => {
    const query = writeInventoryFilters(defaultInventoryFilters).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const inventoryHref = writeInventoryFilters(filters).toString();

  return (
    <main id="main-content">
      <SectionShell variant="default">
        <EditorialContainer>
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Inventory</p>
            <h1 className="section-title mt-5">Private vehicle listings</h1>
            <p className="section-copy mx-auto mt-5">
              Clean inventory cards with verified media, clear pricing, and direct access to details.
            </p>
            <p className="mt-4 text-sm text-[#cfc4b2]">
              Showing {sorted.length} vehicles{pendingImageCount > 0 ? ` · ${pendingImageCount} pending media` : ""}
            </p>
          </MotionReveal>

          <MotionReveal delay={0.06} className="mt-8 rounded-2xl border border-white/10 p-5">
            <div className="flex flex-wrap gap-2">
              {collectionTabs.map((tab) => (
                <FilterPill key={tab.label} label={tab.label} active={collection === tab.label} onClick={() => updateFilters({ collection: tab.label })} />
              ))}
            </div>
            <p className="mt-4 text-sm text-[#cfc4b2]">{activeCollection.intro}</p>
          </MotionReveal>

          <MotionReveal delay={0.1} className="mt-6 rounded-2xl border border-white/10 p-5">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#a99f8d]">Make</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {makes.map((option) => (
                    <FilterPill key={option} label={option} active={make === option} onClick={() => updateFilters({ make: option })} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#a99f8d]">Price</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {priceRanges.map((option) => (
                    <FilterPill
                      key={option.value}
                      label={option.label}
                      active={priceRange === option.value}
                      onClick={() => updateFilters({ priceRange: option.value })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#a99f8d]">Mileage</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mileageRanges.map((option) => (
                    <FilterPill
                      key={option.value}
                      label={option.label}
                      active={mileageRange === option.value}
                      onClick={() => updateFilters({ mileageRange: option.value })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#a99f8d]">Sort</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <FilterPill key={option.value} label={option.label} active={sort === option.value} onClick={() => updateFilters({ sort: option.value })} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[#cfc4b2]">
                {topVehicle ? `Top result: ${topVehicle.year} ${topVehicle.make} ${topVehicle.model} · ${formatPrice(topVehicle.price)}` : "No matching vehicles"}
              </p>
              {hasActiveFilters ? (
                <button type="button" className="ghost-button !px-4 !py-2" onClick={resetFilters}>
                  Reset
                </button>
              ) : null}
            </div>
          </MotionReveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {sorted.length > 0 ? (
              sorted.map((vehicle, index) => (
                <MotionReveal key={vehicle.id} delay={index * 0.04}>
                  <VehicleCard vehicle={vehicle} inventoryHref={inventoryHref} />
                </MotionReveal>
              ))
            ) : (
              <MotionReveal className="rounded-2xl border border-white/10 p-8 lg:col-span-2 2xl:col-span-3">
                <h3 className="text-2xl text-[#fff8eb]">No vehicles match this filter.</h3>
                <p className="mt-3 text-sm text-[#d8d0c2]">Try another collection, make, price, or mileage range.</p>
              </MotionReveal>
            )}
          </div>
        </EditorialContainer>
      </SectionShell>
    </main>
  );
}
