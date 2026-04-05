/**
 * Exercises `fortellis-inventory-sync` job handler with mocked `fetch` (no Redis, no live Fortellis).
 * Verifies ExternalSync + IntegrationLog writes remain tenant-scoped.
 */
import { systemPrisma } from "../src/lib/tenant.js";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const originalFetch = globalThis.fetch;

async function main() {
  const suffix = Date.now();
  const tenant = await systemPrisma.tenant.create({
    data: { name: `e2e-fortellis-job-${suffix}` },
  });
  const externalId = `vin-${suffix}`;
  const payload = { stockNumber: "E2E-STOCK" };

  process.env.FORTELLIS_TOKEN_URL = "https://fortellis-mock.test/oauth/token";
  process.env.FORTELLIS_CLIENT_ID = "e2e-client";
  process.env.FORTELLIS_CLIENT_SECRET = "e2e-secret";
  process.env.FORTELLIS_SUBSCRIPTION_ID = "e2e-subscription";
  process.env.FORTELLIS_API_BASE_URL = "https://fortellis-mock.test/api";

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.includes("/oauth/token")) {
      return new Response(JSON.stringify({ access_token: "mock-access-token", expires_in: 3600 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("/cdkdrive/inventory") || url.includes("/vehicles")) {
      return new Response(JSON.stringify({ accepted: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(`unexpected fetch URL: ${url}`, { status: 500 });
  };

  const { resetFortellisOAuthCacheForTests } = await import("../src/lib/fortellis.js");
  resetFortellisOAuthCacheForTests();
  const { runQueuedJobHandlerForTests } = await import("../src/lib/queue.js");

  await runQueuedJobHandlerForTests({
    name: "fortellis-inventory-sync",
    data: {
      tenantId: tenant.id,
      externalId,
      vin: externalId,
      payload,
    },
  });

  globalThis.fetch = originalFetch;
  resetFortellisOAuthCacheForTests();

  const externalSync = await systemPrisma.externalSync.findFirst({
    where: { tenantId: tenant.id, externalId, entityType: "vehicle" },
  });
  assert(externalSync?.status === "SUCCESS", "E2E FAILED: ExternalSync not SUCCESS");
  assert(
    (externalSync.payload as Record<string, unknown>)?.stockNumber === "E2E-STOCK",
    "E2E FAILED: ExternalSync payload mismatch"
  );

  const processedLog = await systemPrisma.integrationLog.findFirst({
    where: {
      tenantId: tenant.id,
      externalId,
      eventType: "inventory.sync",
      status: "PROCESSED",
    },
  });
  assert(processedLog, "E2E FAILED: missing PROCESSED inventory.sync IntegrationLog");

  await systemPrisma.integrationLog.deleteMany({ where: { tenantId: tenant.id } });
  await systemPrisma.externalSync.deleteMany({ where: { tenantId: tenant.id } });
  await systemPrisma.tenant.deleteMany({ where: { id: tenant.id } });

  console.log("e2e-fortellis-integration-job: OK");
}

main()
  .catch((error) => {
    console.error(error);
    globalThis.fetch = originalFetch;
    process.exit(1);
  })
  .finally(() => systemPrisma.$disconnect());
