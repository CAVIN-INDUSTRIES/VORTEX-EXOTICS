# Decision: API container migration responsibility

Date: 2026-04-27
Status: **Approved — implemented** 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: As needed if hosting model changes

## Context

Production API containers must apply schema changes safely relative to app boot, CI, and operator workflows. This memo records **approved** ownership of **`prisma migrate deploy`** vs the **`Dockerfile.api`** runtime.

## Evidence

### Historical behavior (superseded 2026-04-27)

Previously **`deploy/Dockerfile.api`** **`CMD`** chained **`prisma migrate deploy`** then **`node`**, so **every** replica ran migrations at boot.

### Current behavior (implemented)

| Location | Command / step | When |
|----------|----------------|------|
| **`deploy/Dockerfile.api`** | **`CMD`**: **`node /repo/apps/api/dist/index.js`** only | **Container start** — **no** migrations (**Approved** change). |
| **Release / deploy job** | **`pnpm --filter @vex/api exec prisma migrate deploy`** (from repo root, **`DATABASE_URL`** targeting production DB) | **Once per deploy**, **before** new API replicas receive traffic — operator/platform responsibility. |
| **`.github/workflows/deploy-prod.yml`** | **`pnpm exec prisma migrate deploy`** in **`apps/api`** | CI/release verification against workflow Postgres **before** build/tests — complements production migrate discipline (see workflow comment). |
| **`.github/workflows/ci.yml`** | **`prisma db push`** | Ephemeral CI DB — unchanged. |
| **`scripts/ship-gate.sh`** | **`migrate deploy`** when **`CI≠true`** | Local gates against real DB — unchanged. |

### Multiple replicas

Migrations run **once per deploy** in the release job — **not** once per replica at boot — avoiding redundant **`migrate deploy`** storms.

### Migration failure

Release job must fail deploy / block rollout if **`migrate deploy`** fails — API containers must **not** start against an unmigrated schema (**platform requirement**).

## Decision

1. **Migrations are owned by the explicit release/deploy step**, not by API container boot.
2. **`deploy/Dockerfile.api`** runtime **`CMD`** starts **only** the compiled API (**`node …/dist/index.js`**).
3. **`pnpm --filter @vex/api exec prisma migrate deploy`** (with correct **`DATABASE_URL`**) runs **once per deploy** before new replicas serve traffic.
4. **Rollback:** If the hosting platform **cannot** run a release migrate step, operators may temporarily restore the prior **`CMD`** pattern (`migrate deploy && node`) **locally or in a fork** — not recommended for multi-replica production long term.

## Options Considered

| Option | Outcome |
|--------|---------|
| **A** Boot migrations | **Rejected** for production clarity / replica behavior. |
| **B** Release-job-only migrations | **Approved — implemented.** |
| **C** Env-flag dual mode | **Not selected** — single policy preferred. |
| **D** Defer | **Superseded** by owner approval of **B**. |

## Non-Goals

- **No** edits to **`apps/api/prisma/schema.prisma`** or **`migrations/**`** under this decision.
- **No** change to migration **history** or SQL — **ownership and Dockerfile **`CMD`** only.**

## Rollout

### CI

Unchanged — **`ci.yml`** continues **`db push`**.

### Local

**`ship-gate`** unchanged — still runs **`migrate deploy`** when not **`CI`**.

### Deploy

Operators **must** configure a **release command/job** (Railway/GitHub Actions/Kubernetes Job, etc.) that runs **`migrate deploy`** against the **production** database **before** rolling out new **`Dockerfile.api`** images. **Serious tradeoff:** without it, containers can start against an **unmigrated** database — fix in **deployment config**, not by restoring boot migrations without owner approval.

### Docs

**`deploy/README.md`** — required deploy order; **`README.md`** pointer; this memo.

## Risks

- **Platform gap:** If no migrate step exists, production deploys risk schema drift — **mitigate** with CI/release automation and monitoring.

## Validation

- **`deploy/Dockerfile.api`** **`CMD`** updated — **2026-04-27**.
- **`git diff --check`**, **`docker compose … config`**, **`pnpm --filter @vex/api run build`**, **`pnpm -w turbo run build`** — recorded in implementation notes.

## Follow-Up

- Optional: add platform-specific examples (Railway release phase, K8s Job) in **`deploy/README.md`** when hosting is fixed.

---

**Governance:** This memo **Approved — implemented** authorizes the **`Dockerfile.api`** **`CMD`** change documented above. Further runtime edits require amendment or new memo.
