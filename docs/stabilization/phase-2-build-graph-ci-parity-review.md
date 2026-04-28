# Phase 2 — Build graph & CI parity (governance review)

**Status:** **Complete** (2026-04-27) — Turbo graph, CI parity, release vs fast-feedback gates, and Next clean-build policy are **Approved — implemented** with decision memos. Further YAML or **`turbo.json`** changes require a **new** memo or amendment.

**Objective:** Map how Turbo task dependencies, cache keys, and CI workflows relate; decide what is **fast feedback** vs **release-grade**; close gaps with **documented** choices, not ad hoc edits.

**Naming:** This stabilization program is **Phase 2** in `ROADMAP.md` (“Stabilization — Phase 2”). The older roadmap bullets **“Phase 2 — Runtime Stability”** / **“Phase 3 — Production Confidence”** are **product** tranches — different numbering. Prefer this doc + `ROADMAP.md` for stabilization status.

## Why this phase existed

Phase 1 added Node assertion, Next lock **detection**, and env/orchestration **docs** without changing the Turbo graph. Remaining items affected **build ordering**, **cache invalidation**, and **CI time vs coverage** — addressed via approved memos.

## Review tracks — outcomes

| Track | Outcome |
|-------|---------|
| **Turbo graph — `db:generate` and `^build`** | [2026-04-27-turbo-db-generate-dependency.md](decisions/2026-04-27-turbo-db-generate-dependency.md) — **`dependsOn: []`** implemented. |
| **CI parity — `env:check:ci` in `build-stability.yml`** | [2026-04-27-ci-workflow-parity.md](decisions/2026-04-27-ci-workflow-parity.md) — three-tier framework + **`env:check:ci`** on **`build-stability.yml`**. |
| **Release vs fast feedback** | [2026-04-27-release-vs-fast-feedback-gates.md](decisions/2026-04-27-release-vs-fast-feedback-gates.md) — gate map documented; YAML already aligned. |
| **Next clean-build policy** | [2026-04-27-next-clean-build-policy.md](decisions/2026-04-27-next-clean-build-policy.md) — web detection-only; CRM forced `.next` clean documented, unchanged. |
| **Env boundary enforcement** (lint/codemod) | **Out of scope** — follow **`env-access-boundary.md`** separately. |

## Exit criteria — met

- [workflow-inventory-2026-04-27.md](workflow-inventory-2026-04-27.md) maintained as facts table.
- Decision memos **Approved — implemented** for Turbo graph, CI parity, gates, Next clean-build.
- Implementations match memos (see each memo **Validation** section).

## Workflow inventory (facts)

[workflow-inventory-2026-04-27.md](workflow-inventory-2026-04-27.md) — update when workflows change.

## Decision memos (Phase 2 — Approved — implemented)

| Memo | Topic |
|------|--------|
| [2026-04-27-turbo-db-generate-dependency.md](decisions/2026-04-27-turbo-db-generate-dependency.md) | `db:generate` without `^build` |
| [2026-04-27-ci-workflow-parity.md](decisions/2026-04-27-ci-workflow-parity.md) | Three-tier CI + env contract on build-stability |
| [2026-04-27-release-vs-fast-feedback-gates.md](decisions/2026-04-27-release-vs-fast-feedback-gates.md) | What each workflow proves |
| [2026-04-27-next-clean-build-policy.md](decisions/2026-04-27-next-clean-build-policy.md) | Web vs CRM `.next` / lock policy |

## Proposed next stabilization program

**Phase 3 (governance-first):** [phase-3-runtime-deploy-readiness.md](phase-3-runtime-deploy-readiness.md) — runtime vs migration separation, deploy smoke strategy, production env readiness, pilot verify runbook, release job vs app boot responsibilities. **No** **`Dockerfile.api`** or runtime implementation until memos approve scope.

## Related

- Phase 0.6 / 1: `docs/stabilization/phase-0.6-guardrails-review.md`, `docs/stabilization/ROADMAP.md`
- Env: `docs/stabilization/local-orchestration.md`, `scripts/env-contract.mjs`
- Workflows: `.github/workflows/*.yml` — [workflow inventory](workflow-inventory-2026-04-27.md)
- Graph: `turbo.json`, root `package.json` scripts
