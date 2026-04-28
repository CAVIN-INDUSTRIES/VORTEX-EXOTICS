#!/usr/bin/env node
/**
 * Detection-only: if apps/web/.next/lock exists, print remediation and exit 1.
 * Does not delete .next, the lock, or any cache. See decision memo: next-build-lock-policy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = path.join(root, "apps", "web", ".next", "lock");

if (fs.existsSync(lockPath)) {
  console.error(
    [
      "web:lock:check: apps/web/.next/lock exists.",
      "Another Next.js process may be running, or a previous build exited uncleanly.",
      "Ensure no other `next dev` / `next build` is using this worktree, then remove the lock manually if safe, for example:",
      `  rm -f ${lockPath}`,
      "Do not delete all of .next/ unless you intend a full clean (separate from this guardrail).",
    ].join("\n"),
  );
  process.exit(1);
}

console.log("web:lock:check: OK (no apps/web/.next/lock)");
process.exit(0);
