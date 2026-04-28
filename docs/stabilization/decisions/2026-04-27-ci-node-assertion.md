# Decision: CI and repo Node version assertion (Node 22)

Date: 2026-04-27
Status: Approved
Approved: 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

The repo targets Node 22 via `package.json` `engines` and (where present) `.nvmrc` / `.node-version`. Local developer shells may use a different major (e.g. Node 24), which diverges from CI and support expectations. This memo defines the **intended** fail-fast contract for CI and documentation; **no implementation** until Status is **Approved** and a follow-on change implements `scripts/assert-node-version.mjs` (or equivalent) per the Phase 1.1 plan.

## Options Considered

- **Rely only on `actions/setup-node@v4`:** Trust `node-version: 22` in workflows with no extra check.
- **Explicit `node --version` in CI:** Inline shell step that fails if the major is not 22.
- **Reusable script (e.g. `scripts/assert-node-version.mjs`):** Single implementation read by CI and, optionally, local `pnpm` script; compares runtime `process.versions` to `.node-version` or `package.json` `engines`.
- **Document-only:** README instructions without CI enforcement.

## Decision

**Target implementation (gated on Status: Approved; owner direction 2026-04-27 below):**

- In **Phase 1.1** (after this memo is **Approved**), add a small script such as `scripts/assert-node-version.mjs`.
- The script should read **`.node-version` or root `package.json` `engines`** and **fail** if the current Node **major** is not **22** (**major-22-only**).
- **CI** should run it **immediately after** Node setup and **before** `install` / build (exact workflow wiring in Phase 1.1).
- **Local** `pnpm run node:check` (once added) **should fail on Node 24** — that is **intended**; the point is the guardrail.
- **Local documentation** should direct contributors to use Node 22 via **`.nvmrc` / `.node-version`** (e.g. `nvm use`, `fnm`).
- **No code or workflow changes until** Status is set to **Approved** for Phase 1.

## Non-Goals

- Do **not** support Node 20 or Node 24 for this program while Node 22 is the pinned line (separate decision if the stack upgrades).
- Do **not** change Docker base images or `deploy/Dockerfile.*` in the implementation tied to this memo unless a separate approved change says so.
- Do **not** change `package.json` dependencies or `pnpm-lock.yaml` as part of adopting this decision (version assertion is orthogonal).

## Rollout

### CI

- After approval: add `pnpm run node:check` (or `node scripts/assert-node-version.mjs`) as an early step post-`setup-node` (Phase 1.1 allowed file list).

### Local

- Document expected Node 22; optional local preflight via the same script once added (fails on Node 24 — **intended** after approval).
- `Unsupported engine` warnings from `pnpm` are acceptable until the user switches Node.

### Docs

- Root `README.md` / `PROJECT_SPACE.md` prerequisites: align with Node 22 + `.nvmrc` / `.node-version` when implementation lands.

## Risks

- Contributors on unsupported Node majors see local failures after the script exists — mitigated by clear docs and CI as source of truth.
- Drift between `.node-version`, `engines`, and workflow `node-version` if not updated together.

## Validation

- After implementation: `node scripts/assert-node-version.mjs` and `pnpm run node:check` pass only on Node 22; `git diff --check` clean in Phase 1.1.

## Follow-Up

- Revisit when the org moves to a new Node LTS; amend or replace this memo before changing the major.

## Owner record (2026-04-27)

- **Direction approved:** **major-22-only** for the version assertion.
- **Local behavior:** after implementation, `node:check` **should** fail on Node 24; that is the point of the guardrail.

`Status` remains **Proposed** until maintainers set it to **Approved** to authorize Phase 1.1 work.

**Governance:** No Phase 1 implementation until `Status: Approved`. When Approved, this memo is the scope boundary and rollback reference for Phase 1.1.
