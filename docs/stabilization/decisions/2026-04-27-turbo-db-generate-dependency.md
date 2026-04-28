# Decision: Turbo `db:generate` task dependency (`^build`)

Date: 2026-04-27
Status: **Approved** — implemented 2026-04-27
Owner: Principal Engineer / Staff Architect
Review Date: TBD (if graph policy is revisited)

## Context — repo snapshot (facts)

These statements describe **today’s tree**; they are not arguments for or against changing `dependsOn`.

### `turbo.json`

- Task **`db:generate`** has **`dependsOn: []`** (`^build` was removed — **Approved** decision; see **Decision** / **Implementation**).
- Outputs include **`.prisma/**`**; inputs include **`apps/api/prisma/schema.prisma`**, migrations, and SQL ops paths.
- Task **`test:e2e`** has **`dependsOn: ["build", "db:generate"]`** globally.

### `apps/api/package.json`

- **`prebuild`:** `pnpm run db:generate` (runs **before** `pnpm run build` when invoked at the package level).
- **`build`:** `tsc`.
- **`db:generate`:** `prisma generate`.

So the API package **always** runs Prisma generate immediately before its compile step when building via npm lifecycle—**in addition** to Turbo’s separate `db:generate` task scheduling.

### CI vs deploy (where schema hits the DB)

See **`docs/stabilization/workflow-inventory-2026-04-27.md`**:

- **`ci.yml`:** **`prisma db push`** (service Postgres), not `migrate deploy`.
- **`deploy-prod.yml`:** **`prisma migrate deploy`** in `apps/api` after generate.

Both differ from local `migrate dev` workflows—facts only.

### `apps/api/tsconfig.json`

- **`include`:** `src/**/*` only; **`exclude`:** `node_modules`, `dist`. No path alias to a generated client under `apps/api` — TypeScript resolves **`@prisma/client`** from **`node_modules`** after **`prisma generate`**.

### `@prisma/client` usage (representative)

- **Imports** appear across **`apps/api/src`** (e.g. `lib/tenant.ts`, controllers, routes, services) and **`apps/api/scripts`** (e2e and test helpers). **`apps/api/prisma/seed.ts`** uses **`PrismaClient`**. Repository grep (`apps/api/**/*.ts`): **~24 TypeScript files** reference **`@prisma/client`** (counts vary if barrel re-exports change). No workspace package other than **`@vex/api`** imports **`@prisma/client`** in this grep pass — **`@vex/shared`** does not generate Prisma types.

### Docker (`deploy/Dockerfile.api`)

- **Build stage:** `pnpm --filter @vex/shared build` → **`pnpm --filter @vex/api run db:generate`** → **`pnpm --filter @vex/api build`** (explicit sequence; **Turbo graph not used** inside this Dockerfile).

### Architectural read (baseline)

Interpretive summary aligned with baseline dry-run evidence (§**Experiment plan** §**C**) — **not** additional primary citations.

- **`db:generate`** currently pulls **dependency workspace `build`** work into what is conceptually a **codegen** task (`prisma generate`).
- **`test:e2e`** depends on **both** **`@vex/api#build`** and **`@vex/api#db:generate`**, so Prisma generation is **separately** represented in the Turbo graph from API **`build`**.
- **`@vex/api` `build`** runs **`prebuild` → `db:generate`**, which suggests **possible duplication** of `prisma generate` relative to Turbo’s standalone **`db:generate`** task.
- **Docker** does not rely on Turbo’s **`db:generate`** graph; the Turbo **`dependsOn`** decision is mostly **local / CI graph hygiene**, not container **runtime** correctness.

### Architectural conclusion _(approved)_

Aligned with §**Experiment plan** §**D** dry-run evidence and maintainer sign-off:

- Removing **`^build`** from **`db:generate`** makes the Turbo graph **more semantically correct** (codegen vs package **`build`**).
- **`turbo run db:generate`** drops from **13** planned tasks to **8** by **not** scheduling unrelated upstream **`build`** tasks.
- **`turbo run build`** dry-run graph is **unchanged** (**8** **`build`** tasks).
- **`turbo run test:e2e --filter=@vex/api`** keeps the **same four tasks**; only **`@vex/api#db:generate`** **internal edges** change (**no** dependency on **`@vex/shared#build`** in the Turbo plan).
- **Docker** is **unaffected** — **`deploy/Dockerfile.api`** already runs **`@vex/shared` build** → **`db:generate`** → **`@vex/api` build** outside Turbo.

**Rationale:**

