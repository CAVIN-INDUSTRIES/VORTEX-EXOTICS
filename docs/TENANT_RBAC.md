# Tenant isolation + RBAC (living notes)

## Tenant isolation

- **Prisma:** `runWithTenant` + `$use` middleware on `prisma` (`lib/tenant.ts`). The **`Tenant` model is exempt** from auto-scoping — `tenant.findMany()` without a `where` clause can return **all** tenants. Call sites must use `where: { id: req.tenantId }` (or `findFirst`) whenever the caller is a normal tenant-scoped request.
- **Route wrapper:** `tenantMiddleware` delegates to `withTenantRequestContext` (`lib/tenantScope.ts`), so every authenticated route executes inside one ALS tenant scope automatically.
- **Fixed leak class (2026-04):** `adminController`, `capital` raise package, `scaling` overview, `liquidity` / `forecasting` helpers previously aggregated **every** tenant; they are now **scoped to `req.tenantId`** (or `tenantId` argument). Platform-wide admin, if needed later, should use an explicit `basePrisma` + separate auth (e.g. env-gated operator role), not tenant JWTs.
- **Health:** `GET /health` uses **`healthPrisma`** only — no tenant ALS (see `ENGINEERING_REALITY.md`).
- **DB safety net (ops-applied):** `apps/api/prisma/sql/tenant_rls.sql` provides optional Postgres RLS policies for hot tenant tables via `app.current_tenant`.

## RBAC

- **Middleware:** `requireAuth`, `requireRole(...)` (`middleware/auth.ts`, `middleware/requireRole.ts`).
- **Dealer staff:** `isDealerStaffRole()` in `lib/dealerRole.ts` = `STAFF | ADMIN | GROUP_ADMIN` for CRM-style controllers (customers, leads, orders, inventory mutations, dashboard, appraisals).
- **Deal desk / appraisal queue:** `isDealDeskAppraisalRole()` delegates to `isDealerStaffRole()`; `/appraisals/*` and `/dealer/appraisals/*` both use `requireRole("STAFF", "ADMIN", "GROUP_ADMIN")` so middleware and controller checks match.
- **`GROUP_ADMIN`:** Included on **appraisals**, **analytics**, **AI insights** routes alongside STAFF/ADMIN so group operators are not locked out of dealer tooling.
- **Orders:** Customers see **own** orders only; staff-like roles see all (see `ordersController`).

## Verification

```bash
pnpm --filter @vex/api run test:e2e
```

Needs **`DATABASE_URL`** and a live Postgres. The suite starts with `scripts/e2e-trust-layer-prisma.ts` (ALS + unsafe-Prisma guards), then appraisal/inventory isolation and related scripts. CI and `ship:gate` use the same command.

If local E2E fails with `Can't reach database server at 127.0.0.1:5432`, bootstrap Postgres like this:

```bash
cd deploy
cp .env.example .env
docker compose up -d postgres

# From repo root (new shell):
export DATABASE_URL="postgresql://vex:vex@127.0.0.1:5432/vex"
export DIRECT_DATABASE_URL="postgresql://vex:vex@127.0.0.1:5432/vex"
pnpm --filter @vex/api run test:e2e
```

If your local DB creds differ, use your actual connection string values instead of the example above.

## Remaining audit surface

- Routes that only use `requireAuth` without `requireRole` rely on **controller** checks — prefer route-level `requireRole` for new code.
- **Public** and **pilot** routers stay unauthenticated by design; review when exposing new paths.

