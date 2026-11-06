const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const release = process.env.RELEASE_LANGS === "1";
const langs = JSON.parse(fs.readFileSync("js/i18n.js", "utf8").match(/const LANGS = (\[[^\]]+\])/)[1]);

test.describe("jazykové mutace před vydáním", () => {
  test.skip(!release, "Průběžně se testuje čeština. Celá sada je npm run test:languages.");

  for (const lang of langs) {
    test(lang + " se načte", async ({ page }) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      await page.goto("/?lang=" + lang);
      await expect(page.locator("h1")).not.toBeEmpty();
      await expect(page.locator("html")).toHaveAttribute("lang", new RegExp("^" + lang));
      const dir = path.join("test-results", "visual");
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, "lang-" + lang + ".png") });
      expect(errors).toEqual([]);
    });
  }
});