- **`db:generate`** is **Prisma codegen** from schema, not a workspace **`build`** product.
- **`@vex/api` `build`** already runs **`prebuild` → `db:generate`** before **`tsc`**.
- **`test:e2e`** already depends on **both** **`build`** and **`db:generate`** globally.
- The former **`^build`** edge added **extra work** and **confusing semantics** without demonstrated ordering need; **`@vex/shared#build`** remains enforced via the **`build`** task graph and **`@vex/api#build`** → **`@vex/shared#build`**.

---

## Read-only evidence table

Answers below are **historical audit facts + implications** for the **pre-change** graph (when **`db:generate`** still used **`^build`**). **Current** config is **`dependsOn: []`** — see **Decision** / **Implementation**.

| Question | Evidence | Implication |
|----------|-----------|-------------|
| Why does **`db:generate`** use **`dependsOn: ["^build"]`** today? | **`turbo.json`** defines **`db:generate`** → **`dependsOn: ["^build"]`**. **`@vex/api`** depends on **`@vex/shared`** (`workspace:*`). Per Turbo, **`^build`** means dependency workspaces finish **`build`** before this package’s **`db:generate`** task runs. | Serializes **`@vex/shared` `build`** before the Turbo **`db:generate`** task for **`@vex/api`**. **`prisma generate`** itself does not compile **`@vex/shared`**, so this edge may exist for **ordering conservatism** or history — needs owner confirmation. |
| Does **`prebuild` → `db:generate`** already guarantee client generation before **`tsc`**? | **`apps/api/package.json`:** **`"prebuild": "pnpm run db:generate"`**, **`"build": "tsc"`**. npm/pnpm lifecycle runs **`prebuild`** immediately before **`build`** for that package. | Any **`pnpm --filter @vex/api build`** runs **`prisma generate`**, then **`tsc`**, independent of Turbo’s separate **`db:generate`** task ordering. |
| Is **`prisma generate` invoked redundantly** in common pipelines? | **`scripts/ship-gate.sh`:** runs **`pnpm --filter @vex/api run db:generate`**, then **`pnpm -w turbo run build`** (API **`prebuild`** will run **`db:generate`** again). **`.github/workflows/ci.yml`:** **`db:generate && prisma db push`** before Turbo. **`Dockerfile.api`:** explicit **`db:generate`** before **`api build`** (again invokes **`prebuild`** pattern via **`pnpm … build`**). | **Multiple `prisma generate` runs** per pipeline are plausible (cheap idempotent, but affects wall-clock and cache narrative). |
| Does **`turbo run build`** risk slow / confusing ordering? | **`turbo.json`:** global **`test:e2e`** → **`dependsOn: ["build", "db:generate"]`**. **`build`** → **`dependsOn: ["^build"]`**. **`db:generate`** → **`dependsOn: ["^build"]`**. | Turbo ensures **`db:generate`** and **`build`** both respect upstream **`build`** first; **`test:e2e`** waits on both. Removing **`^build`** from **`db:generate`** would change **parallelism / critical path** — needs simulation before approval. |
| Which surfaces **require** generated **`@prisma/client`**? | Broad **`@prisma/client`** / **`PrismaClient`** imports under **`apps/api/src`** and **`apps/api/scripts`** (grep-backed list in repo). **`apps/api/tsconfig.json`** does not vendor generated types under **`src/`**. | **`tsc`** and runtime **`node dist`** assume **`node_modules/.prisma`** / **`@prisma/client`** matches schema — **`db:generate`** must succeed before a cold **`build`**. |
| Does **`tsconfig`** encode Prisma paths? | **`apps/api/tsconfig.json`:** **`include`:** **`src/**/*`** only. | No alternate generated-client path; standard **`node_modules`** resolution. |
| What does **CI (`ci.yml`)** use for DB ↔ schema? | **`pnpm --filter @vex/api run db:generate && prisma db push`** against service Postgres (`workflow-inventory`, **`ci.yml`** L71–72). | **`db push`** for ephemeral CI DB — aligns with **`docs/plans/2026-04-04-vex-ELITE-DIGITAL-PRESENCE-v1.md`** note on migration ledger vs fresh DB. |
| What does **deploy workflow** use? | **`deploy-prod.yml`:** **`db:generate`** then **`prisma migrate deploy`** (**`apps/api`**). | Production-shaped verification uses **migrate ledger**, not **`db push`**. |
| What does **`ship-gate.sh`** do locally vs CI? | **`ship-gate.sh`:** explicit **`db:generate`**, **`turbo run build`**, **`migrate deploy`** unless **`CI=true`** (then skips migrate; comment explains ledger). | Local pilot gate matches **`migrate deploy`**; mirrors documented **`AGENTS.md`** / **`docs/PILOT_SHIP.md`** references to **`db:generate`**. |
| What does **Docker** rely on? | **`deploy/Dockerfile.api`:** **`@vex/shared` build** → **`@vex/api db:generate`** → **`@vex/api build`**; runner runs **`prisma migrate deploy`** at container start. | Container image build **does not read `turbo.json`** for ordering — explicit Bash/pnpm sequence. Changing Turbo **`db:generate`** **`^build`** does **not** automatically change Docker unless Dockerfile is edited separately. |
| What **docs/scripts** reference **`db:generate`**? | **`README.md`**, **`AGENTS.md`**, **`docs/PILOT_SHIP.md`**, **`scripts/ship-gate.sh`**, **`docs/plans/*`** (multiple), **`workflow-inventory`**. | Documentation and gates assume **`pnpm --filter @vex/api run db:generate`** remains a supported entrypoint. |
| How dense is **`@prisma/client`** usage in **`@vex/api`**? | ~**24** `apps/api/**/*.ts` files reference **`@prisma/client`** (audit grep); **`package.json`** lists **`@prisma/client`** dependency. | **`tsc`** must resolve generated types; **`test:e2e`** scripts import **`PrismaClient`** directly — DB-backed tests assume **`db:generate`** ran before **`test:e2e`** Turbo task. |
| If **`^build`** were **removed** from **`db:generate`**, what might break? | **Resolved:** §**Experiment plan** §**D** + implementation; **`prisma generate`** does not require **`@vex/shared`** **`dist`**; **`@vex/api#build`** retains **`@vex/shared#build`** via **`build`**. | Hypothesis validated; graph change **Approved**. |

