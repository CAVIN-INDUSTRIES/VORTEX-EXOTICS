import type { Vehicle } from "@/lib/vehicles";

export type InventoryFilters = {
  collection: string;
  make: string;
  priceRange: string;
  mileageRange: string;
  sort: string;
};

export const defaultInventoryFilters: InventoryFilters = {
  collection: "All",
  make: "All",
  priceRange: "all",
  mileageRange: "all",
  sort: "newest",
};

export function readInventoryFilters(searchParams: URLSearchParams): InventoryFilters {
  return {
    collection: searchParams.get("collection") || defaultInventoryFilters.collection,
    make: searchParams.get("make") || defaultInventoryFilters.make,
    priceRange: searchParams.get("price") || defaultInventoryFilters.priceRange,
    mileageRange: searchParams.get("mileage") || defaultInventoryFilters.mileageRange,
    sort: searchParams.get("sort") || defaultInventoryFilters.sort,
  };
}

export function readInventoryFiltersFromRecord(searchParams: Record<string, string | string[] | undefined>): InventoryFilters {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  }

  return readInventoryFilters(params);
}

export function writeInventoryFilters(filters: InventoryFilters) {
  const params = new URLSearchParams();

  if (filters.collection !== defaultInventoryFilters.collection) params.set("collection", filters.collection);
  if (filters.make !== defaultInventoryFilters.make) params.set("make", filters.make);
  if (filters.priceRange !== defaultInventoryFilters.priceRange) params.set("price", filters.priceRange);
  if (filters.mileageRange !== defaultInventoryFilters.mileageRange) params.set("mileage", filters.mileageRange);
  if (filters.sort !== defaultInventoryFilters.sort) params.set("sort", filters.sort);

  return params;
}

export function readInventoryBackHref(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const key of ["collection", "make", "price", "mileage", "sort"]) {
    const value = searchParams[key];
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/inventory?${query}` : "/inventory";
}

export function vehicleDisplayName(vehicle: Vehicle) {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.replace(/\s+/g, " ").trim();
}

function buildVehicleIntentHref(
  pathname: "/contact" | "/appraisal",
  vehicle: Vehicle,
  intent: "private-access" | "trade-appraisal" | "vehicle-inquiry",
  returnTo?: string
) {
  const params = new URLSearchParams();
  params.set("vehicle", vehicle.id);
  params.set("vehicleLabel", vehicleDisplayName(vehicle));
  params.set("intent", intent);
  if (returnTo) {
    params.set("returnTo", returnTo);
  }
  return `${pathname}?${params.toString()}`;
}

export function buildVehicleContactHref(vehicle: Vehicle, returnTo?: string) {
  return buildVehicleIntentHref("/contact", vehicle, "private-access", returnTo);
}

export function buildVehicleInquiryHref(vehicle: Vehicle, returnTo?: string) {
  return buildVehicleIntentHref("/contact", vehicle, "vehicle-inquiry", returnTo);
}

export function buildVehicleAppraisalHref(vehicle: Vehicle, returnTo?: string) {
  return buildVehicleIntentHref("/appraisal", vehicle, "trade-appraisal", returnTo);
}
