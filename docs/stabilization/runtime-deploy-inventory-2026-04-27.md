# Runtime & deploy inventory

**Date:** 2026-04-27
**Purpose:** Phase 3 governance evidence — migration ownership, smoke/env tiers, env-contract vs runtime, **`pilot:verify`** semantics. Reflects **Approved — implemented** memos (documented runtime: **`Dockerfile`** **`CMD`**, **`REDIS_URL`** gate in **`productionEnv`**).

**Related:** [phase-3-runtime-deploy-readiness.md](phase-3-runtime-deploy-readiness.md), decision memos under [`docs/stabilization/decisions/`](decisions/) `2026-04-27-api-*`, `*-deploy-smoke-*`, `*-production-env-*`, `*-pilot-verify-*`.

---

## 1. Runtime entrypoints

| Entrypoint | How invoked | Migrations | Typical DB |
|------------|-------------|------------|------------|
| **Local dev API** | `pnpm --filter @vex/api dev` (**tsx watch src/index.ts**) | **No** in **`dev`** — operator uses **`migrate dev`** / **`deploy`** separately | Local Postgres |
| **Production **`start`** | **`apps/api`** **`"start": "node dist/index.js"`** | **No** — **`migrate deploy`** not invoked by **`start`** | Prod Postgres |
| **Docker **`CMD`** (**`Dockerfile.api`**) | **`node /repo/apps/api/dist/index.js`** only (**Approved** — implemented **2026-04-27**) | **No** at boot — run **`pnpm --filter @vex/api exec prisma migrate deploy`** in release/deploy job | Compose / orchestrator **`DATABASE_URL`** |
| **`deploy-prod.yml`** | Turbo/cache → **`db:generate`** → **`migrate deploy`** (**apps/api**) → **`pnpm audit`** → **`turbo build`** → Playwright/web/api tests → hooks | **Yes** — workflow step | GH **`postgres` service |
| **`ship-gate.sh`** | Root **`pnpm run ship:gate`** | **`migrate deploy`** when **`CI≠true`** | **`DATABASE_URL`** from env files |
| **`pilot-verify.mjs`** | **`pnpm run pilot:verify`** | No — HTTP GET only | Uses **deployed** API (**`/health`** hits DB **via API**) |

---

## 2. Migration ownership

| Command / file | Runs **`migrate deploy`**? | Uses **`db push`**? | Environment | Risk notes |
|----------------|------------------------------|---------------------|-------------|------------|
| **`deploy/Dockerfile.api`** **`CMD`** | **No** (runtime **`node` only**) | No | Container runtime | Migrate belongs in **release job once per deploy** |
| **`.github/workflows/deploy-prod.yml`** step “Migrate” | **Yes** | No | CI service Postgres | Runs **before** build/tests — drift vs prod DB |
| **`.github/workflows/ci.yml`** Prisma step | No | **Yes** (`db push`) | CI ephemeral DB | **Not** migration ledger replay |
| **`ship-gate.sh`** | **Yes** (non-CI) | No | Developer machine | Skipped when **`CI=true`** |
| **`apps/api`** **`db:migrate`** | **`migrate dev`** — dev only | No | Local | Not production path |
| **Manual **`PILOT_SHIP`** Step 2 | **`migrate deploy`** | No | Target pilot DB | Operator-owned |

---

## 3. Health / smoke

Governance tiers (see [2026-04-27-deploy-smoke-test-strategy.md](decisions/2026-04-27-deploy-smoke-test-strategy.md)):

| Tier | Examples | Needs deployed URL? |
|------|----------|---------------------|
| Local env / config | **`pnpm run env:check:local`**, **`pnpm -w turbo run build`** | **No** |
| API health | **`GET /health`** | **No** (needs API + DB running) |
| Compose config | **`docker compose -f deploy/docker-compose.yml config`** | **No** (syntax only) |
| Deployed API | **`PILOT_VERIFY_API_URL=… pnpm run pilot:verify`** | **Yes** |

| Check | Requires DB | Requires Redis | Requires external secrets | Local / CI / deploy suitability |
|-------|-------------|----------------|---------------------------|--------------------------------|
| **`GET /health`** | **Yes** (Prisma **`SELECT 1`**) | No | No | CI **yes** (API+DB up); deploy **yes** |
| **`GET /`** (root JSON) | No | No | No | Broad |
| **`pnpm run pilot:verify`** (default) | Via **`/health`** | No | No for base checks | **Needs public/reachable URL** — CI **often skips** |
| **`pilot:verify`** `--fortellis` / DMS flags | No | No | **Yes** | CI only with secrets |
| **`GET /dealer/pilots`** (optional in script) | Likely | No | **`x-internal-key`** | Post-deploy |
| **`ship:gate`** | **Yes** (E2E) | E2E may exercise Redis paths | Valuation skip often **`1`** locally | Local / CI |

---

## 4. Env readiness — production contract vs runtime

**`pnpm run env:check:production`** uses **`scripts/env-contract.mjs`** **`production`** **`required`** lists. **`apps/api/src/index.ts`** + **`assertProductionReady()`** add runtime gates when **`NODE_ENV=production`**.

### Keys listed in **`env-contract`** **`production`** (must be non-empty where applicable)