---

## Audit questions — mapped

The numbered questions from the prior draft are addressed by the **evidence table** rows above; update this memo if new evidence appears.

---

## Options to evaluate _(historical)_

The matrix below records **option 2** as **Approved** and implemented; rows **1**, **3**, **4** were not selected.

## Options Considered — scoring matrix

| Option | CI impact | Local dev impact | Docker impact | Turbo cache / graph impact |
|--------|-----------|------------------|---------------|----------------------------|
| **1** Keep **`dependsOn: ["^build"]`** on **`db:generate`** | Not selected. | Not selected. | Not selected. | Not selected. |
| **2** Remove **`^build`** from **`db:generate`** only (**Approved**) | Workflows keep explicit **`db:generate`** where needed; **`turbo run db:generate`** no longer pulls unrelated **`build`** tasks. | Clearer separation: codegen vs **`build`**; fewer tasks on codegen-only Turbo runs. | **No change** — Dockerfile ordering unchanged. | **`db:generate`** dry-run **8** tasks; **`build`** dry-run **8** tasks; **`test:e2e`** `@vex/api` **4** tasks with **`@vex/api#db:generate`** **`dependencies`**: **`[]`** (see §**D**). |
| **3** Generation primarily via **`prebuild`** + Turbo graph cleanup | Not selected. | Not selected. | Not selected. | Not selected. |
| **4** Root / workspace **setup** task + cleaner **`build`** graph | Not selected. | Not selected. | Not selected. | Not selected. |

---

## Experiment plan — Turbo graph (baseline + hypothesis history)

**Implemented:** **`turbo.json`** **`db:generate.dependsOn`** is **`[]`** — matches §**D** hypothesis graph.

### A. Baseline dry-run (no approval required)

These commands **do not modify** `turbo.json` or the repo; they print a JSON plan (first line may be a **`turbo`** banner; strip it before piping to **`jq`** if needed).

```bash
pnpm exec turbo run db:generate --dry-run=json
pnpm exec turbo run build --dry-run=json
pnpm exec turbo run test:e2e --filter=@vex/api --dry-run=json
```

Optional: capture for diffing later — `tee docs/stabilization/evidence/turbo-dry-run-<task>-<date>.json` (gitignore or committed evidence — team choice).

### B. Hypothesis dry-run — remove `^build` from **`db:generate`** _(historical guarded workflow)_

**Superseded by merge:** The approved **`turbo.json`** change matches the hypothesis below. This subsection documents the **pre-merge** temporary-patch process only.

`turbo.json` was **protected**. Patches required **explicit approval**.

**Temporary patch workflow** (only after approval):

1. **Save current state:** `git diff turbo.json` (or copy **`turbo.json`** to a temp path).
2. **Apply** a **local-only** edit: set **`db:generate`** → **`dependsOn`** to **`[]`** or remove **`^build`** per the experiment design.
3. **Run** the same three **`--dry-run=json`** commands as in §A; capture stdout.
4. **Restore** `turbo.json` exactly: e.g. **`git checkout -- turbo.json`** or **`git restore turbo.json`**, or reverse the patch — verify **`git diff turbo.json`** is empty.
5. **Report** in this memo under **§D Hypothesis results** (task counts, **`@vex/api#db:generate`** **`dependencies`** array, **`@vex/api#test:e2e`** edges). Do not commit the patched file.
6. **Confirm** no stray **`turbo.json`** changes: **`git status`** clean for that path.

