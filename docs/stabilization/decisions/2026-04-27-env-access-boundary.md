# Decision: `process.env` access boundary

Date: 2026-04-27
Status: Approved
Approved: 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

Unrestricted `process.env` reads complicate security review, increase the risk of leaking server-only config into client bundles, and make multi-app consistency harder. After Phase 0.4–0.5 env contracts, the next step is a **documented** policy for **where** environment variables may be read. **Lint rules and codemods are out of scope** until this memo is approved and a later phase authorizes them.

## Options Considered

- **Allow `process.env` anywhere** in the monorepo (status quo, minimal friction).
- **Centralize per app** — API, web, and CRM each read env through a small set of modules; shared packages do not read env.
- **Add ESLint (or similar) rules immediately** to enforce boundaries.
- **Governance-first:** publish allowed/disallowed surfaces in docs; add lint/codemods only after approval.

## Decision

**Target policy (gated on follow-on doc phases; owner direction 2026-04-27 below):**

- **Governance-first — document** allowed access surfaces; **no codemod or lint** until **separately** approved.
- For now, **policy and documentation only** (Phase 1.3 doc); no automated enforcement in this tranche.

**Allowed (target policy; central API modules owner-approved):**

- `apps/api/src/lib/env.ts` and **`apps/api/src/lib/productionEnv.ts`** for API-wide reads where practical (or their successors if renamed).
- **App framework config files** (e.g. Next `next.config`, API entry/bootstrap) as needed.
- **Scripts** under `scripts/` (including `env-contract.mjs`, maintenance, CI helpers).
- **Next.js** — server-only route handlers, server components, and config where necessary; **client bundles** only for `NEXT_PUBLIC_*` as required by Next conventions.

**Discouraged:**

- Direct `process.env` in **shared packages** (`packages/*`) except an explicitly listed, build-time, public contract (if ever needed — default **none**).
- Direct `process.env` in **reusable UI packages** (`packages/ui`, design system, cinematic, etc.).
- **Scattered** reads across every controller/service in API — prefer central modules.

**Later implementation (separate approved phase):** optional ESLint boundaries or limited codemods; **do not** touch tenant, auth, RBAC, or billing code as part of an env-boundary pass unless explicitly scoped.

**Pre-doc-enforcement:** no new lint or codemod; **no application source edits** for boundary enforcement in this step.

## Non-Goals

- Do **not** run codemods or mass refactors in this memo phase.
- Do **not** change runtime behavior of the API, web, or CRM to “fix” env access in this step.
- Do **not** modify tenant scoping, auth, Stripe, or billing code under the guise of env cleanup without a scoped, reviewed change.

## Rollout

### CI

- No change until lint is approved; then optional `eslint` job scoped to new rules (future).

### Local

- No change; developers follow docs once `docs/stabilization/env-access-boundary.md` exists in Phase 1.3.

### Docs

- Phase 1.3 will add **docs/stabilization/env-access-boundary.md** with app/package matrix and `NEXT_PUBLIC_*` rules for web/CRM.

## Risks

- Documented policy ahead of refactors can diverge from the tree — mitigate by labeling policy “target state” and tracking gaps.
- Over-tight future lint may block edge cases; allow explicit file allowlist escape hatches in a later design.

## Validation

- Phase 1.3: `git diff --check` on docs only; no code diffs in that sub-phase.

## Follow-Up

- After stabilization, consider one package at a time for centralization, each with a small PR and tests.

## Owner record (2026-04-27)

- **Central API env modules (approved for policy):** `apps/api/src/lib/env.ts`, `apps/api/src/lib/productionEnv.ts`.
- **For now:** **policy and documentation only**; **no** codemod or lint rule until **separately** approved.

`Status` remains **Proposed** until maintainers set it to **Approved** to authorize Phase 1.3 (docs) and any later enforcement.

**Governance:** Doc-only Phase 1.3 requires **Approved** if tied to this memo; future lint/codemod needs its own approval.
