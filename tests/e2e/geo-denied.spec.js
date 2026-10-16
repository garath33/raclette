const { test, expect } = require("@playwright/test");
const { mockGeoError } = require("./geo-mock");

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["geolocation"]);
});

test("vypnutá poloha na notebooku navede k zapnutí sdílení a neotevře starý pin", async ({ page, context }) => {
  await context.grantPermissions([]);
  await mockGeoError(page, 1, "denied");
  await page.goto("/?lang=cs");
  await page.locator("#point-cards a[data-route]").first().click();
  await expect(page.locator("#locator-status")).toContainText("Polohu se nepodařilo načíst");
  await expect(page.locator("#locator-status")).toContainText("Povolit");
  await expect(page.locator("#locator-status")).toHaveClass(/is-need/);
  await expect(page).toHaveURL(/lang=cs/);
  await expect(page.locator("#navigate-nearest")).toBeHidden();
});

test("bez prohlížečové polohy navigace startuje z aktuální IP", async ({ page, context }) => {
  await context.grantPermissions([]);
  await mockGeoError(page, 1, "denied");
  await page.route("**/api/where", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, lat: 50.0535, lng: 14.3062, accuracy: 20000 })
  }));
  await page.goto("/app.html?lang=cs");
  await page.locator("#locate").click();
  await expect(page.locator("#locator-status")).toContainText("Odhad z IP");
  await expect(page.locator("#locator-status")).toContainText("Martin Kábrt");
  const navHref = await page.locator("#navigate-nearest").getAttribute("href");
  expect(navHref).toMatch(/destination=50\.1466053%2C14\.1026398/);
  expect(navHref).not.toMatch(/[?&]origin=/);
});

test("odmítnutá poloha ukáže hlášku a navigaci neschová jako dostupnou", async ({ page, context }) => {
  await context.grantPermissions([]);
  await mockGeoError(page, 1, "denied");
  await page.goto("/?lang=cs");
  await page.locator("#locate").click();
  await expect(page.locator("#locator-status")).toContainText("Polohu se nepodařilo načíst");
  await expect(page.locator("#navigate-nearest")).toBeHidden();
});

const ANDROID_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

test.describe("mobil bez GPS", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: ANDROID_UA
  });

  test("Android bez polohy nevezme IP u Křížového vrchu", async ({ page, context }) => {
    await context.grantPermissions([]);
    await mockGeoError(page, 1, "denied");
    await page.route("**/api/where", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, lat: 50.23, lng: 17.22, accuracy: 20000, city: "Jesenik" })
    }));
    await page.goto("/?lang=cs");
    await page.locator("#locate").click();
    await expect(page.locator("#locator-status")).toContainText("GPS");
    await expect(page.locator("#locator-status")).toContainText("Chrome");
    await expect(page.locator("#locator-status")).toHaveClass(/is-need/);
    await expect(page.locator("#navigate-nearest")).toBeHidden();
    await expect(page.locator("#locator-status")).not.toContainText("Křížový vrch");
  });

  test("instalovaná aplikace bez GPS ukáže oprávnění aplikace, ne prohlížeč", async ({ page, context }) => {
    await context.grantPermissions([]);
    await page.addInitScript(() => {
      const real = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        if (String(query).includes("display-mode: standalone")) {
          return { matches: true, addListener: () => {}, removeListener: () => {} };
        }
        return real(query);
      };
      const fail = (_ok, err) => {
        if (typeof err === "function") err({ code: 1, message: "denied" });
      };
      navigator.geolocation.getCurrentPosition = fail;
      navigator.geolocation.watchPosition = (ok, err) => {
        fail(ok, err);
        return 0;
      };
      navigator.geolocation.clearWatch = () => {};
    });
    await page.goto("/app.html?lang=cs");
    await page.locator("#locate").click();
    await expect(page.locator("#locator-status")).toContainText("Informace o aplikaci");
    await expect(page.locator("#locator-status")).not.toContainText("v prohlížeči");
  });

  test("po odmítnutí GPS otevře vizitka Maps bez falešného Pointu", async ({ page, context }) => {
    await context.grantPermissions([]);
    await mockGeoError(page, 1, "denied");
    await page.goto("/?lang=cs");
    await page.locator("#locate").click();
    await expect(page.locator("#locator-status")).toContainText("GPS");
    const link = page.locator("#point-cards a[data-route]").first();
    await expect(link).toHaveAttribute("href", /google\.com\/maps\/dir/);
    const allowed = await link.evaluate((el) => {
      let went = false;
      el.addEventListener("click", (event) => {
        went = !event.defaultPrevented;
        event.preventDefault();
      }, { once: true });
      el.click();
      return went;
    });
    expect(allowed).toBe(true);
    await expect(page.locator("#navigate-nearest")).toBeHidden();
    await expect(page.locator("#locator-status")).not.toContainText("Křížový vrch");
  });
});
