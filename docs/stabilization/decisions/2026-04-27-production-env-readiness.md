# Decision: Production env readiness

Date: 2026-04-27
Status: Approved — implemented
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

**`pnpm run env:check:production`** reads **`scripts/env-contract.mjs`** **`production`** profile. **`apps/api/src/index.ts`** and **`assertProductionReady()`** enforce additional rules at **runtime**. Examples live under **`deploy/.env.example`**, **`apps/api/.env.production.example`**, **`apps/web/.env.production.example`**. This memo compares layers.

## Decision

When **`NODE_ENV=production`**, the API **must not start** unless **`REDIS_URL`** is set to a **non-blank** value. **`assertProductionReady()`** calls **`process.exit(1)`** if **`REDIS_URL`** is missing or whitespace-only, aligning runtime with **`env:check:production`** and removing a bypass when deploys skip the contract script.

**Contract ↔ runtime alignment:** **`pnpm run env:check:production`** ( **`scripts/env-contract.mjs`** **`production`** profile) already required **`REDIS_URL`** non-empty. **`assertProductionReady()`** now **matches** at boot: operators cannot pass the script and still run a production process without Redis, nor run **`node`** without **`env:check:production`** and silently degrade.

**Rationale:** Redis backs queues (BullMQ), refresh-token denylist, distributed rate limits, cache-aside behavior, and multi-replica correctness. In-memory fallback remains acceptable for **local/dev** when **`NODE_ENV`** is not **`production`**.

## Evidence (post-implementation)

### `env-contract.mjs` — **`production`** required keys

- **API:** `DATABASE_URL`, `DIRECT_DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `CORS_ORIGIN`, `PUBLIC_WEB_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `EDMUNDS_API_KEY`, `EDMUNDS_SECRET`, `MARKETCHECK_API_KEY`
- **Web:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`
- **CRM:** `NEXT_PUBLIC_API_URL`
- **Rules:** `forbidProductionSkip: true`, `requireStrictCors: true` → **`SKIP_VALUATION_ENV_CHECK`** forbidden; **`CORS_ORIGIN`** cannot be empty or `*`.

### `productionEnv.ts` — **`NODE_ENV===production`**

- **`CORS_ORIGIN`** empty or **`*`** → **`process.exit(1)`**
- **`SKIP_VALUATION_ENV_CHECK`** → **`exit(1)`**
- **`REDIS_URL`** missing or blank → **`console.error`** + **`process.exit(1)`**

### **`index.ts`** (before **`assertProductionReady`**)

- Requires **`EDMUNDS_*`**, **`MARKETCHECK`** valuation vars unless **`SKIP_VALUATION_ENV_CHECK`** — if skip not set and missing → **exit(1)** before **`assertProductionReady`**.

### Examples vs contract gaps (tracking)

| Item | Notes |
|------|------|
| **`INTERNAL_PILOT_METRICS_KEY`** | In **`.env.production.example`** files — **not** in **`env-contract`** **`production`** required list — **optional feature**. |
| **`PUBLIC_WEB_URL`** | **Closed** — now **`production`** **`required.api`** ([public web URL contract memo](2026-04-27-production-public-web-url-env-contract.md)). |
| **`NEXT_PUBLIC_CONTACT_*`**, hero URLs | Web examples — **not** all in **`env-contract`** **`production`** **`required.web`**. |
| **`CRM`** CRM-specific public vars | Contract minimal (**`NEXT_PUBLIC_API_URL`** only). |

## Non-Goals

- **No** change to Redis client code, queue/cache/token/rate-limit implementations, or new env flags to opt out of Redis in production.
- **No** change to auth, RBAC, tenant, billing, or Stripe runtime behavior.
- **No** change to **`scripts/env-contract.mjs`** beyond what the **original** Redis memo covered ( **`REDIS_URL`** was the only contract edit then). **`PUBLIC_WEB_URL`** is added under a **separate** approved memo.

## Rollout

### CI

**`deploy-prod`** uses **`SKIP_VALUATION_ENV_CHECK=1`** for workflow jobs — **not** production runtime — CI-only escape (**already** in workflow **`env`**).

### Local / dev

**`NODE_ENV`** not **`production`** → **`assertProductionReady`** returns immediately; Redis may remain unset with in-memory behavior where implemented.

### Deploy

Operators must supply **`REDIS_URL`** for any **`NODE_ENV=production`** API. See **`deploy/README.md`** and repo root **`README.md`**.

## Risks

- **Drift:** Examples may list keys faster than **`env-contract`** — documentation debt only for keys outside this memo.

## Validation

Commands run after implementation:

- `git diff --check`
- `pnpm --filter @vex/api run build`
- `pnpm -w turbo run build`

**`assertProductionReady`** (from compiled **`apps/api/dist/lib/productionEnv.js`**, after **`pnpm --filter @vex/api run build`**):

```bash
cd apps/api

# Expect exit code 1 — missing REDIS_URL
NODE_ENV=production CORS_ORIGIN=http://localhost:3000 \
  node -e "require('./dist/lib/productionEnv.js').assertProductionReady()"

# Expect exit code 1 — whitespace-only REDIS_URL
NODE_ENV=production CORS_ORIGIN=http://localhost:3000 REDIS_URL='   ' \
  node -e "require('./dist/lib/productionEnv.js').assertProductionReady()"

# Expect exit code 0 — non-empty REDIS_URL (values below satisfy earlier checks only)
NODE_ENV=production CORS_ORIGIN=http://localhost:3000 REDIS_URL=redis://127.0.0.1:6379 \
  node -e "require('./dist/lib/productionEnv.js').assertProductionReady()"

# Expect immediate return — non-production skips Redis gate
NODE_ENV=development node -e "require('./dist/lib/productionEnv.js').assertProductionReady(); console.log('ok')"
```

**Batch validation (2026-04-27):** `git diff --check` (clean); `node --check scripts/env-contract.mjs` + `scripts/pilot-verify.mjs` (OK); `pnpm run env:check:local`, simulated **`env:check:ci`**, **`env:check:production`** (all **`env-contract: OK`**); `bash -n scripts/*.sh` (OK); `docker compose -f deploy/docker-compose.yml config` (OK); **`pnpm --filter @vex/api run build`** + **`pnpm -w turbo run build`** (success); **`assertProductionReady`** harness — missing **`REDIS_URL`** exit **1**, with **`REDIS_URL=redis://127.0.0.1:6379`** exit **0**.

## Follow-Up

- None for **`PUBLIC_WEB_URL`** — see [2026-04-27-production-public-web-url-env-contract.md](2026-04-27-production-public-web-url-env-contract.md).

---

**Governance:** Original memo runtime scope was **`apps/api/src/lib/productionEnv.ts`** (Redis). **`PUBLIC_WEB_URL`** contract closure is documented in the memo linked above.
