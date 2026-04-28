# Environment variable access boundary

**Status:** policy (documentation). **No** ESLint rule or codemod in this repo version unless separately approved.

## Purpose

Reduce risk of leaking server-only configuration into client bundles and keep env usage reviewable. This complements `scripts/env-contract.mjs`, which validates **required keys** per target (local / CI / production), not **where** code may read `process.env`.

## Allowed surfaces

| Area | Guidance |
|------|----------|
| **API** | Prefer central modules: `apps/api/src/lib/env.ts`, `apps/api/src/lib/productionEnv.ts` for shared reads. Framework/bootstrap and narrow route wiring may read env where unavoidable. |
| **Web (`apps/web`)** | Client: only `NEXT_PUBLIC_*` (Next inlines these). Server-only: route handlers, server components, `next.config.*`, instrumentation — never expose non-`NEXT_PUBLIC_` values to the browser. |
| **CRM (`apps/crm`)** | Same pattern as web. |
| **Scripts** | `scripts/**` (including `env-contract.mjs`, maintenance, CI helpers). |
| **Config** | Root and app config files (`next.config`, `tsconfig` env if any) — keep minimal. |

## Discouraged

- Direct `process.env` scattered through every API controller/service — prefer central env modules and pass values in.
- Direct `process.env` inside **`packages/*` shared libraries** except a future, explicitly documented build-time public contract (default: **none**).
- Direct `process.env` in **UI / design-system / cinematic** packages — configuration should flow from apps via props or build-time injection decided in the app.

## Future work (not implemented here)

- ESLint `no-restricted-properties` or similar with an allowlist file.
- Incremental refactors toward central API env reads (small PRs, no mass codemod without sign-off).

## Related

- Decision memo: `docs/stabilization/decisions/2026-04-27-env-access-boundary.md`
- Contract checks: `pnpm run env:check:local` / `env:check:ci` / `env:check:production`
