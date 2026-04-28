# Phase 0.6 — Guardrails Review (governance checkpoint)

**Status:** decision memos **Approved**; Phase **1.1–1.4** guardrails implemented (Node check, Next lock detection script, env/orchestration docs). Further changes go through the same memo process.

**Objective:** Turn Phase 0 stabilization (env contract, examples, gates) into **enforceable checks** without changing application runtime behavior.

## Why this phase exists

Phases 0.1–0.5 fixed drift and documented contracts. Phase 0.6 decides **what to automate next** and **where boundaries sit**, so later work does not surprise operators or widen scope.

## Review tracks

### 1. Runtime version enforcement

- Decide whether CI should run `node --version` (or equivalent) and **fail** unless Node matches `package.json` `engines` (e.g. Node 22).
- Reconcile **Docker base images**, **GitHub Actions** `node-version`, **local docs**, **`.nvmrc` / `.node-version`**, and **`engines.node`** so a single story is documented. No merge of conflicting files in this review—only decisions and a target state.

### 2. Next build lock policy

- Choose one direction (or explicit “not yet”):
  - **Detect only** (warn when a stale lock is suspected),
  - **Dedicated cleanup script** (opt-in),
  - **Prebuild hook in `apps/web`** (only after explicit approval).
- **Do not** adopt broad `.next` deletion by default until approved — it changes build behavior and cache semantics.

### 3. Env access boundary

- Document where `process.env` is allowed:
  - API env module / config entry,
  - Next.js config and server-only modules,
  - maintenance **scripts**,
  - shared packages only for **explicitly public** build-time keys (if any).
- **No codemods** in Phase 0.6 — naming and rules only.

### 4. Local orchestration consistency

- Compare what **shell scripts source** vs what **`scripts/env-contract.mjs` reads** from disk.
- Align documented expectations for:
  - `pnpm run ship:gate`
  - `pnpm run verify:ship`
  - `pnpm run dev:api`
  - `pnpm run dev:web`
  - `pnpm run dev:crm`

Output: a short matrix (script → env load path → contract target) and any intentional differences.

## Exit criteria

- Written decisions for tracks 1–4 (even if “defer” or “no change”) — see **Decisions** below.
- All four memos are **Approved**; Phase 1.1–1.4 implementation is complete (see [ROADMAP.md](ROADMAP.md)).
- `PROJECT_SPACE.md` updated for guardrails and doc links.

## Decisions

Memos in `docs/stabilization/decisions/` — **Approved**; implementation as summarized below.

| Memo | Track |
|------|--------|
| [2026-04-27-ci-node-assertion.md](decisions/2026-04-27-ci-node-assertion.md) | **Approved** — `scripts/assert-node-version.mjs`, `pnpm run node:check`, CI step |
| [2026-04-27-next-build-lock-policy.md](decisions/2026-04-27-next-build-lock-policy.md) | **Approved** — `scripts/check-next-lock.mjs`, `pnpm run web:lock:check` (no delete) |
| [2026-04-27-env-access-boundary.md](decisions/2026-04-27-env-access-boundary.md) | **Approved** — [env-access-boundary.md](env-access-boundary.md) |
| [2026-04-27-local-orchestration-env-alignment.md](decisions/2026-04-27-local-orchestration-env-alignment.md) | **Approved** — [local-orchestration.md](local-orchestration.md) |

**Owner direction (2026-04-27):** As recorded in each memo; implementation matches **Approved** memos. Lint/codemod and script normalization remain **out of scope** until a new decision.

**Governance:** New guardrail or behavior changes require an updated memo or a new decision file. Rollback: revert the scripts/docs/workflows listed in each memo’s implementation summary.

## Related

- Env contract: `scripts/env-contract.mjs`, root `README.md`
- Stabilization roadmap: `docs/stabilization/ROADMAP.md`
