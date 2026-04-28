# GitHub Actions workflow inventory

**Date:** 2026-04-27
**Purpose:** Factual snapshot of each workflow as implemented—inputs for Phase 2 governance. **Not** prescriptive.

---

## Summary table

| Workflow file | Trigger | Node / pnpm | `env:check:*` step | DB / migrations | Build scope | Test scope | Deploy | Feedback vs release | Gaps / observations (facts) |
|----------------|---------|-------------|---------------------|-----------------|-------------|------------|--------|---------------------|------------------------------|
| [`ci.yml`](../../.github/workflows/ci.yml) | `push` / `pull_request` → `main`; **paths-ignore** `.md`, `docs/**`, images | `pnpm` **9.15.9**, Node **22**, `assert-node-version.mjs` before install | **`pnpm run env:check:ci`** with step `env` for `DATABASE_URL`, `DIRECT_DATABASE_URL`, `JWT_SECRET` | Service **Postgres 16**; **`prisma db push`** (not migrate deploy) after `db:generate` | **`pnpm -w turbo run build test:e2e ship:gate pilot:verify --filter=[HEAD^1]`** (affected + Turbo remote cache) | API `test:e2e`, ship gate script, pilot verify via Turbo graph | None | **Primary integration gate** on code paths; excludes doc-only pushes due to paths-ignore | Turbo env uses different `JWT_SECRET` label than env-contract step (`ci-ship-gate-*` vs `ci-env-contract-test`) — both satisfy CI contract keys; different strings. |
| [`build-stability.yml`](../../.github/workflows/build-stability.yml) | `push` / `pull_request` → `main`; **no paths-ignore** | Same Node/pnpm + **assert-node-version** | **`pnpm run env:check:ci`** after install ( **`DATABASE_*`**, **`JWT_SECRET`** — parity memo 2026-04-27) | **No** Postgres service | Sequential: `@vex/shared` build → `@vex/cinematic` build → `db:generate` → **`pnpm -w turbo run build`** (full workspace) | **`@vex/web` test:smoke** (Playwright subset after Chromium install) | None | **Broad path coverage** without affected filter; runs on doc changes too | Previously had no env contract step — closed per CI parity memo. |
| [`deploy-prod.yml`](../../.github/workflows/deploy-prod.yml) | **`workflow_dispatch`** + `push` → `main` | Same setup + assert-node | **`pnpm run env:check:ci`** (inherits job `env` on step; job-level `DATABASE_*`, `JWT_SECRET`) | Service Postgres; **`prisma migrate deploy`** in `apps/api` | **`pnpm -w turbo run build --filter=[HEAD^1]`** with Turbo secrets | Web `test:e2e`, `test:a11y`, `test:lighthouse`; API `test:e2e`; **`pnpm audit --prod`**; **Trivy** fs scan | **POST** to `VERCEL_DEPLOY_HOOK` / `RENDER_DEPLOY_HOOK` if secrets set | **Release-style** verification path + deploy hooks | Job `SKIP_VALUATION_ENV_CHECK=1`; broader test matrix than single Turbo line in `ci.yml`; not gated by paths-ignore on trigger definition (runs all pushes to main). |
| [`quality.yml`](../../.github/workflows/quality.yml) | **`pull_request`** → `main`; **paths filter** to web + listed packages + lock/turbo/package/workflow | Same Node/pnpm + assert-node | **None** | No Postgres | Turbo **`quality:web`** then **`quality:3d`** on `@vex/web` | Embedded in quality scripts (lint + smoke path / 3d lint per package scripts) | None | **Targeted** PR feedback when web-related paths change | No env contract; no DB; relies on Turbo task graph for builds. |
| [`secret-scan.yml`](../../.github/workflows/secret-scan.yml) | PR; push `main`; `workflow_dispatch` | **No** Node/pnpm setup (gitleaks only) | None | None | None | **gitleaks** | None | Fast secret scanning | Independent of app build/test gates. |

---

## Per-workflow detail (facts only)

### `ci.yml`

- **Concurrency:** `cancel-in-progress` per workflow + ref.
- **Checkout:** `fetch-depth: 0` (full history for `[HEAD^1]` filters).
- **Ship gate note:** `ship:gate` runs inside Turbo; resolves to root script `bash scripts/ship-gate.sh` when selected by pipeline.

### `build-stability.yml`

- **Concurrency:** same pattern as `ci.yml`.
- **Root assertion:** explicit step verifies repo root `package.json` name `vex-website` and workspace file.
- **Prisma:** only `db:generate`, no `db push` / migrate in this workflow.

### `deploy-prod.yml`

- **Turbo Remote Cache:** `turborepo/action@v2` step before Prisma generate (cache warming / auth).
- **Deploy hooks:** conditional curl; failures depend on hook URLs and network (not shown as guarded beyond `-f`).

### `quality.yml`

- **Checkout:** default shallow (no `fetch-depth` override).
- **Turbo:** uses `pnpm exec turbo` and `pnpm turbo` (two invocation styles in adjacent steps).

### `secret-scan.yml`

- **Permissions:** read-only contents + PR metadata.

---

## Related stabilization artifacts

- Phase 2 umbrella (**complete**): `phase-2-build-graph-ci-parity-review.md`
- Phase 3 proposal: `phase-3-runtime-deploy-readiness.md`
- Decision memos: `docs/stabilization/decisions/2026-04-27-*.md` (Turbo graph, CI parity, release vs fast feedback, Next clean-build, etc.)
