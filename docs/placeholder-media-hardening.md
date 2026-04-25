# Placeholder media hardening strategy

This strategy keeps listing surfaces visually stable while media verification is in flight, and prevents broken card chrome when a token drift happens.

## Goals

- Never render empty or browser-default styled listing cards.
- Keep fallback visuals consistent with the core gold design tokens.
- Keep placeholder messaging explicit so users understand media state.
- Ensure API typing allows safe image-url narrowing in UI code.

## Current implementation

1. **Token-safe card styles**
   - `apps/web/src/components/FeaturedInventory.module.css`
   - `apps/web/src/components/ImmersiveVehicleCard.module.css`
   - Both now map historical accent variables to canonical tokens with literal fallbacks:
     - `--gold` / `--gold-soft`
     - `--text` / `--text-muted`
     - `--bg-soft`
     - `--line-gold`
     - `rgba(212, 175, 55, 0.3)` for accent borders

2. **Typed inventory media paths**
   - `apps/web/src/lib/api.ts`
   - `InventoryItem.vehicle.imageUrls` is now `string[] | null` instead of `unknown`, enabling safe fallback checks in listing helpers.

3. **Intentional placeholder copy**
   - Vehicle fixtures in `apps/web/src/lib/vehicles.ts` keep `primaryImage.src: null` and explicit `imageVerificationNote` messaging.
   - `VehicleImageFrame` renders premium placeholder treatment when media is pending.

## Operational guidance

- Keep placeholder state explicit (`pending` vs `verified`) and never infer from missing URLs alone.
- If media pipelines change, preserve token-backed fallbacks so card UX does not regress.
- Update this document whenever:
  - token names change,
  - media verification states change,
  - listing card components are replaced.
