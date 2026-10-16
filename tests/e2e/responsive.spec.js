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

test("loga mlékárny drží poměr stran a layout nepřetéká", async ({ page }) => {
  await page.goto("/?lang=cs");
  for (const size of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 }
  ]) {
    await page.setViewportSize(size);
    const cow = await page.locator(".supplier-cow").boundingBox();
    const crest = await page.locator(".supplier-crest").boundingBox();
    const photo = await page.locator(".hero-photo").boundingBox();
    const ratio = cow.height / cow.width;
    expect(ratio, JSON.stringify(size)).toBeGreaterThan(1.05);
    expect(ratio, JSON.stringify(size)).toBeLessThan(1.4);
    expect(Math.abs(photo.width - photo.height), JSON.stringify(size)).toBeLessThan(2);
    expect(crest.width, JSON.stringify(size)).toBeGreaterThan(cow.width);
    expect(cow.x, JSON.stringify(size)).toBeGreaterThanOrEqual(-1);
    expect(cow.x + cow.width, JSON.stringify(size)).toBeLessThanOrEqual(size.width + 1);
    expect(crest.x + crest.width, JSON.stringify(size)).toBeLessThanOrEqual(size.width + 1);
    const dairy = await page.locator("footer img.dairy").boundingBox();
    const lockup = 774 / 351;
    for (const [name, box] of [["crest", crest], ["dairy", dairy]]) {
      const aspect = box.width / box.height;
      expect(aspect, name + " " + JSON.stringify(size)).toBeGreaterThan(lockup - 0.12);
      expect(aspect, name + " " + JSON.stringify(size)).toBeLessThan(lockup + 0.12);
    }
  }

  await page.goto("/pro-partnery.html?lang=cs");
  await page.setViewportSize({ width: 1280, height: 800 });
  const partnersDairy = await page.locator("footer img.dairy").boundingBox();
  const partnersAspect = partnersDairy.width / partnersDairy.height;
  expect(partnersAspect).toBeGreaterThan(774 / 351 - 0.12);
  expect(partnersAspect).toBeLessThan(774 / 351 + 0.12);
  await expect(page.locator("footer .legal")).toContainText("Web vyvinul Martin Šimůnek");
});

test("aplikace Raclette Lovers na mobilu nepřetéká", async ({ page }) => {
  await page.goto("/app.html?lang=cs");
  for (const size of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 }
  ]) {
    await page.setViewportSize(size);
    expect(await overflow(page), JSON.stringify(size)).toBeLessThanOrEqual(1);
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

test("na mobilu je po přechodu na pointy vidět tlačítko pod bochníkem", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=cs");
  await page.locator("#hero-locate").click();
  await expect(page).toHaveURL(/#pointy/);
  await expect(page.locator("#locate")).toBeInViewport();
});

test("tlačítko pod sýrem je celé vidět na desktopu i v krátkém okně", async ({ page }) => {
  for (const size of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 640 }
  ]) {
    await page.setViewportSize(size);
    await page.goto("/?lang=cs#pointy");
    await page.locator("#locate").scrollIntoViewIfNeeded();
    await expect(page.locator("#locate")).toBeInViewport();
    const box = await page.locator("#locate").boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(size.height);
  }
});
