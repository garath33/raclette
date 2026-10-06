const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["geolocation"]);
});

test("stránka se načte, má sekce a testovací pruh", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto("/?lang=cs");
  await expect(page.locator("h1")).toContainText("Švýcarský raclette");
  await expect(page.locator("#env-banner")).toBeVisible();
  for (const id of ["vyhody", "pointy", "franchise", "reference", "pribeh", "nakup", "eventy", "kontakty"]) {
    await expect(page.locator("#" + id)).toHaveCount(1);
  }
  await expect(page.locator("#point-cards .card")).toHaveCount(3);
  await expect(page.locator("#hero-locate")).toHaveAttribute("href", "#pointy");
  await expect(page.locator("#site-nav a[href='#pointy']")).toHaveText("Naše raclette pointy");
  await expect(page.locator("a[href='#franchise']").first()).toBeVisible();
  await expect(page.locator("#franchise h2")).toContainText("Raclette Point Original");
  await expect(page.locator(".hero-actions a[href='#franchise']")).toContainText("Chci se stát raclette pointem");
  await expect(page.locator(".hero-cow")).toHaveCount(0);
  await expect(page.locator(".supplier-cow")).toBeVisible();
  await expect(page.locator(".supplier-crest")).toBeVisible();
  await expect(page.locator("#partner-form")).toBeVisible();
  await expect(page.locator("#form-name")).toHaveAttribute("required", "");
  await expect(page.locator("#form-type")).toHaveAttribute("required", "");
  await expect(page.locator("#form-city")).toHaveAttribute("required", "");
  await expect(page.locator("#form-phone")).toHaveAttribute("required", "");
  await expect(page.locator("#form-email")).toHaveAttribute("required", "");
  await expect(page.locator("#form-idea")).toHaveAttribute("required", "");
  await expect(page.locator("#franchise")).toContainText("Shop-in-shop");
  await expect(page.locator("#franchise")).toContainText("Eddy Baillifard");
  await expect(page.locator("#franchise")).toContainText("milan@raclette-original.com");
  await expect(page.getByRole("heading", { name: "Martin Šimůnek" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/veronika/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /lang=cs/);
  expect(errors).toEqual([]);
});

test("formulář spolupráce vyžaduje všechna pole a míří na Milana", async ({ page }) => {
  await page.addInitScript(() => {
    window.__mailto = null;
    const assign = Object.getOwnPropertyDescriptor(Location.prototype, "href").set;
    Object.defineProperty(Location.prototype, "href", {
      configurable: true,
      set(value) {
        if (String(value).startsWith("mailto:")) {
          window.__mailto = String(value);
          return;
        }
        assign.call(this, value);
      },
      get() {
        return window.location.toString();
      }
    });
  });
  await page.goto("/?lang=cs");
  await page.locator("#franchise-form").scrollIntoViewIfNeeded();
  await page.locator("#partner-form button[type='submit']").click();
  await expect(page.locator("#form-status")).toContainText("Vyplňte");
  await page.fill("#form-name", "Hotel Test");
  await page.selectOption("#form-type", "hotel");
  await page.fill("#form-city", "Opava");
  await page.fill("#form-phone", "+420777600223");
  await page.fill("#form-email", "partner@example.com");
  await page.fill("#form-idea", "Chci shop-in-shop na terasu.");
  await page.locator("#partner-form button[type='submit']").click();
  await expect.poll(async () => page.evaluate(() => window.__mailto)).toMatch(/^mailto:milan@raclette-original\.com\?/);
  const mailto = decodeURIComponent(await page.evaluate(() => window.__mailto));
  expect(mailto).toContain("Hotel Test");
  expect(mailto).toContain("Opava");
  expect(mailto).toContain("partner@example.com");
  expect(mailto).toContain("Raclette Point Original");
});

test("přepnutí jazyka změní titulek a kanonickou adresu", async ({ page }) => {
  await page.goto("/?lang=cs");
  await page.selectOption("#lang", "de");
  await expect(page.locator("h1")).toContainText("Schweizer Raclette");
  await expect(page.locator("#site-nav")).toContainText("Kontakt");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /lang=de/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});

test("poloha u Kladna vybere food truck a u Jeseníku Křížový vrch", async ({ page, context }) => {
  await context.setGeolocation({ latitude: 50.1466, longitude: 14.1026 });
  await page.goto("/?lang=cs");
  await page.locator("#locate").click();
  await expect(page.locator("#locator-status")).toContainText("Martin Kábrt");
  await expect(page.locator("#map-frame")).toHaveAttribute("src", /50\.1466053,14\.1026398/);
  await expect(page.locator("#point-cards .badge")).toHaveText("Nejbližší");

  await context.setGeolocation({ latitude: 50.23, longitude: 17.22 });
  await page.locator("#locate").click();
  await expect(page.locator("#locator-status")).toContainText("Křížový vrch");
  await expect(page.locator("#point-cards a[href='https://krizovyvrch.cz/cs']")).toBeVisible();
});
