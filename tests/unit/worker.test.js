const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const workerPromise = import("../../worker.js");

const html = [
  '<meta name="robots" content="noindex, follow">',
  '<link rel="canonical" href="https://garath33.github.io/raclette/?lang=cs">',
  '<meta property="og:url" content="https://garath33.github.io/raclette/?lang=cs">',
].join("\n");

test("česká doména dostane index a vlastní kanonickou adresu", async () => {
  const { prepareHtml, canonicalFor } = await workerPromise;
  assert.equal(canonicalFor("raclettelovers.cz", ""), "https://raclettelovers.cz/?lang=cs");
  assert.equal(canonicalFor("www.raclettelovers.cz", "?lang=en"), "https://www.raclettelovers.com/?lang=en");
  assert.equal(
    canonicalFor("raclettelovers.cz", "?lang=cs", "/pro-partnery.html"),
    "https://raclettelovers.cz/pro-partnery.html?lang=cs"
  );
  assert.equal(
    canonicalFor("raclettelovers.cz", "?lang=cs", "/app.html"),
    "https://raclettelovers.cz/app.html?lang=cs"
  );
  assert.equal(
    canonicalFor("raclettelovers.ch", "?lang=fr", "/app"),
    "https://raclettelovers.ch/app.html?lang=fr"
  );
  const out = prepareHtml(html, "raclettelovers.cz", "");
  assert.match(out, /content="index, follow"/);
  assert.match(out, /href="https:\/\/raclettelovers\.cz\/\?lang=cs"/);
  assert.equal(out.includes("github.io"), false);
  const partners = prepareHtml(html, "raclettelovers.sk", "?lang=sk", "/pro-partnery.html");
  assert.match(partners, /href="https:\/\/raclettelovers\.sk\/pro-partnery\.html\?lang=sk"/);
});

test("aktuální IP vrátí souřadnice z Cloudflare a bez nich mlčí", async () => {
  const { networkLocation, default: worker } = await workerPromise;
  const zlicin = networkLocation({ cf: { latitude: "50.0535", longitude: "14.3062", city: "Prague" } });
  assert.deepEqual(zlicin, { lat: 50.0535, lng: 14.3062, accuracy: 20000, city: "Prague" });
  assert.equal(networkLocation({ cf: {} }), null);
  assert.equal(networkLocation({}), null);

  const missing = await worker.fetch(new Request("https://raclettelovers.cz/api/where"), {
    ASSETS: { async fetch() { throw new Error("assets se nemají volat"); } }
  });
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("cache-control"), "no-store");
  assert.deepEqual(await missing.json(), { ok: false });

  const request = new Request("https://raclettelovers.cz/api/where");
  request.cf = { latitude: "50.0535", longitude: "14.3062", city: "Prague" };
  const found = await worker.fetch(request, {
    ASSETS: { async fetch() { throw new Error("assets se nemají volat"); } }
  });
  assert.equal(found.status, 200);
  assert.equal(found.headers.get("cache-control"), "no-store");
  assert.deepEqual(await found.json(), { ok: true, lat: 50.0535, lng: 14.3062, accuracy: 20000, city: "Prague" });
});

