import { test, expect } from "@playwright/test";

test("v4.2 hero exposes cinematic GLSL data hook and survives scroll", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("[data-cinematic-glsl]").first();
  const heroCount = await hero.count();
  test.skip(heroCount === 0, "No cinematic hero attribute (static/reduced fallback active)");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute("data-cinematic-glsl", /^(on|off)$/);
  await page.evaluate(() => window.scrollBy(0, 420));
  await expect(hero).toBeVisible();
  const canvas = page.locator("#universe canvas").first();
  const count = await canvas.count();
  test.skip(count === 0, "No hero canvas (reduced motion or headless)");
  const box = await canvas.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(32);
});

test("configure exploded toggles interactive viewer prop (smoke)", async ({ page }) => {
  await page.goto("/configure");
  const saveCta = page.locator('[data-save-garage="1"]').first();
  await expect(saveCta).toBeVisible({ timeout: 15000 });
  const explodedToggle = await page
    .locator("button[data-exploded-view]")
    .first()
    .elementHandle();
  test.skip(!explodedToggle, "No exploded toggle in static fallback mode");
  const pressed = await explodedToggle.getAttribute("aria-pressed");
  expect(pressed).toMatch(/^(true|false)$/);
});
