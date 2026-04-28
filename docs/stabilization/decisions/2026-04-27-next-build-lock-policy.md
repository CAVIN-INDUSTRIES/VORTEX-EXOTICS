# Decision: Next.js build lock policy (`apps/web/.next/lock`)

Date: 2026-04-27
Status: Approved
Approved: 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

Next.js may leave a lock file under `apps/web/.next/lock` (or equivalent) while a build is running or after an interrupted run. A **stale** lock can block subsequent builds. This memo chooses a **safe** first line of defense: **detection and guidance**, not automatic deletion of `.next` or the lock.

## Options Considered

- **Detect lock only and fail** with a clear, actionable message (no filesystem mutation).
- **Delete only `apps/web/.next/lock` when no active `next` process is detected** (heuristic, platform-sensitive).
- **Delete all of `apps/web/.next` before every web build** (fastest unblock, highest behavior/cache risk).
- **Do nothing** in automation; document manual cleanup only.

## Decision

**Target implementation (gated on Status: Approved; owner direction 2026-04-27 below):**

- **Start with detection-only** as the guardrail.
- In **Phase 1.2** (after approval), add a script such as **`scripts/check-next-lock.mjs`** that:
  - Checks the **observed path `apps/web/.next/lock`** (owner-confirmed for initial implementation).
  - **Must not** delete `.next`, `.next/lock`, or other cache files — **no filesystem mutation** in the script.
  - Prints **remediation guidance** (e.g. ensure no other `next` process is running; operator may remove the lock manually if appropriate; never rely on the script to delete).
- **Optional later:** process-detection to infer “stale” vs “active” build **only if** low-fragility and approved separately.
- **Cleanup automation** (deleting lock or tree) is a **separate explicit decision** — out of scope for the first implementation.

**Phase 0.6A / pre-1.2:** no scripts, no `package.json` changes, no Next config changes.

## Non-Goals

- Do **not** add **automatic** `.next` or lock deletion in the first implementation tranche.
- Do **not** change `apps/web` build scripts or `next.config` as part of this decision memo.
- Do **not** wire the checker into default `build:web` until separately approved (manual/diagnostic command first per Phase 1.2 plan).

## Rollout

### CI

- After approval, optional: run `pnpm run web:lock:check` in diagnostics or a non-blocking job until policy tightens (Phase 1.2).

### Local

- Developers run `pnpm run web:lock:check` when builds fail mysteriously; script exits non-zero if lock present.

### Docs

- `README.md` / `PROJECT_SPACE.md`: short “stale Next lock” troubleshooting pointer once the script exists.

## Risks

- False positives if a legitimate long-running `next` holds the lock — message must distinguish “another build may be running.”
- Path drift if Next changes lock location in a future major.

## Validation

- `node --check scripts/check-next-lock.mjs` and `pnpm run web:lock:check` (Phase 1.2); if a lock exists in the worktree, nonzero exit is **expected** and reported as environment state, not as a bad script.

## Follow-Up

- If detection-only is insufficient, open a new memo for **opt-in** lock removal or **narrow** cleanup rules (never default to deleting full `.next` without approval).

## Owner record (2026-04-27)

- **Direction approved:** **detection-only** first; initial check targets **`apps/web/.next/lock`**.
- **Must not** delete `.next`, `.next/lock`, or cache files in the guardrail script.

`Status` remains **Proposed** until maintainers set it to **Approved** to authorize Phase 1.2 work.

**Governance:** No Phase 1 implementation until `Status: Approved`. When Approved, this memo is the scope boundary and rollback reference for Phase 1.2.