| Key | App | **`env-contract`** | Runtime enforcement (summary) |
|-----|-----|-------------------|--------------------------------|
| **`DATABASE_URL`** | API | Required | **`requireEnv`** in **`index.ts`** |
| **`DIRECT_DATABASE_URL`** | API | Required | Prisma / migrations (no duplicate **`requireEnv`** in **`index.ts`**) |
| **`JWT_SECRET`** | API | Required | **`requireEnv`** in **`index.ts`** |
| **`REDIS_URL`** | API | Required | **`assertProductionReady`** → **`exit(1)`** if missing/blank |
| **`CORS_ORIGIN`** | API | Required (not **`*`**) | **`assertProductionReady`** + **`env-contract`** **`requireStrictCors`** |
| **`PUBLIC_WEB_URL`** | API | Required | Stripe return URLs via **`publicOrigins`** — **`env-contract`** only (see [public web URL memo](decisions/2026-04-27-production-public-web-url-env-contract.md)) |
| **`STRIPE_SECRET_KEY`** | API | Required | Used when Stripe routes run — not duplicated in **`productionEnv`** |
| **`STRIPE_WEBHOOK_SECRET`** | API | Required | Same |
| **`EDMUNDS_API_KEY`** | API | Required | **`index.ts`** valuation gate (+ **`env-contract`** **`forbidProductionSkip`**) |
| **`EDMUNDS_SECRET`** | API | Required | Same |
| **`MARKETCHECK_API_KEY`** | API | Required | Same |
| **`NEXT_PUBLIC_SITE_URL`** | Web | Required | Next.js — not **`productionEnv`** |
| **`NEXT_PUBLIC_API_URL`** | Web, CRM | Required | Next.js — not **`productionEnv`** |

### Additional runtime rules (**not** separate keys in **`required`** above)

| Rule | Enforcement |
|------|-------------|
| **`SKIP_VALUATION_ENV_CHECK`** | Forbidden in **`production`** contract; **`assertProductionReady`** **`exit(1)`** if set |
| Valuation keys vs skip | **`index.ts`** — missing keys → **`exit(1)`** unless skip (**never** in prod) |

### Documentation / contract gaps (findings only)

| Item | Notes |
|------|------|
| **`INTERNAL_PILOT_METRICS_KEY`** | Optional pilot counters — **not** in **`env-contract`** |
| **`NEXT_PUBLIC_*`** beyond minimal web list | Marketing/contact vars in examples — **not** all in **`required.web`** |

---

## 5. Env readiness (compact matrix — legacy columns)

| Key | **`env-contract`** **`production`** required? | **`productionEnv`** / **`index.ts`** check? | In **`deploy/.env.example`** / API production example? | **`docker-compose`** **`api.environment`** | Notes |
|-----|-----------------------------------------------|---------------------------------------------|---------------------------------------------------------|---------------------------------------------|-------|
| **`DATABASE_URL`** | Yes | **`requireEnv`** startup | Yes | Yes | |
| **`DIRECT_DATABASE_URL`** | Yes | Implicit via Prisma | Yes | Yes | |
| **`JWT_SECRET`** | Yes | **`requireEnv`** | Yes | **`JWT_SECRET`** from env | |
| **`REDIS_URL`** | Yes | **`exit(1)`** if missing/blank (**`NODE_ENV=production`**) | Yes | Yes | Aligns contract + runtime |
| **`CORS_ORIGIN`** | Yes (not `*`) | **`exit(1)`** if empty/`*` | Yes | **`CORS_ORIGIN`** | |
| **`SKIP_VALUATION_ENV_CHECK`** | Forbidden | **`exit(1)`** if set in prod | Document omit | Not set | CI workflows may set **`1`** — **not** prod runtime |
| **`EDMUNDS_*`**, **`MARKETCHECK_*`** | Yes (valuation trio) | **`index.ts`** missing → exit unless skip | Yes placeholders | Partial | |
| **`STRIPE_*`** | Required keys | Stripe routes need at runtime | Placeholders | **`STRIPE_*`** | |
| **`NEXT_PUBLIC_SITE_URL`** / **`NEXT_PUBLIC_API_URL`** (web) | Web required | N/A (Next) | Web example | N/A | |
| **`NEXT_PUBLIC_API_URL`** (crm) | CRM required | N/A | CRM example | N/A | |
| **`PUBLIC_WEB_URL`** | Yes | Stripe URLs (**`publicOrigins`**) | **`deploy/.env.example`** | No | **`env-contract`** + runtime usage |
| **`INTERNAL_PILOT_METRICS_KEY`** | **Not** required | N/A | API/web examples optional | No | Feature-flag pilot counters |

---

## Related decisions

| Memo | Topic |
|------|--------|
| [2026-04-27-api-container-migration-responsibility.md](decisions/2026-04-27-api-container-migration-responsibility.md) | Container vs workflow migrations |
| [2026-04-27-deploy-smoke-test-strategy.md](decisions/2026-04-27-deploy-smoke-test-strategy.md) | Smoke tiers |
| [2026-04-27-production-env-readiness.md](decisions/2026-04-27-production-env-readiness.md) | Env layers |
| [2026-04-27-production-public-web-url-env-contract.md](decisions/2026-04-27-production-public-web-url-env-contract.md) | **`PUBLIC_WEB_URL`** production contract |
| [2026-04-27-pilot-verify-runbook-consistency.md](decisions/2026-04-27-pilot-verify-runbook-consistency.md) | **`ship:gate`** vs **`pilot:verify`** |

---

_Update when **`Dockerfile`**, workflows, or **`env-contract.mjs` change._
