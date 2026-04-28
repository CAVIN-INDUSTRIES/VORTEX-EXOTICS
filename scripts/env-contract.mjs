#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(new URL("..", import.meta.url).pathname);

const contracts = {
  local: {
    description: "Local developer runtime contract",
    envFiles: {
      api: ["apps/api/.env.local", "apps/api/.env"],
      web: ["apps/web/.env.local"],
      crm: ["apps/crm/.env.local"],
    },
    required: {
      api: ["DATABASE_URL", "JWT_SECRET"],
      web: ["NEXT_PUBLIC_API_URL"],
      crm: [],
    },
    rules: {
      forbidProductionSkip: false,
      requireStrictCors: false,
    },
  },
  ci: {
    description: "CI runtime contract",
    envFiles: {
      api: [],
      web: [],
      crm: [],
    },
    required: {
      api: ["DATABASE_URL", "DIRECT_DATABASE_URL", "JWT_SECRET"],
      web: [],
      crm: [],
    },
    rules: {
      forbidProductionSkip: false,
      requireStrictCors: false,
    },
  },
  production: {
    description: "Production runtime contract",
    envFiles: {
      api: [],
      web: [],
      crm: [],
    },
    required: {
      api: [
        "DATABASE_URL",
        "DIRECT_DATABASE_URL",
        "JWT_SECRET",
        "REDIS_URL",
        "CORS_ORIGIN",
        "PUBLIC_WEB_URL",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "EDMUNDS_API_KEY",
        "EDMUNDS_SECRET",
        "MARKETCHECK_API_KEY",
      ],
      web: ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_API_URL"],
      crm: ["NEXT_PUBLIC_API_URL"],
    },
    rules: {
      forbidProductionSkip: true,
      requireStrictCors: true,
    },
  },
};

const shellLintFiles = [
  "apps/api/.env",
  "apps/api/.env.local",
  "apps/api/.env.example",
  "apps/api/.env.production.example",
  "apps/web/.env.local",
  "apps/web/.env.local.example",
  "apps/web/.env.production.example",
  "apps/crm/.env.local",
  "apps/crm/.env.example",
  "apps/crm/.env.production.example",
  "deploy/.env",
  "deploy/.env.example",
];

function readEnvFile(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) return { values: {}, present: false };
  const values = {};
  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const raw = line.slice(eq + 1).trim();
    values[key] = unquote(raw);
  }
  return { values, present: true };
}

function unquote(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === `"` && last === `"`) || (first === `'` && last === `'`)) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function mergeEnv(files) {
  const merged = {};
  const loaded = [];
  for (const file of files) {
    const parsed = readEnvFile(file);
    if (!parsed.present) continue;
    Object.assign(merged, parsed.values);
    loaded.push(file);
  }
  return { values: { ...merged, ...process.env }, loaded };
}

function isMissing(env, key) {
  return !String(env[key] ?? "").trim();
}

function lintShellSafety() {
  const errors = [];
  for (const file of shellLintFiles) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = line.indexOf("=");
      if (eq <= 0) return;
      const key = line.slice(0, eq).trim();
      const raw = line.slice(eq + 1).trim();
      if (!raw) return;
      const quoted =
        (raw.startsWith(`"`) && raw.endsWith(`"`)) ||
        (raw.startsWith(`'`) && raw.endsWith(`'`));
      if (quoted) return;
      if (/[\s()#&;|<>`$]/.test(raw)) {
        errors.push(`${file}:${index + 1} ${key} contains shell-sensitive characters and must be quoted`);
      }
    });
  }
  return errors;
}

function validateTarget(targetName) {
  const contract = contracts[targetName];
  if (!contract) {
    const valid = Object.keys(contracts).join(", ");
    throw new Error(`Unknown env contract "${targetName}". Valid targets: ${valid}`);
  }

  const errors = [];
  const loadedByApp = {};
  const envByApp = {};

  for (const app of Object.keys(contract.required)) {
    const loaded = mergeEnv(contract.envFiles[app] ?? []);
    envByApp[app] = loaded.values;
    loadedByApp[app] = loaded.loaded;

    for (const key of contract.required[app]) {
      if (isMissing(loaded.values, key)) {
        errors.push(`${targetName}:${app} missing required env ${key}`);
      }
    }
  }

  const apiEnv = envByApp.api ?? process.env;
  if (contract.rules.requireStrictCors) {
    const cors = String(apiEnv.CORS_ORIGIN ?? "").trim();
    if (!cors || cors === "*") {
      errors.push(`${targetName}:api CORS_ORIGIN must be set and cannot be "*"`);
    }
  }

  if (contract.rules.forbidProductionSkip) {
    const skip = String(apiEnv.SKIP_VALUATION_ENV_CHECK ?? "").trim().toLowerCase();
    if (skip === "1" || skip === "true") {
      errors.push(`${targetName}:api SKIP_VALUATION_ENV_CHECK is forbidden`);
    }
  }

  const nodeEnv = String(process.env.NODE_ENV ?? "").trim();
  if (nodeEnv && !["development", "test", "production"].includes(nodeEnv)) {
    errors.push(`process NODE_ENV has unsupported value "${nodeEnv}"`);
  }

  return { errors, loadedByApp };
}

function printResult(targetName, result, shellErrors) {
  console.log(`env-contract: ${targetName} (${contracts[targetName].description})`);
  for (const [app, files] of Object.entries(result.loadedByApp)) {
    const loaded = files.length > 0 ? files.join(", ") : "process env only";
    console.log(`  ${app}: ${loaded}`);
  }
  if (shellErrors.length === 0 && result.errors.length === 0) {
    console.log("env-contract: OK");
    return;
  }
  for (const error of [...shellErrors, ...result.errors]) {
    console.error(`env-contract: ${error}`);
  }
}

const target = process.argv[2] ?? "local";
const shellErrors = lintShellSafety();
const result = validateTarget(target);
printResult(target, result, shellErrors);

if (shellErrors.length > 0 || result.errors.length > 0) {
  process.exit(1);
}
