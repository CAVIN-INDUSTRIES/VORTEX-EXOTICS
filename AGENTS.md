# Vex — Coding Agent Execution Guide (Unison)

## Vision
Build a best-in-class **B2B SaaS platform for auto dealers** (CRM + Inventory + Customer Portal + Appraisals).

## Repo Structure
- `apps/web`: marketing + auth + pricing/checkout entrypoints
- `apps/api`: Express REST API + Prisma + Postgres
- `apps/crm`: dealer/customer portal (Next.js)
- `packages/shared`: shared types/schemas/utils

## Standards (non-negotiable)
- **Multi-tenant isolation on every API route** (no cross-tenant reads/writes).
- **RBAC on every route** (at minimum: `CUSTOMER | STAFF | ADMIN`).
- **Before any commit**: `pnpm -w turbo run build` must pass.
- **API/shared TypeScript**: keep types safe in shared/core; allow looser typing in route/controller edges only when necessary.
- **Stripe/webhooks**: verify signatures, keep handlers idempotent, never trust client-provided prices.

## Phase 1 (Now) — Execution Checklist
- Ensure `apps/api/tsconfig.json` is loose enough to unblock shipping (`skipLibCheck`, `strict: false`, `noImplicitAny: false`).
- Stripe subscriptions:
  - API route to create Stripe Checkout Session
  - API Stripe webhook route that verifies signature and is idempotent
  - Persist Stripe IDs in Prisma (`customer`, `subscription`, `checkoutSession`)
- Tenant foundation:
  - Prisma tenant model + user→tenant mapping
  - Tenant scoping middleware/helper used by all routes
  - Use AsyncLocalStorage-backed Prisma middleware to auto-scope `findMany/findFirst/count/aggregate` and auto-attach tenant on creates
  - Do not use unsafe unique actions (`findUnique/update/delete/upsert`) on the tenant-scoped Prisma client; prefer `findFirst/updateMany/deleteMany`

## Phase 2
- Inventory + CRM CRUD APIs (tenant scoped)
- `apps/crm` portal: vehicles + orders + invoices views
- Feature flags (simple Prisma-backed flags is acceptable)

## Phase 3
- Pricing tiers + Billing Portal
- White-label domains (tenant theming + domain mapping)
- Analytics dashboard

## Required Verification Commands
- Build: `pnpm -w turbo run build`
- API only: `pnpm --filter @vex/api run build`
- Web only: `pnpm --filter @vex/web run build`
- CRM only: `pnpm --filter @vex/crm run build`

