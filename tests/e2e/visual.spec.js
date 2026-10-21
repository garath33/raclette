const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const widths = [320, 768, 1024, 1440];

test("snímky úvodu v češtině", async ({ page }, testInfo) => {
  const dir = path.join("test-results", "visual");
  fs.mkdirSync(dir, { recursive: true });
  await page.goto("/?lang=cs");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(246, 243, 236)");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const file = path.join(dir, "uvod-" + width + ".png");
    await page.screenshot({ path: file });
    await testInfo.attach("uvod-" + width, { path: file, contentType: "image/png" });
  }
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("#pointy").scrollIntoViewIfNeeded();
    const file = path.join(dir, "pointy-" + width + ".png");
    await page.screenshot({ path: file });
    await testInfo.attach("pointy-" + width, { path: file, contentType: "image/png" });
  }
});
