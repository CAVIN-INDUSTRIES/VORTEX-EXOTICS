import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { app } from "../src/app.js";

const prisma = new PrismaClient();

async function main() {
  const jwtSecret = process.env.JWT_SECRET || "test-secret";
  process.env.JWT_SECRET = jwtSecret;

  const suffix = Date.now();
  const tenant = await prisma.tenant.create({
    data: {
      name: `e2e-eu-${suffix}`,
      region: "EU",
      dataResidency: "EU",
      currency: "EUR",
      locale: "en-GB",
    },
  });

  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: `e2e-eu-admin-${suffix}@example.com`,
      passwordHash: "test-hash",
      role: "ADMIN",
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: tenant.id,
    },
    jwtSecret,
    { expiresIn: "15m" }
  );

  const server = app.listen(0, "127.0.0.1");
  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Failed to start local test server");
    }
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const blocked = await fetch(`${baseUrl}/compliance/export`, {
      headers: {
        authorization: `Bearer ${token}`,
        "x-vex-region": "US",
      },
    });
    if (blocked.status !== 403) {
      throw new Error(`Expected residency block 403, got ${blocked.status}`);
    }

    const allowed = await fetch(`${baseUrl}/compliance/export`, {
      headers: {
        authorization: `Bearer ${token}`,
        "x-vex-region": "US",
        "x-cross-region-consent": "true",
      },
    });
    if (allowed.status !== 200) {
      throw new Error(`Expected consent override 200, got ${allowed.status}`);
    }

    console.log("e2e-tenant-residency: OK");
  } finally {
    server.close();
    await prisma.auditLog.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.user.deleteMany({ where: { id: user.id } });
    await prisma.tenant.deleteMany({ where: { id: tenant.id } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
