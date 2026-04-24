import { readInventoryFiltersFromRecord } from "@/lib/inventoryWorkflow";
import { InventoryPageClient } from "./InventoryPageClient";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = readInventoryFiltersFromRecord(resolvedSearchParams);

  return <InventoryPageClient initialFilters={initialFilters} />;
}
