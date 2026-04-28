# Phase 3 — Runtime & deploy readiness (governance)

**Status:** **Governance complete** (2026-04-27) — all four Phase 3 decision memos are closed (**Approved — implemented** or **Approved — governance implemented**). Runtime changes landed for **migration ownership** (`Dockerfile.api` **`CMD`**) and **`REDIS_URL` hard-fail in production** (`productionEnv.ts`). **Smoke tiers** and **`pilot:verify`** runbook approvals are **documentation-only** (no new smoke scripts in this batch).

**Depends on:** Stabilization Phase 2 **complete**.

## Purpose

Clarify migrations at boot vs CI vs workflows, smoke tiers, production env layers, and **`pilot:verify`** vs **`ship:gate`**. **`Dockerfile.api`** migration removal is authorized **only** by the approved migration memo; Redis production gate by the production-env memo.

## Decision memos

| Memo | Topic | Status |
|------|--------|--------|
| [2026-04-27-api-container-migration-responsibility.md](decisions/2026-04-27-api-container-migration-responsibility.md) | Release job owns **`migrate deploy`**; **`CMD`** = app only | **Approved — implemented** |
| [2026-04-27-production-env-readiness.md](decisions/2026-04-27-production-env-readiness.md) | **`REDIS_URL`** required when **`NODE_ENV=production`** | **Approved — implemented** |
| [2026-04-27-production-public-web-url-env-contract.md](decisions/2026-04-27-production-public-web-url-env-contract.md) | **`PUBLIC_WEB_URL`** in **`env-contract`** **`production`** | **Approved — implemented** |
| [2026-04-27-deploy-smoke-test-strategy.md](decisions/2026-04-27-deploy-smoke-test-strategy.md) | Smoke tiers (local / **`/health`** / compose config / deployed **`pilot:verify`**) | **Approved — governance implemented** |
| [2026-04-27-pilot-verify-runbook-consistency.md](decisions/2026-04-27-pilot-verify-runbook-consistency.md) | **`ship:gate`** vs **`pilot:verify`**; CI skip semantics | **Approved — governance implemented** |

## Evidence inventory

- **[runtime-deploy-inventory-2026-04-27.md](runtime-deploy-inventory-2026-04-27.md)** — tables updated when **`Dockerfile`**, workflows, or **`env-contract.mjs`** change.

## Owner review — prerequisite questions

1. **Migrations** — **Yes** — out of API container boot; release/deploy job (**Approved** memo).
2. **Production env / Redis** — **Yes** — **`REDIS_URL`** hard-fail at **`NODE_ENV=production`** (**Approved** memo).
3. **Smoke tiers** — **Yes** — documented tiers; **no** new automation required for governance closure (**Approved** memo).
4. **`pilot:verify` vs ship gate** — **Yes** — official boundaries documented (**Approved** memo). Optional **`PILOT_VERIFY_STRICT`** in deploy workflows remains **future** ops choice.

**Platform requirement:** Hosting must run **`pnpm --filter @vex/api exec prisma migrate deploy`** (or equivalent) **once per deploy** before API replicas serve traffic — see **`deploy/README.md`**.

## Explicit non-goals

- **No** **`apps/api/prisma/schema`** / **`migrations/**`** edits without schema work.
- Optional follow-ups (compose **`curl`** **`/health`** **`healthcheck`**, **`PILOT_VERIFY_STRICT`** in **`deploy-prod`**) are **not** required to close Phase 3 governance.

## Exit criteria (Phase 3 **governance**)

- All tracked memos **Approved — implemented** — **met** (2026-04-27).
- Runbooks aligned (**`README.md`**, **`deploy/README.md`**, **`PROJECT_SPACE.md`**, inventory).

## Related

- Phase 2: [phase-2-build-graph-ci-parity-review.md](phase-2-build-graph-ci-parity-review.md)
- Workflow inventory: [workflow-inventory-2026-04-27.md](workflow-inventory-2026-04-27.md)
