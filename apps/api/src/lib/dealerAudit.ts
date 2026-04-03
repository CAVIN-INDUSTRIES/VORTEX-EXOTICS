/**
 * Cross-surface correlation for dealer DMS / ERP / automation audit trails.
 * Use in AuditLog.payload, EventLog.payload, and integration meta for traceability.
 */
export const DEALER_AUDIT_SCHEMA_VERSION = 1 as const;

export function newDealerCorrelationId(): string {
  return `vex_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}
