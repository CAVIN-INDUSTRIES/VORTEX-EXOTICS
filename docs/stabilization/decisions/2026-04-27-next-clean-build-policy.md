# Decision: Next.js clean-build policy (web detection vs CRM existing behavior)

Date: 2026-04-27
Status: **Approved — implemented** 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: If web or CRM build scripts change materially

## Context

- **Web (`apps/web`):** Phase 1 shipped **detection-only** for a stale Turbopack/Next lock file — **`scripts/check-next-lock.mjs`** and **`pnpm run web:lock:check`**. Policy: **fail the check**, do **not** auto-delete **`apps/web/.next/lock`** or the **`.next`** tree from new automation. See [2026-04-27-next-build-lock-policy.md](2026-04-27-next-build-lock-policy.md) (**Approved**).

- **CRM (`apps/crm`):** **`package.json`** **`build`** currently runs a **forced** removal of **`.next`** before **`next build`** (inline **`node -e` `rmSync`**). This is **existing behavior**, documented here as **not** introduced by this memo and **unchanged** in this pass.

## Decision

1. **Web — detection only:** Keep **`pnpm run web:lock:check`** as the guardrail. **No** repo automation that deletes **`apps/web/.next/lock`** or broadly deletes **`apps/web/.next`** without a **future** approved change.

2. **Web — no broad `.next` delete:** Do not add CI or root scripts that wipe **`apps/web/.next`** by default.

3. **CRM — document, do not change:** Forced **`.next`** clean before CRM **`next build`** remains **as implemented** in **`apps/crm/package.json`**. Treat as **CRM packaging choice**, not as the default for web.

4. **Policy split:** Web and CRM policies **diverge by design** (detection vs forced clean). **No separate memo** is required until a future change would **modify** CRM behavior or **add** automated deletion on web.

5. **Future changes:** Any new auto-delete, CRM script change, or CI-driven **`.next`** cleanup requires **explicit approval** and usually a new decision memo.

## Options Considered

| Option | Outcome |
|--------|---------|
| Unify CRM to web-style detection only | **Deferred / not selected** — would require editing **`apps/crm/package.json`** (out of scope; protected for this batch). |
| Add web `.next` auto-clean in CI | **Rejected** — violates detection-only Phase 1 intent. |
| Document current web + CRM behavior and freeze | **Selected** — matches implementation. |

## Non-Goals

- **No** edits to **`apps/crm/package.json`**, **`apps/web/package.json`**, or app build scripts under this decision.
- **No** new automation that deletes **`.next`** trees without approval.

## Rollout

### CI

No workflow change required for this policy (web lock check already available locally / in gates as wired elsewhere).

### Local

Developers run **`pnpm run web:lock:check`** before web work when diagnosing stale locks; remove **`.next/lock`** manually if the check fails and a clean build is intended.

### Docs

This memo + [next-build-lock-policy.md](2026-04-27-next-build-lock-policy.md) + **`workflow-inventory`** / hub links.

## Risks

- **Two mental models:** contributors must remember **web** = detect, **CRM** = clean-before-build — mitigated by this memo and CRM script comment (optional future: one-line comment in CRM script via approved app change).

## Validation

- Repo state reviewed 2026-04-27: **`web:lock:check`** present at root **`package.json`**; CRM **`build`** still includes **`rmSync('.next', …)`**; no conflicting new automation added in this stabilization batch.

## Follow-Up

- Split to a **CRM-only** memo only if CRM clean policy changes independently of web.

## References

- [2026-04-27-next-build-lock-policy.md](2026-04-27-next-build-lock-policy.md)
- [workflow-inventory-2026-04-27.md](../workflow-inventory-2026-04-27.md)
- CRM build script: `apps/crm/package.json` (read-only reference for this memo)