### C. Baseline results _(captured 2026-04-27, agent env; re-run after graph changes)_

| Command | Turbo | Exit | Notes |
|---------|-------|------|--------|
| **`pnpm exec turbo run db:generate --dry-run=json`** | **2.9.6** | **0** | **13** planned tasks: mixes upstream **`build`** and **`db:generate`** workspaces (e.g. **`@vex/shared#build`** plus multiple **`#db:generate`**). Task **`@vex/api#db:generate`** resolves **`dependsOn`: `["^build"]`** and lists **`dependencies`: `["@vex/shared#build"]`**. |
| **`pnpm exec turbo run build --dry-run=json`** | **2.9.6** | **0** | **8** **`build`** tasks across **`@vex/*`** workspaces (full monorepo **`build`** graph). |
| **`pnpm exec turbo run test:e2e --filter=@vex/api --dry-run=json`** | **2.9.6** | **0** | **4** tasks: **`@vex/shared#build`** → **`@vex/api#build`** and **`@vex/api#db:generate`** (each depends only on **`@vex/shared#build`**; no direct edge between them) → **`@vex/api#test:e2e`** with **`dependencies`: `["@vex/api#build", "@vex/api#db:generate"]`**. |

### D. Hypothesis results _(completed 2026-04-27 — matches **implemented** graph)_

**Temporary experiment:** Maintainer approval was for **dry-runs only** (patch then reverted); same graph was later **Approved** for **`turbo.json`**.

**Permanent:** **`turbo.json`** now keeps **`dependsOn: []`** for **`db:generate`** — the diff below is the **canonical** change.

#### Diff _(same as implementation)_

```diff
diff --git a/turbo.json b/turbo.json
index 23f40bd..8225b88 100644
--- a/turbo.json
+++ b/turbo.json
@@ -64,9 +64,7 @@
       ]
     },
     "db:generate": {
-      "dependsOn": [
-        "^build"
-      ],
+      "dependsOn": [],
       "outputs": [
         ".prisma/**"
       ],
```

#### Dry-run comparison vs §C baseline (Turbo **2.9.6**, exit **0** for all three commands)

| Command | §C baseline | Hypothesis (`dependsOn`: **`[]`**) | Delta |
|---------|-------------|--------------------------------------|--------|
| **`pnpm exec turbo run db:generate --dry-run=json`** | **13** tasks (upstream **`build`** + **`db:generate`** mixed) | **8** tasks (**only** **`#db:generate`** per workspace) | **−5** tasks — **`db:generate`** no longer expands **`^build`**; no **`@vex/*#build`** nodes in this plan. |
| **`pnpm exec turbo run build --dry-run=json`** | **8** **`build`** tasks | **8** **`build`** tasks | **No change** — **`build`** task definition untouched. |
| **`pnpm exec turbo run test:e2e --filter=@vex/api --dry-run=json`** | **4** tasks | **4** tasks | **Same shape**; **edge change** on **`@vex/api#db:generate`** (see below). |

#### Task / dependency delta (material)

**`turbo run db:generate`:** **`@vex/api#db:generate`**

| Field | Baseline (§C) | Hypothesis |
|-------|----------------|------------|
| **`resolvedTaskDefinition.dependsOn`** | **`["^build"]`** | **`[]`** |
| **`dependencies`** | **`["@vex/shared#build"]`** | **`[]`** |

**`turbo run test:e2e --filter=@vex/api`:**

| Task | Baseline **`dependencies`** | Hypothesis **`dependencies`** |
|------|-----------------------------|------------------------------|
| **`@vex/api#build`** | **`["@vex/shared#build"]`** | unchanged |
| **`@vex/api#db:generate`** | **`["@vex/shared#build"]`** | **`[]`** |
| **`@vex/api#test:e2e`** | **`["@vex/api#build", "@vex/api#db:generate"]`** | unchanged |

#### Implications _(interpretation; see **Architectural read**)_

