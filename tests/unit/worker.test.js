const test = require("node:test");
const assert = require("node:assert/strict");

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

test("alias se přesměruje a obsahová doména se přepíše", async () => {
  const { default: worker } = await workerPromise;
  const redirect = await worker.fetch(new Request("https://raclettepointoriginal.cz/akce?lang=cs"), {});
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), "https://raclettelovers.cz/akce?lang=cs");

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
});
