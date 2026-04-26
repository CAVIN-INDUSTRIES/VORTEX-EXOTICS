import { expect, test } from "@playwright/test";

test.describe("private acquisition flow", () => {
  test("wizard to report preview renders core sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/private-acquisition");
    await expect(page.getByTestId("private-acquisition-root")).toBeVisible();

    await page.getByLabel("Name").fill("Morgan Vale");
    await page.getByLabel("Email").fill("morgan@example.com");
    await page.getByLabel("Location").fill("Miami");

    await page.getByTestId("acq-review-button").click();
    await expect(page.getByTestId("acq-review-step")).toBeVisible();

    await page.getByTestId("acq-generate-report").click();
    await expect(page.getByTestId("acq-processing")).toBeVisible();
    await page.waitForURL("**/private-acquisition/report-preview", { timeout: 10000 });

    await expect(page.getByTestId("acq-report-preview")).toBeVisible();
    await expect(page.getByTestId("acq-financial-section")).toBeVisible();
    await expect(page.getByTestId("acq-comparison-section")).toBeVisible();
    await expect(page.getByTestId("acq-submit-lead")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("mobile viewport renders report", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/private-acquisition/report-preview");
    await expect(page.getByTestId("acq-report-preview")).toBeVisible();
    await context.close();
  });
});
