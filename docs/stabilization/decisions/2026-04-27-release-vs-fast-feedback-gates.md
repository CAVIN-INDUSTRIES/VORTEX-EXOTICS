# Decision: Release-grade vs fast-feedback CI gates

Date: 2026-04-27
Status: **Approved — implemented** 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: When triggers or branch protection change materially

## Context

Several GitHub Actions workflows run on **`main`** and pull requests with **different** triggers (`paths-ignore`, path filters), scopes (affected-only **`[HEAD^1]`** vs full workspace build), and test matrices. Factual layout: **`docs/stabilization/workflow-inventory-2026-04-27.md`**.

Tier definitions and env-contract alignment are **Approved** in [2026-04-27-ci-workflow-parity.md](2026-04-27-ci-workflow-parity.md). **This memo** records what each tier **proves** for merge / health / security so teams do not conflate “green on one workflow” with “release-ready everywhere.”

---

## Official gate map (aligned with inventory + CI parity memo)

| Role | Workflow | What it proves |
|------|-----------|----------------|
| **Release-grade** | `.github/workflows/ci.yml` | **Primary integration gate** on code paths (paths-ignore docs-only): env contract, Postgres + **`db push`** for CI schema, affected Turbo pipeline including **`test:e2e`**, **`ship:gate`**, **`pilot:verify`**. **Deploy readiness** for the default merge path. |
| **Release-grade** | `.github/workflows/deploy-prod.yml` | **Release-style** verification: env contract, migrate ledger, broader test matrix, audit/Trivy, optional deploy hooks. **Post-merge / dispatch** path when production verification is required. |
| **Build-stability** | `.github/workflows/build-stability.yml` | **Workspace + visual smoke health:** no paths-ignore (runs on doc-only pushes too); Node assertion; install; **`env:check:ci`** (per CI parity); sequential shared/cinematic/Prisma generate; **full** **`pnpm -w turbo run build`**; **`@vex/web` Playwright smoke**. **Not** identical to **`ci.yml`** (no service Postgres, no API E2E here). |
| **Targeted quality** | `.github/workflows/quality.yml` | **Fast PR feedback** when web-related paths change: path-filtered; Turbo **`quality:web`** / **`quality:3d`**. **No** env contract by design unless a future command proves need — keeps latency low. |
| **Non-app security** | `.github/workflows/secret-scan.yml` | **Secret scanning** (gitleaks) **outside** app build / test parity — intentionally **not** Node install / Turbo / Prisma. |

---

## Decision

1. **Not all workflows should be identical.** Each file above has a distinct **purpose**; parity is **within-tier** expectations (see CI parity memo), not copy-paste steps across every YAML.

2. **Release-grade gates** (**`ci.yml`**, **`deploy-prod.yml`**) **prove deploy readiness** for their respective triggers: DB contract, integration/E2E or ship gate, pilot verification where wired.

3. **`build-stability.yml`** **proves** the **full workspace** and **web visual smoke** stay healthy on a **broad** trigger surface, including changes that **`ci.yml`** ignores.

4. **`quality.yml`** stays **narrower** so **PR feedback** stays fast on web-scoped edits.

5. **`secret-scan.yml`** is **intentionally outside** app-gate parity — security signal only.

**Workflow YAML:** No additional edits were required for this memo beyond what **CI workflow parity** already implemented (**`env:check:ci`** on **`build-stability.yml`**). **`ci.yml`**, **`deploy-prod.yml`**, **`quality.yml`**, **`secret-scan.yml`** unchanged under this decision.

---

## Options Considered

| Option | Outcome |
|--------|---------|
| Unify all workflows to the same step list | **Rejected** — slows targeted jobs; contradicts tier model. |
| Document tier purposes + keep current YAML | **Selected** — matches inventory and approved CI parity mapping. |
| Add release-only workflow | **Not needed** — existing **`deploy-prod.yml`** covers release path. |

---

## Non-Goals

- **No** blanket “make **`quality.yml`** like **`ci.yml`**” without a new memo.
- **No** expectation that **`secret-scan`** runs app builds.

## Rollout

### CI

Operators treat **release-grade** workflows as **blocking** for merge/deploy policy; **build-stability** as **broad health**; **quality** as **scoped** PR signal; **secret-scan** as **security** (configure branch protection accordingly).

### Local

Mirror **release-grade** intent with **`pnpm run ship:gate`** / **`pnpm run env:check:local`** per **`docs/PILOT_SHIP.md`** and **`local-orchestration.md`**.

### Docs

This memo + **`workflow-inventory`** + **`PROJECT_SPACE.md`** / **`ROADMAP.md`** are the hub pointers.

## Risks

- **Mis-read greens:** a PR green on **`quality.yml`** alone does not replace **`ci.yml`** for merge if branch protection requires **`ci.yml`**.
- **Doc-only pushes:** can skip **`ci.yml`** but still run **`build-stability.yml`** — intentional breadth vs depth tradeoff.

## Validation

- Inventory and workflows reviewed 2026-04-27; **no** YAML mismatch found beyond CI parity memo scope.

## Follow-Up

- Align **branch protection** required checks with the tier table (repo settings; out of band for this memo).

## References

- [workflow-inventory-2026-04-27.md](../workflow-inventory-2026-04-27.md)
- [2026-04-27-ci-workflow-parity.md](2026-04-27-ci-workflow-parity.md)
- [phase-2-build-graph-ci-parity-review.md](../phase-2-build-graph-ci-parity-review.md)
