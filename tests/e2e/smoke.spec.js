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
  await expect(page.locator("#site-nav a[href='#franchise']")).toHaveText("Pro partnery");
  await expect(page.locator("#franchise h2")).toContainText("Raclette Point Original");
  await expect(page.locator("#franchise .aop-note")).toContainText("Appellation d’Origine Protégée");
  await expect(page.locator("#franchise-form .form-invite")).toContainText("+420 777 600 223");
  await expect(page.locator('#franchise-form a[href="tel:+420777600223"]')).toBeVisible();
  await expect(page.locator('#uvod a[data-i18n="hero.secondary"]')).toHaveText("Chci se stát raclette pointem");
  await expect(page.locator('#uvod a[data-i18n="hero.secondary"]')).toHaveAttribute("href", "#franchise");
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

test("formulář spolupráce vyžaduje všechna pole a odešle poptávku", async ({ page }) => {
  let posted = null;
  await page.route("https://formsubmit.co/ajax/**", async (route) => {
    posted = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "true" })
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
  await expect(page.locator("#form-status")).toContainText("Děkujeme");
  expect(posted).toMatchObject({
    name: "Hotel Test",
    email: "partner@example.com",
    mesto: "Opava",
    telefon: "+420777600223",
    predstava: "Chci shop-in-shop na terasu."
  });
  expect(posted._subject).toMatch(/Raclette Point Original/);
  expect(posted.message).toContain("Hotel Test");
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
