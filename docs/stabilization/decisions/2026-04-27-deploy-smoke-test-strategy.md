# Decision: Deploy smoke test strategy

Date: 2026-04-27
Status: Approved — governance implemented
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

Smoke checks differ by environment: local tooling, running API + DB, compose validation, and publicly deployed APIs. This memo defines **tiers** and maps them to **existing** commands and routes. **No new smoke scripts** are introduced by this approval—documentation and governance alignment only.

## Decision

Smoke expectations are **tiered**:

### 1. Local env / config smoke

- **`pnpm run env:check:local`** — validates **`scripts/env-contract.mjs`** **`local`** profile + shell-safety lint for tracked **`.env*`** files.
- **`bash -n scripts/*.sh`** (or per-script) — syntax-only validation of shell entrypoints where used in CI or docs (operators may run ad hoc).
- **`pnpm -w turbo run build`** / **`pnpm --filter @vex/api run build`** — proves compile graph; **does not** require a deployed URL or running containers.

This tier is appropriate for **PR / developer machines** before integration tests.

### 2. API health smoke

- **`GET /health`** — expects **200** and JSON with **`status: "ok"`**, **`db: "ok"`** (Prisma ping via dedicated client — see **`apps/api/src/routes/health.ts`**).
- **Requires** API process **and** reachable Postgres (Redis **not** required for this route as implemented).

Use after **`pnpm dev:api`**, compose **`up`**, or deploy **before** customer traffic.

### 3. Container / deploy smoke

- **`docker compose -f deploy/docker-compose.yml config`** — **syntax / graph validation only**; confirms compose files merge.
- **Actual** “container up + curl **`/health`**” automation is **not** implied done—optional follow-up (e.g. compose **`healthcheck`**) is **out of scope** for this memo.

**No Docker image build** is required to satisfy this tier—only **`config`** when compose is in play.

### 4. Deployed API smoke

- **`PILOT_VERIFY_API_URL=https://… pnpm run pilot:verify`** — HTTP checks against a **real** origin (**`/health`**, **`/`**, optional branding).

**Post-deploy only.** **Not** part of normal PR CI **unless** a stable preview/staging URL exists—otherwise **`pilot-verify.mjs`** skips when **`PILOT_VERIFY_API_URL`** is unset (unless **`PILOT_VERIFY_STRICT`**).

### 5. Dealer-ready / pilot verification

- **`pnpm run pilot:verify`** is the **final automated sanity gate** for “API we can show a dealer” **after** deploy—**not** a substitute for **`pnpm run ship:gate`** (build + migrate + E2E), migrations, or tenant isolation tests.

See **`docs/PILOT_SHIP.md`** and [2026-04-27-pilot-verify-runbook-consistency.md](2026-04-27-pilot-verify-runbook-consistency.md).

## Evidence (reference)

| Surface | Mechanism |
|---------|-----------|
| **`GET /health`** | DB ping; **503** / **`db: "error"`** if DB unreachable |
| **`scripts/pilot-verify.mjs`** | **`package.json`** **`pilot:verify`** — optional skip without URL |
| **`deploy/README.md`** | Deploy order, **`/health`**, **`pilot:verify`** |

## Non-Goals

- **No** new smoke shell scripts, compose **`healthcheck`** commands, or workflow edits as part of this **governance** approval.
- **No** changes to **`health.ts`**, **`pilot-verify.mjs`**, or **`Dockerfile`** here.

## Rollout

Cross-link **`runtime-deploy-inventory-2026-04-27.md`**, **`deploy/README.md`**, **`README.md`** — aligned **2026-04-27**.

## Risks

Teams that only run **tier 1** may miss broken deploy URLs—mitigate with **tier 4** post-deploy or **`PILOT_VERIFY_STRICT`** in release pipelines when a URL secret exists.

## Validation

- Memo aligns with **`health.ts`**, **`pilot-verify.mjs`**, **`deploy/README.md`**, **`docker-compose.yml`** — reviewed **2026-04-27**.
- Repository validation batch (see **`2026-04-27-production-env-readiness.md`** / Phase 3 rollout): **`git diff --check`**, **`node --check`** on scripts, **`env:check:local`**, **`bash -n`** ship scripts, **`pnpm --filter @vex/api run build`**, **`pnpm -w turbo run build`**.

## Follow-Up

- Optional separate approval: compose **`healthcheck`** invoking **`curl`** **`/health`**.

---

**Governance:** Documentation-only approval—no runtime, Docker, migration, Prisma, auth, billing, or tenant behavior changes bundled with this memo.
