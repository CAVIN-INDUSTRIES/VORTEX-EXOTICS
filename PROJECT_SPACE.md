# VEX Project Space (Single Operating Hub)

Use this file as the primary command center for execution.

## Current Focus

- Ship dealer-facing revenue path in a tight loop.
- Keep tenant isolation + RBAC + Stripe idempotency non-negotiable.
- Convert pilots to paid usage, not feature sprawl.
- Execute competitive plan: `docs/VEX_COMPETITIVE_EXECUTION_PLAN_2026-04-02.md`.

## 14-Day Beachhead Sprint

### Must Ship

- Multi-tenant enforcement audit complete on all API routes.
- Stripe checkout + webhook + billing portal verified in staging.
- Inventory/orders/appraisals dealer flows stable end-to-end.
- Pilot verification pass on deployed API (`pnpm run pilot:verify`).

### Go-To-Market

- Line up 3-5 luxury/exotic dealer pilot candidates.
- Demo script: private liquidity + public configurator.
- Pricing test: pay-per-deal-closed + usage overages.

## Source Of Truth Map

- Execution guardrails: `AGENTS.md`
- Delivery runbook: `docs/PILOT_SHIP.md`
- Ship gate details: `docs/SHIP.md`
- Tenant/RBAC details: `docs/TENANT_RBAC.md`
- Reality check memo: `docs/ENGINEERING_REALITY.md`
- Competitive execution system: `docs/VEX_COMPETITIVE_EXECUTION_PLAN_2026-04-02.md`
- **Phase 0.6 — Guardrails Review:** `docs/stabilization/phase-0.6-guardrails-review.md` (decision memos **Approved**; Phase 1.1–1.4 landed)
- **Env access policy (docs):** `docs/stabilization/env-access-boundary.md`
- **Local orchestration / env contract (docs):** `docs/stabilization/local-orchestration.md`
- **Stabilization Phase 2 (complete):** `docs/stabilization/phase-2-build-graph-ci-parity-review.md` · **Workflow inventory:** `docs/stabilization/workflow-inventory-2026-04-27.md`
- **Stabilization Phase 3 (governance complete):** [phase-3-runtime-deploy-readiness.md](docs/stabilization/phase-3-runtime-deploy-readiness.md) · **Evidence:** [runtime-deploy-inventory-2026-04-27.md](docs/stabilization/runtime-deploy-inventory-2026-04-27.md). **Memos:** migration [Approved — implemented](docs/stabilization/decisions/2026-04-27-api-container-migration-responsibility.md); production env / Redis [Approved — implemented](docs/stabilization/decisions/2026-04-27-production-env-readiness.md); **`PUBLIC_WEB_URL`** contract [Approved — implemented](docs/stabilization/decisions/2026-04-27-production-public-web-url-env-contract.md); smoke tiers [Approved — governance](docs/stabilization/decisions/2026-04-27-deploy-smoke-test-strategy.md); **`pilot:verify`** runbook [Approved — governance](docs/stabilization/decisions/2026-04-27-pilot-verify-runbook-consistency.md).
- **Digital presence v2 (elite luxury framework):** `docs/plans/2026-04-05-vex-DIGITAL-PRESENCE-v2-ELITE.md`
- **Elite digital presence v2.0 (Crown Jewel Protocol — full spec):** `docs/plans/2026-04-05-vex-ELITE-DIGITAL-PRESENCE-v2.0.md`
- **Elite v2 summary checklist:** `docs/plans/2026-04-05-vex-ELITE-DIGITAL-PRESENCE-v2.md`
- **Apex Studio `/build` (v2.1):** `docs/plans/2026-04-05-vex-apex-studio-configurator-v1.0.md`
- **Elite digital presence v1** (**§0–§31** — WebGL §21+, VLR, Cox §28 / §28.3, **§29** **Always** background, **§30** **GLB + dry-run=text** + **`NEXT_PUBLIC_HERO_VEHICLE_GLB`** + Turbo **warm-up** + **`TURBO_CACHE`** + **`turbo.json`**, **§31** **pitch deck**): `docs/plans/2026-04-04-vex-ELITE-DIGITAL-PRESENCE-v1.md`

## Phase 0.6 / Phase 1 guardrails (complete)

Decision memos **Approved** (`docs/stabilization/decisions/`). Implemented: **Node version check** (`pnpm run node:check`), **Next lock detection** (`pnpm run web:lock:check`), **env access** + **local orchestration** docs. **Turbo `db:generate` graph:** [2026-04-27-turbo-db-generate-dependency.md](docs/stabilization/decisions/2026-04-27-turbo-db-generate-dependency.md) — **Approved — implemented**. **CRM `.next` clean vs web lock policy:** [2026-04-27-next-clean-build-policy.md](docs/stabilization/decisions/2026-04-27-next-clean-build-policy.md) — **Approved — implemented** (CRM behavior unchanged; future CRM edits need separate approval).

## Stabilization Phase 2 — Build graph & CI parity (**complete**)

