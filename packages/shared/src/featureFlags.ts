export type FeatureFlagKey =
  | "crm.inventory.create"
  | "crm.customers.create"
  | "crm.orders.create"
  | "crm.leads.create";

export type FeatureFlagMap = Record<FeatureFlagKey, boolean>;

export const defaultFeatureFlags: FeatureFlagMap = {
  "crm.inventory.create": true,
  "crm.customers.create": true,
  "crm.orders.create": true,
  "crm.leads.create": true,
};

export function isFeatureEnabled(flags: Partial<FeatureFlagMap> | undefined, key: FeatureFlagKey): boolean {
  if (!flags) return defaultFeatureFlags[key];
  return flags[key] ?? defaultFeatureFlags[key];
}

