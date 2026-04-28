# Decision: Local orchestration and `env-contract.mjs` alignment

Date: 2026-04-27
Status: Approved
Approved: 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

`scripts/env-contract.mjs` reads specific files from disk for the **local** contract (e.g. API and web env files) and merges with `process.env`. Shell entrypoints may **source** a different subset, so a developer can pass `env:check:local` while the interactive shell is missing variables for other commands, or vice versa. This memo records **current behavior** and a **proposed** direction for later normalization **without** changing scripts in Phase 0.6A.

## Options Considered

- **Leave scripts as-is**; rely only on documentation.
- **Make shell scripts `source` all app env files** that the contract reads (API + web + CRM as applicable).
- **Stop sourcing in shell**; rely on `node env-contract` and explicit `export` for steps that need variables in the shell.
- **Document the delta**; add stricter checks or sourcing only after security/architecture review.

## Decision

**Target documentation and process (gated; owner direction 2026-04-27 below):**

1. **Document current behavior precisely** (Phase 1.4 will expand this into `docs/stabilization/local-orchestration.md`).

**Observed / owner-approved documentation baseline:**

| Mechanism | Behavior |
|-----------|----------|
| **`scripts/ship-gate.sh`** | Sources `apps/api/.env.local` and `apps/api/.env` (in order), then `unset NODE_ENV`, then runs `pnpm run env:check:local`, then Prisma / build / etc. |
| **`scripts/verify-ship-local.sh`** | Sources **`apps/api/.env.local` only** (not `apps/api/.env`), then `unset NODE_ENV`, then `pnpm run env:check:local`, then `DATABASE_URL` check, then turbo build, etc. |
| **`scripts/env-contract.mjs` (local)** | Reads merged values from **API** files: `apps/api/.env.local`, `apps/api/.env`; **web**: `apps/web/.env.local`; **crm**: `apps/crm/.env.local`; then merges with `process.env`. |

2. The **asymmetry** (ship-gate sources two API files; verify-ship sources only `.env.local`) is **treated as intentional** pending a **separate** follow-on decision; **no script changes** until that follow-on is approved.

3. **Normalize sourcing behavior** (e.g. also source `apps/api/.env` in `verify-ship`, or add web sourcing) remains a **later phase** — requires **separate approval** and **security review** for broadening shell-loaded env. **Do not** source web env into shell scripts unless explicitly approved.

4. **Phase 0.6A / pre-follow-on:** no edits to `ship-gate.sh` or `verify-ship-local.sh` without a new approved change.

## Non-Goals

- Do **not** change `ship-gate.sh` / `verify-ship-local.sh` behavior in the memo-creation phase.
- Do **not** source web env into shell scripts in this step.
- Do **not** broaden env loading without **security review** and an approved follow-on memo or amendment.

## Rollout

### CI

- N/A for “local” sourcing; CI uses `env:check:ci` with step-level `env`.

### Local

- After docs exist: single place (`docs/stabilization/local-orchestration.md` + README) explains which files matter for which command.

### Docs

- Phase 1.4: `docs/stabilization/local-orchestration.md` + `README` / `PROJECT_SPACE` cross-links; lists `pnpm run dev:api` / `dev:web` / `dev:crm` and `env:check:*` behavior at a high level from reading `package.json` and scripts (no code changes in 1.4).

## Risks

- Mismatch between “contract OK” and “subshell missing vars” confuses developers — mitigated by documentation and later optional script alignment.
- Overloading shell `source` with many files could re-read secrets; keep any future expansion minimal and reviewed.

## Validation

- Manual review: run commands match documented matrix after Phase 1.4; `git diff --check` on docs.

## Follow-Up

- If a follow-on is opened to normalize sourcing, amend this memo with exact file list and review sign-off.

## Owner record (2026-04-27)

- **`ship-gate.sh`** sources `apps/api/.env.local` and `apps/api/.env` — **approved** as documented.
- **`verify-ship-local.sh`** sources **only** `apps/api/.env.local` — **approved** as documented.
- **Asymmetry** between the two is **intentional for now**; any change is a **separate follow-on** decision (with security review if shell loading expands).

`Status` remains **Proposed** until maintainers set it to **Approved** to authorize Phase 1.4 and any later script work.

**Governance:** No script changes without an approved follow-on; Phase 1.4 is docs-only if scoped to this memo.
