# VEX Digital Presence v2 — Elite Luxury Automotive Framework

**Status:** Phase 0–1 in progress. **Technical foundation:** `apps/web` (Next 14, R3F, drei, postprocessing, GSAP, Lenis), `apps/crm`, `@vex/ui`, `@vex/shared`.

This document is the **master execution map**: phased tickets, acceptance criteria, funnel mapping, and KPI targets. Link-only from `PROJECT_SPACE.md` — do not duplicate long-form content elsewhere.

---

## Strategic funnel → visuals → business outcomes

| Stage | Primary surfaces | Visual intent | Business outcome |
|--------|-------------------|---------------|------------------|
| **Awareness** | Marketing `/`, investor deck | Cinematic hero, motion, brand recall | ↑ time-on-site, ↓ bounce |
| **Consideration** | Configurator, inventory, build | PBR 3D, glass pickers, trust | ↑ configurator sessions, saves |
| **Conversion** | Checkout, contact, pilot signup | Frictionless UI, Stripe trust | ↑ checkout completion, pilot leads |
| **Retention** | CRM dashboards, appraisals, orders | Dark luxury parity with web | ↑ daily active staff, NRR narrative |
| **Expansion** | MRR admin, scaling pages | KPI glass cards, subtle depth | Investor + board confidence |

**KPI targets (directional — calibrate per tenant analytics):**

| Metric | Target | Notes |
|--------|--------|--------|
| Time on site (marketing) | **40%+** vs baseline | Hero + configurator depth |
| Configurator engagement | **3×** interactions/session vs baseline | Saves, material toggles, orbits |
| Hero → CTA click-through | Track `Configure` / `Join dealer` | A/B hero v1 vs v2 |
| Lead → CRM create | 100% API path audited | Tenant-scoped, idempotent |
| Lighthouse performance (home) | **≥ 95** perf (budgeted) | Dynamic imports, DPR caps, no double WebGL |

**White-label:** All new UI must read **CSS variables** (`--vex-*`, `--text-*`, `--line`) for tenant theming; 3D uses shared tokens from `@vex/ui` where possible.

---

## Phase 0 — Foundation (0–24h)

| ID | Ticket | Owner | Acceptance criteria |
|----|--------|-------|---------------------|
| P0-1 | Master plan (this doc) + `PROJECT_SPACE` link | PM / eng | Linked hub; phases traceable |
| P0-2 | `@vex/ui` luxury tokens + elite primitives | FE | `vexLuxuryTokens` + `MagneticButton`, `Luxury3DCard`, `GlassKPI` exported; `pnpm --filter @vex/ui run build` green |
| P0-3 | Storybook for UI primitives | FE | **Pending:** add `@storybook/react` + stories per primitive (not yet in repo) |
| P0-4 | `quality:web` script | FE | `lint` + `a11y`; Lighthouse optional (needs running URL / LHCI config) |

---

## Phase 1 — Hero: attention magnet (24–48h)

| ID | Ticket | Acceptance criteria |
|----|--------|---------------------|
| P1-1 | `CinematicHeroV2` behind `NEXT_PUBLIC_CINEMATIC_HERO_V2` | Full-viewport R3F; PBR + post stack; fallback when WebGL / reduced motion |
| P1-2 | `applyHeroLuxuryCarPaint` (MeshPhysicalMaterial) | Iridescence / clearcoat / sheen on body meshes; respects asset structure |
| P1-3 | Post-processing stack | Bloom, DOF, chromatic aberration, noise, vignette; tunable props |
| P1-4 | Micro-interactions | Magnetic CTA (`MagneticButton`); cursor-reactive rim light (Phase 1+) |
| P1-5 | GSAP + Lenis camera orbit on scroll | Integrate with existing `CinematicMotionProvider` patterns |
| P1-6 | GodRays / outline / selective bloom | Add when sun mesh + selection pipeline defined |

**Fallback:** Poster-grade gradient + static copy (no seizure, no motion when `prefers-reduced-motion`).

---

## Phase 2 — Configurator v2 — `/configure/[slug]`

| ID | Ticket | Acceptance criteria |
|----|--------|---------------------|
| P2-1 | Route + tenant resolution | Scoped to public catalog rules |
| P2-2 | Live material swap + exploded view | Raycast hotspots; performance budget |
| P2-3 | Stripe Checkout from config state | Reuse existing checkout session API |
| P2-4 | Save / share / PDF | CRM + `@react-pdf` path aligned with appraisals |

---

## Phase 3 — Marketplace + CRM visual overhaul

| ID | Ticket | Acceptance criteria |
|----|--------|---------------------|
| P3-1 | Inventory grid 3D hover | Tilt + specular flash; lazy WebGL |
| P3-2 | CRM dark luxury theme | Shared tokens; Recharts styling |
| P3-3 | Deal Kanban motion | GSAP transitions; optional status particles |

---

## Phase 4 — Enterprise framework & polish

| ID | Ticket | Acceptance criteria |
|----|--------|---------------------|
| P4-1 | Optional `VEXCarViewer` / `VortexScene` in `@vex/ui` or `packages/3d` | Document bundle impact; tree-shake friendly |
| P4-2 | Performance guardrails | Dynamic import, Suspense, LOD, DPR cap, worker offload where justified |
| P4-3 | PR checklist | See `.cursor/rules/vex-digital-presence-v2.mdc` |

---

## Verification (before merge)

```bash
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
```

---

## References

- Existing motion stack: `apps/web/src/components/fx/CinematicMotionProvider.tsx`
- Showroom post-FX reference: `apps/web/src/components/configurator/ShowroomPostFX.tsx`
- Default GLB (demo): `apps/web/src/lib/vehicle3d/defaults.ts`