**Turbo `db:generate`**, **CI workflow parity**, **release vs fast-feedback gates**, and **Next clean-build policy** — all **Approved — implemented**. See [phase-2-build-graph-ci-parity-review.md](docs/stabilization/phase-2-build-graph-ci-parity-review.md) and decision memos under `docs/stabilization/decisions/2026-04-27-*.md`. Inventory: [workflow-inventory-2026-04-27.md](docs/stabilization/workflow-inventory-2026-04-27.md).

## Stabilization Phase 3 — Runtime & deploy readiness (**governance complete**)

**Hub:** [phase-3-runtime-deploy-readiness.md](docs/stabilization/phase-3-runtime-deploy-readiness.md). **Migration:** [Approved — implemented](docs/stabilization/decisions/2026-04-27-api-container-migration-responsibility.md) — **`migrate deploy`** in release job; **`Dockerfile.api`** **`CMD`** = **`node` only**. **Production Redis:** [Approved — implemented](docs/stabilization/decisions/2026-04-27-production-env-readiness.md). **Smoke tiers:** [Approved — governance](docs/stabilization/decisions/2026-04-27-deploy-smoke-test-strategy.md). **`ship:gate`** vs **`pilot:verify`:** [Approved — governance](docs/stabilization/decisions/2026-04-27-pilot-verify-runbook-consistency.md).

## Standard Commands

- Install: `pnpm install`
- Node major (match CI): `pnpm run node:check`
- Stale Next lock diagnostic: `pnpm run web:lock:check`
- Env contract (local, before ship): `pnpm run env:check:local` (see `scripts/env-contract.mjs`; `ship:gate` / `verify:ship` also run this)
- Build all: `pnpm -w turbo run build`
- API E2E isolation: `pnpm --filter @vex/api run test:e2e`
- CI mirror: `pnpm run ship:gate`
- Deployed readiness: `PILOT_VERIFY_API_URL=https://... pnpm run pilot:verify`

## Workspace Organization Rules

- Start execution from this file first.
- Treat this file as the live sprint board and update checkboxes as work lands.
- Add new docs only if they are linked from this hub.
- Keep generated or local-only files out of git where possible.

## Daily Execution Cadence

- Morning: run `pnpm -w turbo run build` and `pnpm --filter @vex/api run test:e2e`.
- Before any pilot-facing release: run `pnpm run ship:gate`.
- After deploy: run `PILOT_VERIFY_API_URL=... pnpm run pilot:verify`.
- End of day: update KPI and checklist progress in the competitive execution plan.

## Day 1 Execution Checklist

- Run gate commands in order (log 2026-04-03, this workspace):
  - `pnpm -w turbo run build` — green (all 5 packages).
  - `pnpm --filter @vex/api run test:e2e` — green after E2E scripts use `systemPrisma` + scoped `prisma` from `lib/tenant.ts` (raw `PrismaClient()` had no `$use` tenant merge).
  - `DATABASE_URL=postgresql://vex:vex@127.0.0.1:5432/vex DIRECT_DATABASE_URL=postgresql://vex:vex@127.0.0.1:5432/vex pnpm run ship:gate` — green after Prisma migration ledger recovery (`migrate resolve`) and clean `migrate status`.
  - `PILOT_VERIFY_API_URL=http://127.0.0.1:3001 pnpm run pilot:verify` — green (`pilot-verify: OK ... db=ok`).
- If any command is red, fix gate blockers before feature work.
- Trust layer (Roadmap v3.0 — Days 1–3) — **verified in repo**:
  - ALS + scoped `prisma`: `apps/api/src/lib/tenant.ts` (`$use` merges `tenantId`, blocks `findUnique` / single-row `update|delete|upsert` on tenant models).
  - HTTP → ALS bridge: `apps/api/src/middleware/tenantScope.ts` (`withTenantRequestContext`) + `apps/api/src/middleware/tenant.ts` (JWT tenant, blocks body/query `tenantId` spoofing).
  - RBAC: `apps/api/src/middleware/rbac.ts` + `requireRole.ts` (global `rbacAnyAuthenticated` after tenant; stricter `requireRole` on dealer/admin routes per `docs/TENANT_RBAC.md`).
  - E2E: `scripts/e2e-trust-layer-prisma.ts` (ALS + Prisma enforcement) + appraisal/inventory isolation + RBAC guard scripts — run via `pnpm --filter @vex/api run test:e2e`.
- Pass/Fail target: `pnpm --filter @vex/api run test:e2e` green with zero cross-tenant leakage.
- Pilot outreach: send one-line offer to 3 Cavin contacts and log status in this file.

## Realtime Scaling Sprint (Kickoff)

- Add API WebSocket runtime at `WS /ws/auctions?token=<jwt>` with JWT tenant auth.
- Add Redis Streams fan-out foundation for cross-instance room broadcasts (`vex:auction:{tenant}:{room}:events`).
- Add 15s heartbeat/ping-pong and stale-connection termination.
- Add premium-first broadcast ordering (STAFF/ADMIN/GROUP_ADMIN before CUSTOMER).
- Add Prometheus telemetry: `vex_ws_active_connections`, `vex_auction_broadcast_latency_ms`, `vex_ws_messages_total`.
- Run horizontal proof with 2+ API pods + Redis and capture latency/throughput report.
- Wire web live salon UI (`Live Bidder Count` / energy meter / bid-reactive visuals) to WS stream.