- **`db:generate`** as a standalone Turbo invocation becomes a **pure codegen** plan (8 **`#db:generate`** tasks only), without pulling dependency **`build`** tasks forward.
- **`test:e2e`** still waits on **`build`** and **`db:generate`** for **`@vex/api`**, but **`@vex/api#db:generate`** no longer sits **behind** **`@vex/shared#build`** in the Turbo graph — it can schedule **without** that edge. **`prisma generate`** does not consume **`@vex/shared`** **`dist`**; **`@vex/api#build`** still depends on **`@vex/shared#build`** via **`build`**’s **`^build`**, so **TypeScript compile order** for the API remains gated on shared build where required.
- **`npm`/`pnpm` `prebuild`** on **`@vex/api` `build`** is unchanged by this experiment (not modeled in dry-run JSON).

#### Rollback confirmation _(experiment only)_

- During §**B**, **`turbo.json`** was restored after dry-runs (**`git checkout -- turbo.json`**).
- **`git diff -- turbo.json`** was empty before the **final Approved** implementation landed.

---

### E. Next decision point — temporary graph experiment _(closed)_

Superseded by **Approved** **`turbo.json`** implementation ( **`db:generate.dependsOn`**: **`[]`** ).

## Decision

**Approved:** Remove **`^build`** from Turbo task **`db:generate`** — set **`tasks.db:generate.dependsOn`** to **`[]`** in **`turbo.json`**.

This matches **option 2**, §**Experiment plan** §**D** evidence, and **Architectural conclusion**. **`@vex/shared#build`** ordering for consumers remains enforced via the **`build`** task **`^build`** edges and **`@vex/api#build`**.

**Not in scope for this memo:** Full **`test:e2e`** execution was not required for validation (owner policy).

---

## Implementation

| Artifact | Change |
|----------|--------|
| **`turbo.json`** | **`tasks.db:generate.dependsOn`:** **`["^build"]`** → **`[]`** |

---

## Non-Goals _(updated)_

- **No further `turbo.json` edits** for **`db:generate`** without a new decision memo or amendment (if graph policy changes again).
- **Temporary local patches** to protected config still require **explicit approval** (guardrail for future experiments).
- This approval **does not** change **`deploy/Dockerfile.api`**, workflows, **`apps/api`** **`prebuild`**, or Prisma schema — only Turbo **task graph** semantics for **`db:generate`**.

## Rollout

### CI

No workflow edits were required; CI already invokes **`db:generate`** explicitly where needed.

### Local

Developers running **`pnpm exec turbo run db:generate`** see **8** codegen tasks instead of **13** (no unrelated **`build`** expansion).

### Docs

This memo is the reference; optional cross-links from **`PROJECT_SPACE`** / roadmap at maintainer discretion.

## Risks

- **Turbo cache:** task hashes for **`db:generate`** change vs prior graph — expect cache **miss** on first runs after merge; stabilize thereafter.
- **Ordering:** **`@vex/api#db:generate`** may schedule **without** waiting on **`@vex/shared#build`** in Turbo; **`prisma generate`** does not require **`@vex/shared`** **`dist`** — **`@vex/api#build`** still waits on **`@vex/shared#build`**.

## Validation

Post-implementation checks (2026-04-27, agent env; Turbo **2.9.6**):

| Step | Command | Result |
|------|---------|--------|
| Dry-run | **`pnpm exec turbo run db:generate --dry-run=json`** | Exit **0**; **8** tasks; **`@vex/api#db:generate`** **`dependencies`**: **`[]`** |
| Dry-run | **`pnpm exec turbo run build --dry-run=json`** | Exit **0**; **8** **`build`** tasks |
| Dry-run | **`pnpm exec turbo run test:e2e --filter=@vex/api --dry-run=json`** | Exit **0**; **4** tasks |
| Real | **`pnpm --filter @vex/api run db:generate`** | Exit **0** (`prisma generate` OK) |
| Real | **`pnpm --filter @vex/api run build`** | Exit **0** (`prebuild` + **`tsc`**) |
| Diff | **`git diff --check`** | Exit **0** (no whitespace errors on **`turbo.json`** diff) |
| Workspace | **`pnpm -w turbo run build`** | Exit **0** (8 packages built) |

Full **`pnpm --filter @vex/api run test:e2e`** / ship-level E2E **not** run per owner instruction.

## Follow-Up

- Optional CI dry-run spot-check on PRs if Turbo version bumps.
- Update **`docs/stabilization/workflow-inventory`** only if CI DB steps change independently.

## References

- Inventory: `docs/stabilization/workflow-inventory-2026-04-27.md`
- Graph: `turbo.json`
- API scripts: `apps/api/package.json`
- API TS config: `apps/api/tsconfig.json`
- Docker API image: `deploy/Dockerfile.api`
- Gate script: `scripts/ship-gate.sh`
- CI / deploy: `.github/workflows/ci.yml`, `.github/workflows/deploy-prod.yml`
