# VORTEX Stabilization Roadmap

## Phase 0 — Stop Drift
- Node version standardization
- Env contract normalization
- Env validation layer
- Deploy env parity
- **0.6 — Guardrails Review:** `docs/stabilization/phase-0.6-guardrails-review.md` — decision memos **Approved**; see Phase 1 below.

## Phase 1 — Deterministic Builds (**complete**)
- **1.1 Node assertion:** `scripts/assert-node-version.mjs` + `pnpm run node:check` + CI step (major must match `.node-version` / `engines`)
- **1.2 Next lock detection:** `scripts/check-next-lock.mjs` + `pnpm run web:lock:check` (no auto-delete)
- **1.3 Env access policy:** `docs/stabilization/env-access-boundary.md`
- **1.4 Local orchestration:** `docs/stabilization/local-orchestration.md`

## Stabilization — Phase 2: Build graph & CI parity (**complete**, 2026-04-27)
- **Checkpoint:** [phase-2-build-graph-ci-parity-review.md](phase-2-build-graph-ci-parity-review.md)
- **Workflow inventory:** [workflow-inventory-2026-04-27.md](workflow-inventory-2026-04-27.md)
- **Done:** Turbo **`db:generate`** graph memo; CI workflow parity (tiers + **`env:check:ci`** on **`build-stability.yml`**); release vs fast-feedback gate memo; Next clean-build policy memo (web detection vs CRM documented behavior)

## Stabilization — Phase 3: Runtime & deploy readiness (**governance complete**, 2026-04-27)
- **Hub:** [phase-3-runtime-deploy-readiness.md](phase-3-runtime-deploy-readiness.md)
- **Evidence inventory:** [runtime-deploy-inventory-2026-04-27.md](runtime-deploy-inventory-2026-04-27.md)
- **Decision memos (Approved — implemented):** [api-container-migration-responsibility.md](decisions/2026-04-27-api-container-migration-responsibility.md), [production-env-readiness.md](decisions/2026-04-27-production-env-readiness.md), [deploy-smoke-test-strategy.md](decisions/2026-04-27-deploy-smoke-test-strategy.md) (governance/docs), [pilot-verify-runbook-consistency.md](decisions/2026-04-27-pilot-verify-runbook-consistency.md) (governance/docs)

## Product roadmap — Runtime stability (long horizon; not “Stabilization Phase 2”)
- API migration separation (operational depth beyond stabilization numbering above)
- Container health guarantees
- Compose validation
- Secrets enforcement

## Product roadmap — Production confidence
- CI mirrors deploy (incremental; see Phase 3 governance)
- Migration validation
- Infra smoke tests
- Release gating

## Phase 4 — AI-Agent Governance
- Protected infra files
- Agent-safe boundaries
- CODEOWNERS
- Automated review rules
