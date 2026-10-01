const { test, expect } = require("@playwright/test");

test("vlastní soubory stránky se vejdou do rozpočtu a konzole je čistá", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto("/?lang=cs", { waitUntil: "networkidle" });
  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => ({
      name: entry.name,
      size: entry.transferSize || entry.encodedBodySize || 0
    }))
  );
  const local = resources.filter((entry) => entry.name.includes("127.0.0.1"));
  const heavy = local.filter((entry) => entry.size > 500 * 1024);
  expect(heavy, JSON.stringify(heavy)).toEqual([]);
  expect(local.length).toBeGreaterThan(5);
  await expect(page.locator(".hero-photo")).toHaveAttribute("fetchpriority", "high");
  expect(errors.filter((line) => !/favicon|compute-pressure/i.test(line))).toEqual([]);
});
