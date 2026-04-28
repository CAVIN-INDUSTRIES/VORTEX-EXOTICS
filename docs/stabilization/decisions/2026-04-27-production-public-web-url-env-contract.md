# Decision: Production `PUBLIC_WEB_URL` env contract

Date: 2026-04-27  
Status: Approved — implemented  
Owner: Principal Engineer / Staff Architect  
Review Date: 2026-04-28

## Context

The marketing site origin used for **Stripe Checkout** and **Billing Portal** return URLs is resolved from **`PUBLIC_WEB_URL`** on the API (see **`apps/api/src/lib/publicOrigins.ts`**, **`billing`**, **`pricing`**, **`subscriptionsController`**). Operators already set it in **`deploy/.env.example`** and **`apps/api/.env.production.example`**, but **`scripts/env-contract.mjs`** **`production`** profile did **not** require it, so **`pnpm run env:check:production`** could pass while production Stripe flows still misconfigured.

## Decision

**`PUBLIC_WEB_URL`** is a **required** **`production`** **`required.api`** key in **`scripts/env-contract.mjs`**. **`pnpm run env:check:production`** fails if it is missing or blank (same rules as other required API keys).

**Rationale:** Aligns the documented contract with billing/checkout reality and prevents silent deploys without a canonical public web origin for Stripe redirects.

## Non-Goals

- **No** new **`assertProductionReady()`** exit for **`PUBLIC_WEB_URL`** in this change — existing route/controller paths already surface misconfiguration when Stripe flows run; this step closes the **operator / CI contract** gap only.
- **No** change to **`local`** or **`ci`** profiles ( **`PUBLIC_WEB_URL`** is production-facing).

## Rollout

- Update **`README.md`**, **`deploy/README.md`**, **`runtime-deploy-inventory`**, and amend cross-references in **`2026-04-27-production-env-readiness.md`**.
- Teams running **`env:check:production`** in automation must export **`PUBLIC_WEB_URL`** (non-placeholder for real checks).

## Validation

- `node --check scripts/env-contract.mjs`
- **`pnpm run env:check:production`** with full placeholder matrix including **`PUBLIC_WEB_URL=https://www.example.com`** (or tenant-specific origin) → **`env-contract: OK`**
- Omitting **`PUBLIC_WEB_URL`** → contract error **`production:api missing required env PUBLIC_WEB_URL`**

## Related

- [2026-04-27-production-env-readiness.md](2026-04-27-production-env-readiness.md) (Redis + broader env layers)

---

**Governance:** Contract script + documentation only unless a future memo approves runtime **`productionEnv`** parity.
