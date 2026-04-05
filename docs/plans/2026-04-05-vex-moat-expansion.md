# VEX moat expansion v2.0 — luxury velocity vs legacy DMS giants

**Purpose:** Strategic blueprint to widen VEX’s competitive moat against Dealertrack, Cox Automotive, CDK, Reynolds — not on integration breadth, but on **luxury velocity**, **cinematic UX**, **autonomous deal orchestration**, and **open, white-label front ends**.

**Related:** [2025-03-15-vex-luxury-marketplace-implementation.md](./2025-03-15-vex-luxury-marketplace-implementation.md), [2026-04-05-vex-DIGITAL-PRESENCE-v2-ELITE.md](./2026-04-05-vex-DIGITAL-PRESENCE-v2-ELITE.md).

---

## Positioning (why we win)

| Giant weakness | VEX answer |
|----------------|------------|
| Steep learning curves, dated grids/forms | Full-viewport R3F hero, magnetic / liquid-metal CTAs, glass KPIs |
| High integration fees ($40k+/yr class) | Self-serve onboarding, transparent MRR, tenant-scoped APIs |
| Slow multi-day email/compliance loops | BullMQ `deal-orchestration` job: valuation warm → PDF → Stripe hooks (expandable) |
| Vendor lock-in, glacial innovation in luxury | Open REST + Zod contracts; we are the **beautiful layer** DMS cannot clone |

---

## 18-month roadmap (summary)

| Phase | Window | Focus |
|-------|--------|--------|
| **1** | Q2 2026 | Cinematic hero v2, tenant 3D branding (`TenantCinematic3dSchema`), `POST /deals/autonomous`, configure-by-slug, CRM visual parity |
| **2** | Q3–Q4 2026 | GraphQL read layer (select domains), workflow builder MVP, deeper DMS outbound sync |
| **3** | 2027 H1 | AI fraud + inventory velocity scores, multi-region residency hardening |
| **4** | 2027 H2 | Partner marketplace, institutional reporting exports |

---

## Phase 1 — repo deliverables (this drop)

### Web (`apps/web`)

- Hero: `DynamicHeroShell` → `VortexHeroScene` — SSR-safe; reads `--accent` / `--accent-bright` into `brand` for particles + iridescent paint.
- **LiquidMetalCTA** on primary configure CTA.
- **Configure:** `/configure/[tenantSlug]` → `resolveTenantConfigureGlb` (extend map per tenant).
- Scripts: `dev:moat` (= cinematic mode), `moat:build` (Next build for turbo).

### UI (`packages/ui`)

- Exports: `CinematicCarViewer`, `LiquidMetalCTA`, `ParticleVortex`, `EffectStack`, `VortexHeroScene`, `VortexHeroBrand`, `HeroLuxuryPaintOptions`.
- `applyHeroLuxuryCarPaint` accepts tenant accent hex.

### Shared (`packages/shared`)

- `AutonomousDealOrchestrationSchema` — `appraisalId`, optional `correlationId`.
- `TenantCinematic3dSchema` — `glbUrl`, `heroEnvPreset`, `logoUrl`, `heroPaintAccentHex`.

### API (`apps/api`)

- `POST /deals/autonomous` — `STAFF` \| `ADMIN` \| `GROUP_ADMIN`, Zod body, enqueues **`deal-orchestration`** on `vex-main` queue.
- Worker chains: `EventLog` → `valuation-cache-warm` → `appraisal-pdf-generate` → Stripe stub log (real billing hooks later).
- Valuation **daily $5 cap** remains in `ValuationService` / `POST /appraisals/valuate` (not duplicated here).

### CRM (`apps/crm`)

- Shared cinematic void: body `box-shadow` vignette + existing radial accents (tenant `TenantThemeProvider` unchanged).

---

## Integration matrix (VEX as front-end layer)

| System | VEX role | Mechanism already in tree |
|--------|----------|---------------------------|
| Fortellis / CDK-style | Outbound inventory/appraisal | `enqueueFortellis*`, `enqueueCdk*` in `queue.ts` |
| Tekion / Reynolds / Dealertrack | FI / inventory adapters | Integration routes + webhooks |
| Stripe | Checkout + subscriptions | `stripe` router, webhooks |
| **VEX** | **Luxury UX + orchestration** | Web `@vex/ui/3d`, CRM glass tokens, `deal-orchestration` |

*Giants keep compliance depth; VEX owns the experience and speed-to-cash.*

---

## Ticket breakdown (ongoing)

| Area | Tickets |
|------|---------|
| Web | Hero perf (dpr cap), Lenis + GSAP camera polish, Lighthouse 98+ budget |
| CRM | 3D inventory cards, collaborative deal canvas |
| API | Real Stripe session from `deal-orchestration`, CRM notification channel |
| UI | LOD + HDRI per tenant CDN |

---

## Acceptance criteria (Phase 1)

- [ ] `pnpm -w turbo run build` green.
- [ ] `pnpm --filter @vex/web run quality:web` (lint + `test:smoke` + lighthouse as configured).
- [ ] Hero: 60 fps **manual** on reference hardware; CI asserts hero `canvas` has non-zero size when WebGL mounts (no flaky FPS in headless).
- [ ] Every net-new surface maps to KPI hypothesis: dwell ↑40%, configurator engagement ↑3×, Stripe session start ↑2× (instrument in analytics).

---

## KPI dashboard wireframes (conceptual)

**Owner / pilot command**

```
┌─────────────────────────────────────────────────────────────┐
│  VEX Moat KPIs (tenant: ___________)   range: [7d ▾]        │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Hero dwell (p95)│ Config sessions │ Stripe session starts    │
│   +____% vs base│   ____ / week   │   ____ / week            │
├─────────────────┴─────────────────┴─────────────────────────┤
│ Funnel: / → /build → checkout_started                        │
│ [■■■■■■■■□□]  (sankey or step bars)                          │
├───────────────────────────────────────────────────────────────┤
│ Autonomous jobs: deal-orchestration completed / failed         │
└───────────────────────────────────────────────────────────────┘
```

**Data sources (future wiring):** `EventLog`, `UsageLog`, Stripe webhooks, CRM activity — all tenant-scoped.

---

## Verification

```bash
cd ~/Documents/vex-website
pnpm install --frozen-lockfile
pnpm --filter @vex/shared build
pnpm --filter @vex/api run db:generate
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
```

Manual: `pnpm dev:web` or `pnpm --filter @vex/web run dev:moat` → `localhost:3000` — full-screen hero, bloom, magnetic CTA, Lenis (if enabled in layout).

---

## API reference

- **`POST /deals/autonomous`** — Body: `{ "appraisalId": "<cuid>", "correlationId"?: "<optional>" }` — Response: `202` + `correlationId` (always returned for idempotency tracing).

*Reverse-proxy note:* If your gateway mounts the API under `/api`, the path becomes `/api/deals/autonomous`; the Express app mounts `/deals` at the origin.
