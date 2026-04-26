import { expect, test } from "@playwright/test";

test.describe("private acquisition flow", () => {
  test("wizard navigation, persistence, and report generation", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.addInitScript(() => {
      window.localStorage.removeItem("vex.privateAcquisition.profile");
      window.sessionStorage.removeItem("vex.privateAcquisition.report");
    });
    await page.goto("/private-acquisition?step=intro");
    await expect(page.getByTestId("private-acquisition-root")).toBeVisible();

    await page.getByTestId("acq-begin-consultation").click();
    await expect(page.getByTestId("acq-step-basics")).toBeVisible();

    const basicsStep = page.getByTestId("acq-step-basics");
    await basicsStep.getByLabel("Name").fill("Morgan Vale");
    await basicsStep.getByLabel("Email").fill("morgan@example.com");
    await basicsStep.getByLabel("Location").fill("Miami");

    await page.getByTestId("acq-next").click();
    const budgetStep = page.getByTestId("acq-step-budget");
    await expect(budgetStep).toBeVisible();
    await budgetStep.getByLabel("Budget Maximum").fill("125000");
    await expect(budgetStep.getByLabel("Budget Maximum")).toHaveValue("125000");

    await page.reload();
    await expect(page.getByTestId("acq-step-budget")).toBeVisible();
    await expect(page.getByTestId("acq-step-budget").getByLabel("Budget Maximum")).toHaveValue("120000");

    await page.getByTestId("acq-next").click();
    await expect(page.getByTestId("acq-step-ownership")).toBeVisible();
    await page.getByTestId("acq-next").click();
    await expect(page.getByTestId("acq-step-intent")).toBeVisible();
    await page.getByTestId("acq-next").click();
    await expect(page.getByTestId("acq-review-step")).toBeVisible();

    await page.getByTestId("acq-previous").click();
    await expect(page.getByTestId("acq-step-intent")).toBeVisible();
    await page.getByTestId("acq-next").click();

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
