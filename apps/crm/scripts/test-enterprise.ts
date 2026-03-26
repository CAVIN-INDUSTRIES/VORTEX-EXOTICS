import { access } from "node:fs/promises";

async function main() {
  await access("src/app/(staff)/appraisals/offline/page.tsx");
  console.log("enterprise crm test: offline route available");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
