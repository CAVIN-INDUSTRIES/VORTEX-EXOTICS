# Decision: Pilot verify runbook consistency

Date: 2026-04-27
Status: Approved — governance implemented
Owner: Principal Engineer / Staff Architect
Review Date: 2026-04-28

## Context

**`pnpm run pilot:verify`** maps to **`scripts/pilot-verify.mjs`**. **`pnpm run ship:gate`** runs **`scripts/ship-gate.sh`**. **`docs/PILOT_SHIP.md`** orders manual steps. This memo locks **official** expectations so **`PROJECT_SPACE.md`**, **`README.md`**, and **`deploy/README.md`** describe the same boundaries.

## Decision

| Topic | Official stance |
|-------|-----------------|
| **`ship:gate`** | **Pre-deploy** local/CI **release gate**: env contract (local) → generate → **turbo build** → **`migrate deploy`** (when not CI) → API (and web) **E2E** — see **`scripts/ship-gate.sh`** / **`docs/PILOT_SHIP.md`**. |
| **`pilot:verify`** | **Post-deploy** verification against an **already running** API origin — HTTP **`fetch`** only (**`/health`**, **`/`**, optional endpoints). |
| **`PILOT_VERIFY_API_URL`** | **Required** for a non-skip run — normalized origin without trailing slash (see **`pilot-verify.mjs`**). |
| **`PILOT_VERIFY_BRANDING_DOMAIN`** | **Optional** — when set, validates **`GET /public/branding`** for pilot **`customDomain`** smoke. |
| **`PILOT_VERIFY_INTERNAL_KEY`** | **Optional** — aligns with API **`INTERNAL_PILOT_METRICS_KEY`** for **`GET /dealer/pilots`** when set. |
| **What `pilot:verify` does *not* replace** | **Prisma migrations**, **full turbo build**, API **E2E**, **tenant isolation** tests, or **`ship:gate`** — orthogonal concerns. |
| **PR CI** | **`pilot:verify`** should **not** be assumed to run against a real URL on every PR — it **exits 0** when **`PILOT_VERIFY_API_URL`** is unset (**skip**), unless **`PILOT_VERIFY_STRICT`**. |
| **Deploy workflows** | **`pilot:verify`** **may** run **only when** a **real deployed API URL** is available (secret or generated preview)—otherwise skip remains valid. |

**Dealer-ready line:** **`pilot:verify`** exit **0** **after** deploy is the automated **HTTP + DB-via-health** proof — still **not** a substitute for **`ship:gate`**.

## Evidence

| Proof | Source |
|-------|--------|
| **`/health`** **200**, **`status`**, **`db`** | **`pilot-verify.mjs`** |
| **`/`** JSON **`api`** contains **`vex`** | **`pilot-verify.mjs`** |
| Skip vs strict | **`PILOT_VERIFY_API_URL`** empty → skip **0**; **`PILOT_VERIFY_STRICT`** + missing URL → **1** |

## Options Considered

| Option | Outcome |
|--------|---------|
| **1** | **`pilot:verify`** optional in default CI; mandatory in human **`PILOT_SHIP`** — **adopted**. |
| **2** | **`PILOT_VERIFY_STRICT`** in **`deploy-prod`** — **future** workflow change (not this memo). |
| **3** | Rename **`PILOT_VERIFY_INTERNAL_KEY`** — docs-only alignment **later** if needed. |

## Non-Goals

- **No** edits to **`scripts/pilot-verify.mjs`** as part of this **governance** approval (runtime unchanged).

## Risks

Naming drift between **`PILOT_VERIFY_INTERNAL_KEY`** and **`INTERNAL_PILOT_METRICS_KEY`** — operators map env at verify time; document in **`README`**.

## Validation

- Compared **`pilot-verify.mjs`**, **`package.json`**, **`README.md`**, **`deploy/README.md`**, **`docs/PILOT_SHIP.md`**, **`PROJECT_SPACE.md`**, **`ship-gate.sh`** — **2026-04-27**.

## Follow-Up

- Small **`docs/PILOT_SHIP.md`** patch for branch-protection job naming when convenient (**separate** doc batch).

---

**Governance:** Documentation alignment only—no runtime, Docker, migration, Prisma, auth, billing, or tenant behavior changes.
