#!/usr/bin/env node
/**
 * Fails if the current Node major does not match the repo contract (root `.node-version` or `package.json` engines).
 * Intended to run in CI after actions/setup-node and before pnpm install.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readExpectedMajor() {
  const nodeVersionFile = path.join(root, ".node-version");
  if (fs.existsSync(nodeVersionFile)) {
    const first = (fs.readFileSync(nodeVersionFile, "utf8").split(/\r?\n/)[0] ?? "").trim();
    const m = /^v?(\d+)/.exec(first);
    if (m) return Number(m[1], 10);
  }
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const eng = pkg.engines?.node;
  if (typeof eng === "string") {
    const ge = />=\s*(\d+)/.exec(eng);
    if (ge) return Number(ge[1], 10);
    const lead = /^(\d+)/.exec(eng);
    if (lead) return Number(lead[1], 10);
  }
  console.error("assert-node-version: could not read expected major from .node-version or package.json engines.node");
  process.exit(1);
}

const expectedMajor = readExpectedMajor();
const actualMajor = Number(process.versions.node.split(".")[0], 10);

if (actualMajor !== expectedMajor) {
  console.error(
    `assert-node-version: expected Node major ${expectedMajor} (per .node-version / engines), got ${process.version} (major ${actualMajor}).\n` +
      "  Use Node 22 (e.g. nvm use / fnm / .node-version at repo root).",
  );
  process.exit(1);
}

console.log(`assert-node-version: OK ${process.version} (major ${actualMajor}, expected ${expectedMajor})`);
