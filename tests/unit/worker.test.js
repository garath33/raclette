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
  const out = prepareHtml(html, "raclettelovers.cz", "");
  assert.match(out, /content="index, follow"/);
  assert.match(out, /href="https:\/\/raclettelovers\.cz\/\?lang=cs"/);
  assert.equal(out.includes("github.io"), false);
  const partners = prepareHtml(html, "raclettelovers.sk", "?lang=sk", "/pro-partnery.html");
  assert.match(partners, /href="https:\/\/raclettelovers\.sk\/pro-partnery\.html\?lang=sk"/);
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
