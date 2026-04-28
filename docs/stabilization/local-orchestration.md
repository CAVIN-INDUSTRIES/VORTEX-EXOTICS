# Local orchestration and env contract

How shell entrypoints load env vs how `scripts/env-contract.mjs` reads files for validation.

## Commands (from repo root)

| Command | What runs | Env loading in shell |
|---------|-----------|----------------------|
| `pnpm run dev:api` | `pnpm --filter @vex/api dev` | API loads its own env (dotenv / `check-env` in that package). Not governed by root shell scripts. |
| `pnpm run dev:web` | `pnpm --filter @vex/web dev` | Next loads `apps/web/.env.local` (and env files Next supports). |
| `pnpm run dev:crm` | `pnpm --filter @vex/crm dev` | Next loads `apps/crm/.env.local` as applicable. |
| `pnpm run env:check:local` | `node scripts/env-contract.mjs local` | Reads **from disk only** (merged with `process.env`): API `apps/api/.env.local` + `apps/api/.env`; web `apps/web/.env.local`; CRM `apps/crm/.env.local`. Does not `source` files into your current shell. |
| `pnpm run env:check:ci` | `… ci` | Uses `process.env` (e.g. CI step `env:` block). |
| `pnpm run env:check:production` | `… production` | Uses `process.env` for all required keys. |
| `pnpm run ship:gate` | `bash scripts/ship-gate.sh` | **Sources** `apps/api/.env.local` then `apps/api/.env` (in order), `unset NODE_ENV`, then `pnpm run env:check:local`, then Prisma generate, turbo build, etc. |
| `pnpm run verify:ship` | `bash scripts/verify-ship-local.sh` | **Sources only** `apps/api/.env.local` (not `apps/api/.env`), then `env:check:local`, `DATABASE_URL` check, turbo build, API e2e, `ship:gate`. |

## Intentional asymmetry (approved)

- **`ship-gate.sh`** sources two API files; **`verify-ship-local.sh`** sources only `apps/api/.env.local`. This is **intentional** until a follow-on decision. Widening what gets `source`d into the shell needs security review.
- `env:check:local` always reads the API pair **from disk** for validation, so you can pass the contract even if your interactive shell has not sourced `.env` — as long as the files on disk exist and contain the required keys.

## Relationship to `DATABASE_URL` for build/e2e

- Scripts that `source` API env may export `DATABASE_URL` for subsequent `pnpm` processes.
- If only `.env` (not `.env.local`) holds `DATABASE_URL`, **`verify:ship` may not export it to the shell**; **`ship-gate` will** if that file is present. Align your file layout with how you run gates.

## Next.js production build concurrency (operational)

**Symptom:** **`pnpm -w turbo run build`** appears to hang during **`@vex/web`** **`next build`**, or fails with **“Another next build process is already running”**, and **`apps/web/.next/lock`** appears.

**Cause:** Two **`next build`** processes for **`apps/web`** (for example a background **`pnpm --filter @vex/web run build`** plus Turbo) contend for the same **`.next`** directory.

**Triage:**

1. `ps -eo pid,etime,cmd | rg 'next/dist/bin/next build|pnpm --filter @vex/web'` — stop stray trees.
2. `rm -f apps/web/.next/lock` only **after** confirming no live **`next build`** (repo policy: lock file is a **signal**, not the root fix).
3. Run **one** full gate: **`pnpm -w turbo run build`**, then **`pnpm run web:lock:check`**.

This is **orchestration**, not a source defect. See [Next lock policy memo](decisions/2026-04-27-next-build-lock-policy.md).

## Related

- Decision memo: `docs/stabilization/decisions/2026-04-27-local-orchestration-env-alignment.md`
- Env contract script: `scripts/env-contract.mjs`
- **`PUBLIC_WEB_URL`** production contract: `docs/stabilization/decisions/2026-04-27-production-public-web-url-env-contract.md`
