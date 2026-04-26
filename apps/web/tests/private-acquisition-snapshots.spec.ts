import { expect, test } from "@playwright/test";

test("private acquisition visual snapshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/private-acquisition");
  await page.goto("/private-acquisition?step=intro");
  await expect(page.getByTestId("acq-intro-step")).toBeVisible();
  await expect(page).toHaveScreenshot("private-acquisition-intro-desktop.png", { fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot("private-acquisition-intro-tablet.png", { fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page).toHaveScreenshot("private-acquisition-intro-mobile.png", { fullPage: true });

  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.getByTestId("acq-begin-consultation").click();
  await page.locator("[data-testid='acq-step-basics'] input").nth(0).fill("Casey Quinn");
  await page.locator("[data-testid='acq-step-basics'] input").nth(1).fill("casey@example.com");
  await page.locator("[data-testid='acq-step-basics'] input").nth(3).fill("Austin");
  await page.getByTestId("acq-next").click();
  await page.getByTestId("acq-next").click();
  await page.getByTestId("acq-next").click();
  await page.getByTestId("acq-next").click();
  await expect(page.getByTestId("acq-review-step")).toHaveScreenshot("private-acquisition-review-step.png");
  await page.getByTestId("acq-generate-report").click();
  await page.waitForURL("**/private-acquisition/report-preview", { timeout: 10000 });
  await expect(page.getByTestId("acq-report-preview")).toHaveScreenshot("private-acquisition-report-desktop.png", { fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(700);
  await expect(page.getByTestId("acq-report-preview")).toHaveScreenshot("private-acquisition-report-tablet.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.06,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId("acq-report-preview")).toHaveScreenshot("private-acquisition-report-mobile.png", { fullPage: true });
});
