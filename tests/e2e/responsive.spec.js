const { test, expect } = require("@playwright/test");

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("mobil, tablet a desktop nemají vodorovný přetok", async ({ page }) => {
  await page.goto("/?lang=cs");
  for (const size of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(size);
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await overflow(page), JSON.stringify(size)).toBeLessThanOrEqual(1);
    await page.locator("#kontakty").scrollIntoViewIfNeeded();
    expect(await overflow(page), "kontakty " + JSON.stringify(size)).toBeLessThanOrEqual(1);
  }
});

test("barevná hlava krávy drží poměr stran a vejde se do okna", async ({ page }) => {
  await page.goto("/?lang=cs");
  for (const size of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 }
  ]) {
    await page.setViewportSize(size);
    const box = await page.locator(".hero-cow").boundingBox();
    const ratio = box.height / box.width;
    expect(ratio, JSON.stringify(size)).toBeGreaterThan(1.05);
    expect(ratio, JSON.stringify(size)).toBeLessThan(1.4);
    expect(box.x, JSON.stringify(size)).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width, JSON.stringify(size)).toBeLessThanOrEqual(size.width + 1);
    expect(box.y + box.height, JSON.stringify(size)).toBeLessThanOrEqual(size.height + 1);
  }
});

test("na mobilu se otevře menu a na desktopu je navigace vidět rovnou", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=cs");
  await expect(page.locator("#nav-toggle")).toBeVisible();
  await page.locator("#nav-toggle").click();
  await expect(page.locator("#site-nav")).toBeVisible();
  await page.locator("#site-nav a[href='#kontakty']").click();
  await expect(page.locator("#kontakty")).toBeInViewport();

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator("#nav-toggle")).toBeHidden();
  await expect(page.locator("#site-nav a[href='#pointy']")).toBeVisible();
});
