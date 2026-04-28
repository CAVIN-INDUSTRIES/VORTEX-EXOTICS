# Decision: CI workflow parity (release vs fast feedback)

Date: 2026-04-27
Status: **Approved — implemented** 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: As needed if tiers or workflows change materially

## Decision question

**Which workflows are release-grade and must enforce the full contract, versus which are fast feedback and may remain lighter?**

Parity does **not** mean making every workflow identical. It means **classifying** each workflow’s role, then **closing real gaps** (missing Node assertion, missing env contract where commands need it, inconsistent install/build assumptions) **within tier**, without forcing release-grade cost onto targeted jobs.

See factual triggers and steps in **`docs/stabilization/workflow-inventory-2026-04-27.md`** (update that inventory when workflow YAML changes).

---

## Workflow tiers (framework) — **Approved**

### Approved tier → workflow mapping

| Tier | Workflow files |
|------|------------------|
| **Release-grade** | `.github/workflows/ci.yml`, `.github/workflows/deploy-prod.yml` |
| **Build-stability** | `.github/workflows/build-stability.yml` |
| **Targeted quality** | `.github/workflows/quality.yml` |
| **Out of app-gate scope** | `.github/workflows/secret-scan.yml` |

### 1. Release-grade

**Intent:** Ship readiness — schema/DB contract, full build, integration/E2E or equivalent gate, and deploy or pilot verification where applicable.

**Must include (minimum bar):**

- Node assertion (`assert-node-version` / aligned Node major with CI).
- Dependency install (`pnpm install` with lockfile discipline).
- **`pnpm run env:check:ci`** (or equivalent) when the job runs commands that assume resolved env keys.
- Prisma/schema setup appropriate to the path (**`db:generate`**, **`db push`** or **`migrate deploy`** per policy — inventory documents current split).
- Full workspace or release-filtered **`pnpm -w turbo run build`** per policy.
- API **`test:e2e`** or **equivalent** integration proof defined for that pipeline (e.g. Turbo **`ship:gate`** where that is the release contract).
- Deploy hooks / **`pilot:verify`** (or documented equivalent) **when** that workflow is responsible for post-merge release verification.

---

### 2. Build-stability

**Intent:** Broad build health and breakage detection without claiming full release contract on every path.

**Must include:**

- Node assertion.
- Install.
- **`pnpm run env:check:ci`** — **Approved:** added to **`build-stability.yml`** after install (same **`DATABASE_*`** / **`JWT_SECRET`** values as **`ci.yml`** env-contract step) because this workflow runs **full build + web smoke** and should align env assumptions with CI contract validation.
- Full **`pnpm -w turbo run build`** (or documented equivalent scope).
- Focused visual / web smoke **when** that is the purpose of the workflow (e.g. Playwright smoke after Chromium).

---

### 3. Targeted quality

**Intent:** Fast feedback on a **narrow path** (e.g. web + shared packages).

**Must include:**

- Node assertion.
- Install.

**Env contract:** **`env:check:ci`** only **if** the quality command relies on **env-sensitive app behavior** or fails without contract keys. **Approved:** **`quality.yml`** remains **without** **`env:check:ci`** unless a future gap is proven — stays targeted.

---

### Workflows outside the three tiers

**`secret-scan.yml`** — security scanning without Node/pnpm app setup; **not** expected to mirror release-grade gates. **No change.**

---

## Context

Workflows differ on **`env:check:ci`**, Postgres presence, build scope, and test matrix — see **`workflow-inventory-2026-04-27.md`**. The Turbo **`db:generate`** graph memo is **Approved — implemented**.

---

## Options Considered

| Option | Outcome |
|--------|---------|
| Adopt three-tier framework + approved mappings | **Selected** — see **Decision**. |
| Merge or split tiers differently | **Not selected** — current mapping sufficient. |
| Defer YAML changes | **Not selected** — minimal **`build-stability.yml`** edit implemented. |

---

## Decision

1. **Approve** the three-tier framework and the tier → workflow mapping in the table above.
2. **Do not** force identical steps across all workflows.
3. **`build-stability.yml`:** add **`pnpm run env:check:ci`** after install, before build/generate steps, with the same CI env values as **`ci.yml`** (**`DATABASE_URL`**, **`DIRECT_DATABASE_URL`**, **`JWT_SECRET`**). **Implemented** 2026-04-27.
4. **`quality.yml`:** **no** **`env:check:ci`** unless a quality command later proves it needs DB/API env — remains targeted.
5. **`secret-scan.yml`:** **no** change.
6. **`ci.yml`** / **`deploy-prod.yml`:** **no** change in this pass unless a separate audit finds a gap.

## Non-Goals

- **No** edits to **`quality.yml`**, **`secret-scan.yml`**, **`ci.yml`**, or **`deploy-prod.yml`** under this decision (except future gap-driven amendments).
- **No** change to **`turbo.json`** here.

## Rollout

### CI

- **`build-stability`** jobs now run **`env:check:ci`** consistently with release-grade env-contract validation keys.

### Local

- Developers can mirror CI contract checks:
  `DATABASE_URL=… DIRECT_DATABASE_URL=… JWT_SECRET=… pnpm run env:check:ci`

### Docs

- **`workflow-inventory-2026-04-27.md`** updated for **`build-stability.yml`** env-contract step.

## Risks

- **Over-unification:** avoided — **`quality.yml`** stays lighter per tier rule.
- **Contract drift:** **`build-stability`** uses the same env literal pattern as **`ci.yml`** for the env-contract step — align if **`ci.yml`** contract keys change.

## Validation

**2026-04-27 (agent env):**

| Check | Result |
|-------|--------|
| **`git diff --check`** | Exit **0** |
| **`DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vex` `DIRECT_DATABASE_URL=…` `JWT_SECRET=ci-env-contract-test` `pnpm run env:check:ci`** | Exit **0** — **`env-contract: OK`** |
| **`pnpm -w turbo run build`** (workspace standard after substantive change) | Exit **0** |

Full workflow run not substituted for local simulation.

## Follow-Up

- Reconcile **`workflow-inventory`** if **`ci.yml`** env-contract env vars change.
- Phase 2 umbrella: **`docs/stabilization/phase-2-build-graph-ci-parity-review.md`**.

## References

- Inventory: `docs/stabilization/workflow-inventory-2026-04-27.md`
- Hub: `PROJECT_SPACE.md` (Phase 2 pointer)