test("holá adresa domény skočí na jazyk té domény a odpověď už je v tom jazyce", async () => {
  const { default: worker, prepareHtml } = await workerPromise;
  const { extractPacks, extractPoints, mergePacks } = await import("../../lib/seo-html.mjs");
  const home = await worker.fetch(new Request("https://raclettelovers.cz/"), {
    ASSETS: { async fetch() { throw new Error("soubor se nemá číst"); } }
  });
  assert.equal(home.status, 301);
  assert.equal(home.headers.get("location"), "https://raclettelovers.cz/?lang=cs");

  const partners = await worker.fetch(new Request("https://www.raclettelovers.sk/pro-partnery"), {
    ASSETS: { async fetch() { throw new Error("soubor se nemá číst"); } }
  });
  assert.equal(partners.status, 301);
  assert.equal(partners.headers.get("location"), "https://raclettelovers.sk/pro-partnery?lang=sk");

  const apex = await worker.fetch(new Request("https://raclettelovers.com/app"), {
    ASSETS: { async fetch() { throw new Error("soubor se nemá číst"); } }
  });
  assert.equal(apex.status, 301);
  assert.equal(apex.headers.get("location"), "https://www.raclettelovers.com/app?lang=en");
  const { indexRedirect } = await workerPromise;
  assert.equal(indexRedirect("raclettelovers.cz", "/pro-partnery.html", "?lang=cs"), null);
  assert.equal(indexRedirect("raclettelovers.cz", "/pro-partnery", "?lang=cs"), null);
  assert.equal(indexRedirect("raclettelovers.cz", "/app.html", "?lang=cs"), null);

  let packs = {};
  for (const file of ["js/i18n.js", "js/i18n-extra.js", "js/i18n-app.js", "js/i18n-ig.js"]) {
    packs = mergePacks(packs, extractPacks(fs.readFileSync(file, "utf8")));
  }
  const points = extractPoints(fs.readFileSync("js/points.js", "utf8"));
  const html = fs.readFileSync("index.html", "utf8");
  const slovak = prepareHtml(html, "raclettelovers.sk", "?lang=sk", "/", packs, points);
  assert.match(slovak, /<html lang="sk">/);
  assert.match(slovak, /<title>[^<]*[Ss]lovensk/);
  assert.match(slovak, />Pre partnerov</);
  assert.match(slovak, /href="https:\/\/raclettelovers\.sk\/\?lang=sk"/);
  assert.match(slovak, /href="pro-partnery\.html\?lang=sk"/);
  assert.match(slovak, /FoodEstablishment/);
  assert.match(slovak, /Křížový vrch/);

  const french = prepareHtml(html, "raclettelovers.ch", "", "/", packs, points);
  assert.match(french, /<html lang="fr-CH">/);
  assert.match(french, /Pour les partenaires/);
  assert.match(french, /"inLanguage": "fr-CH"/);

  const preview = prepareHtml(html, "cursor-seo-search-9b75-raclette.simunek-m.workers.dev", "?lang=cs", "/", packs, points);
  assert.match(preview, /noindex, follow/);
  assert.match(preview, />Pro partnery</);
  assert.match(preview, /href="https:\/\/raclettelovers\.cz\/\?lang=cs"/);
});

test("alias se přesměruje a obsahová doména se přepíše", async () => {
  const { default: worker } = await workerPromise;
  const redirect = await worker.fetch(new Request("https://raclettepointoriginal.cz/akce?lang=cs"), {});
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), "https://raclettelovers.cz/akce?lang=cs");
  assert.equal(redirect.headers.get("x-content-type-options"), "nosniff");
  assert.match(redirect.headers.get("content-security-policy"), /frame-ancestors 'self'/);

  const page = await worker.fetch(new Request("https://raclettelovers.sk/?lang=de"), {
    ASSETS: {
      async fetch() {
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
      },
    },
  });
  const body = await page.text();
  assert.equal(page.status, 200);
  assert.match(body, /https:\/\/www\.raclettelovers\.com\/\?lang=de/);
  assert.match(body, /index, follow/);
  assert.equal(page.headers.get("x-content-type-options"), "nosniff");
  assert.equal(page.headers.get("strict-transport-security"), "max-age=15552000");
  assert.match(page.headers.get("content-security-policy"), /upgrade-insecure-requests/);
});

test("sitemap na české doméně uvádí jen české adresy", async () => {
  const { default: worker } = await workerPromise;
  const sitemap = await worker.fetch(new Request("https://raclettelovers.cz/sitemap.xml"), {
    ASSETS: { async fetch() { throw new Error("soubor se nemá číst"); } }
  });
  const xml = await sitemap.text();
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type"), /application\/xml/);
  assert.match(xml, /<loc>https:\/\/raclettelovers\.cz\/\?lang=cs<\/loc>/);
  assert.equal(xml.includes("<loc>https://www.raclettelovers.com/"), false);
  assert.equal(xml.includes("<loc>https://raclettelovers.sk/"), false);
  assert.match(xml, /hreflang="sk" href="https:\/\/raclettelovers\.sk\/\?lang=sk"/);
});

test("http skočí na https a soubor dostane hlavičky", async () => {
  const { default: worker } = await workerPromise;
  const http = await worker.fetch(new Request("http://raclettelovers.cz/pro-partnery?lang=cs"), {});
  assert.equal(http.status, 301);
  assert.equal(http.headers.get("location"), "https://raclettelovers.cz/pro-partnery?lang=cs");
  const css = await worker.fetch(new Request("https://raclettelovers.cz/css/styles.css"), {
    ASSETS: {
      async fetch() {
        return new Response("body{}", { headers: { "content-type": "text/css" } });
      }
    }
  });
  assert.equal(css.status, 200);
  assert.equal(await css.text(), "body{}");
  assert.equal(css.headers.get("x-content-type-options"), "nosniff");
  assert.match(css.headers.get("content-security-policy"), /font-src 'self'/);
});
