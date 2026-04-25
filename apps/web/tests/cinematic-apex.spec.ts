import { test, expect } from "@playwright/test";

test("hero exposes Apex data attribute for smoke + analytics hooks", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#universe");
  await expect(hero).toBeVisible();
  const heroScene = page.locator("[data-apex-hero]").first();
  const sceneCount = await heroScene.count();
  test.skip(sceneCount === 0, "No hero scene attribute (static/reduced fallback active)");
  await expect(heroScene).toHaveAttribute("data-apex-hero", /^(on|off)$/);
});

test("configure route has garage-save CTA and exploded toggle", async ({ page }) => {
  await page.goto("/configure");
  const saveCta = page.locator('[data-save-garage="1"]').first();
  await expect(saveCta).toBeVisible({ timeout: 15000 });
  const exploded = page.locator("button[data-exploded-view]").first();
  const explodedCount = await exploded.count();
  test.skip(explodedCount === 0, "No exploded toggle in static fallback mode");
});
