# Deploy (API + data stores)

This folder is **API-first**: Postgres and Redis run here; `apps/web` and `apps/crm` should be hosted on a second platform with the same `NEXT_PUBLIC_API_URL` pointing at this API.

Recommended split:

- `apps/web` -> **Vercel**
- `apps/api` -> **Railway**
- Database -> **Neon Postgres**
- Redis -> **Upstash Redis**
- Media / hero assets -> **Cloudflare R2**

For investor-facing live pilot counters, also set **`INTERNAL_PILOT_METRICS_KEY`** on the API and on `apps/web` to the same value (see repo root `README.md` env table).

## Deploy order (production)

Run migrations **once per deploy**, against the **target database**, **before** new API replicas serve traffic. **Do not** rely on each container boot running **`migrate deploy`** — the **`Dockerfile.api`** runtime starts **only** `node` (see [2026-04-27-api-container-migration-responsibility.md](../docs/stabilization/decisions/2026-04-27-api-container-migration-responsibility.md)).

1. **Build** the API image (`docker compose build` / CI / registry).
2. **Release migration job:** from repo root, with **`DATABASE_URL`** / **`DIRECT_DATABASE_URL`** pointing at the **deploy DB**:

   ```bash
   pnpm --filter @vex/api exec prisma migrate deploy
   ```

   Run exactly **once** per schema-changing deploy — **not** once per replica.
3. **Start or roll out** API container(s) (same image; **`CMD`** = **`node`** only).
4. **`GET /health`** — expect **`200`**, **`db: "ok"`**, **`status: "ok"`** before routing traffic.
5. **`pnpm run pilot:verify`** with **`PILOT_VERIFY_API_URL`** set — dealer-ready smoke ([docs/PILOT_SHIP.md](../docs/PILOT_SHIP.md)).

**Platform requirement:** Your hosting provider **must** support a release-phase command, one-off Job, or pipeline step for step **2**. Without it, new containers can start against an **unmigrated** database — configure **`migrate deploy`** in CI/deploy automation rather than restoring migrations inside **`CMD`** unless temporarily unavoidable.

### Compose (local stack)

From repo root:

```bash
cd deploy
cp .env.example .env
# Edit .env: JWT_SECRET, CORS_ORIGIN (comma-separated, no *), valuation keys, Stripe.
docker compose build
```

Before **`docker compose up`** against a DB that needs the ledger applied (first boot or after pulling migration commits):

```bash
docker compose run --rm api sh -c 'cd /repo && pnpm --filter @vex/api exec prisma migrate deploy'
```

Then:

```bash
docker compose up
```

Compose **`api`** service inherits **`DATABASE_URL`** / Postgres linkage — override URLs when using external DBs.

From repo root, `pnpm run env:check:production` validates the **production** contract (use real secrets only in a secure environment). `pnpm run env:check:local` and `pnpm run env:check:ci` use `scripts/env-contract.mjs`.

## Minimum production env contract

**Production API (`NODE_ENV=production`):** **`REDIS_URL`** is **required** — the API fails startup if it is missing or blank ([production env readiness](../docs/stabilization/decisions/2026-04-27-production-env-readiness.md)). Local/dev processes without **`NODE_ENV=production`** may still use in-memory fallbacks where the codebase allows **`REDIS_URL`** to be unset.

`apps/web`

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_HERO_VIDEO_URL`

`apps/api`

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`

For a quick local stack **without** live valuation keys, set in `.env`:

`SKIP_VALUATION_ENV_CHECK=1`  
(Remove this in any real pilot or production environment.)

Kubernetes: mirror the same env contract—secrets for `JWT_SECRET`, Stripe, and valuation providers; `NODE_ENV=production`; tight `CORS_ORIGIN`; do **not** set `SKIP_VALUATION_ENV_CHECK`.

## Image

[`Dockerfile.api`](Dockerfile.api) builds `@vex/shared` and **`@vex/api`**. Runtime **`CMD`** runs **`node /repo/apps/api/dist/index.js`** — **no** **`prisma migrate deploy`** at boot.

## Health checks (load balancer / pilot)

**Smoke tiers (governance):** local **`env:check:local`** / build vs **`GET /health`** (API + DB) vs **`docker compose … config`** (syntax only) vs post-deploy **`pilot:verify`** — [2026-04-27-deploy-smoke-test-strategy.md](../docs/stabilization/decisions/2026-04-27-deploy-smoke-test-strategy.md). **`pilot:verify`** is post-deploy and does **not** replace **`ship:gate`** ([runbook memo](../docs/stabilization/decisions/2026-04-27-pilot-verify-runbook-consistency.md)).

- **`GET /health`** — expect **200** and JSON with `db: "ok"` and `status: "ok"` before sending customer traffic.
- **`GET /`** — quick JSON sanity check (API marker).

After the container or process is reachable at your public API origin (TLS + DNS):

```bash
export PILOT_VERIFY_API_URL="https://api.your-domain.com"
# Optional white-label smoke (pilot tenant customDomain):
# export PILOT_VERIFY_BRANDING_DOMAIN="dealer.example.com"
pnpm run pilot:verify
```

Exit **0** = automated dealer-ready smoke passed. Runbook: [docs/PILOT_SHIP.md](../docs/PILOT_SHIP.md).

## Demo data (optional)

With API env pointed at the same database:

```bash
cd ../apps/api && pnpm exec prisma db seed
```

(See `apps/api/prisma/seed.ts` — change default passwords in production.)
