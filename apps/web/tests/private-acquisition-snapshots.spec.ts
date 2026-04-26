import { expect, test } from "@playwright/test";

test("private acquisition visual snapshots", async ({ page }) => {
  await page.goto("/private-acquisition");
  await expect(page).toHaveScreenshot("private-acquisition-intro-desktop.png", { fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page).toHaveScreenshot("private-acquisition-intro-mobile.png", { fullPage: true });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByLabel("Name").fill("Casey Quinn");
  await page.getByLabel("Email").fill("casey@example.com");
  await page.getByLabel("Location").fill("Austin");
  await page.getByTestId("acq-review-button").click();
  await expect(page.getByTestId("acq-review-step")).toHaveScreenshot("private-acquisition-review-step.png");
  await page.getByTestId("acq-generate-report").click();
  await page.waitForURL("**/private-acquisition/report-preview", { timeout: 10000 });
  await expect(page.getByTestId("acq-report-preview")).toHaveScreenshot("private-acquisition-report-desktop.png", { fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId("acq-report-preview")).toHaveScreenshot("private-acquisition-report-mobile.png", { fullPage: true });
});
