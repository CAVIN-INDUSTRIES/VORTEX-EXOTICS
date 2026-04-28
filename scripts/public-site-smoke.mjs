#!/usr/bin/env node

const siteUrl = (process.env.PUBLIC_SITE_URL || "").trim();
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
const tenantId = (process.env.PUBLIC_SMOKE_TENANT_ID || "").trim();
const skipWrite = process.env.PUBLIC_SMOKE_SKIP_WRITE === "1";

if (!siteUrl) {
  console.error("Missing PUBLIC_SITE_URL");
  process.exit(1);
}

if (!apiUrl) {
  console.error("Missing NEXT_PUBLIC_API_URL");
  process.exit(1);
}

if (!tenantId) {
  console.error("Missing PUBLIC_SMOKE_TENANT_ID");
  process.exit(1);
}

const requiredRoutes = [
  "/",
  "/inventory",
  "/contact",
  "/appraisal",
  "/pricing",
];

const forbiddenText = [
  "Not configured",
  "Phone on request",
  "Email on request",
  "Set NEXT_PUBLIC_CONTACT_PHONE in production",
  "Set NEXT_PUBLIC_CONTACT_EMAIL in production",
];

async function assertRoute(route) {
  const res = await fetch(`${siteUrl}${route}`);
  if (!res.ok) throw new Error(`${route} returned ${res.status}`);
  const html = await res.text();
  for (const token of forbiddenText) {
    if (html.includes(token)) {
      throw new Error(`${route} contains placeholder text: "${token}"`);
    }
  }
}

async function assertLeadIntake() {
  const email = `public-smoke-${Date.now()}@example.com`;
  const payload = {
    source: "PUBLIC_SMOKE",
    email,
    notes: "Automated public smoke check",
  };
  const res = await fetch(`${apiUrl}/public/leads?tenantId=${encodeURIComponent(tenantId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`public leads failed (${res.status}): ${body}`);
  }
}

async function main() {
  for (const route of requiredRoutes) {
    await assertRoute(route);
    console.log(`ok route ${route}`);
  }
  if (!skipWrite) {
    await assertLeadIntake();
    console.log("ok public lead intake");
  } else {
    console.log("skipped public lead intake write");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
