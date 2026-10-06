const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const LANGS = ["cs", "en", "fr", "sk", "it", "de", "pl", "es", "ru"];
const HOST = "https://garath33.github.io/raclette/";

test("stránka má kanonickou adresu, hreflang, Open Graph a strukturovaná data", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /rel="canonical"/);
  assert.match(html, /noindex, follow/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /twitter:card/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Raclette Point Original\.cz s\.r\.o\./);
  for (const lang of LANGS) {
    assert.match(html, new RegExp('hreflang="' + lang + '"'));
    assert.match(html, new RegExp("lang=" + lang));
  }
  assert.match(html, /hreflang="x-default"/);
});

test("soubor CNAME drží raclettelovers.com a zdrojové HTML zůstává noindex", () => {
  assert.equal(fs.readFileSync("CNAME", "utf8").trim(), "raclettelovers.com");
  assert.match(fs.readFileSync("index.html", "utf8"), /noindex, follow/);
});

test("robots a sitemap ukazují na testovací adresu a všechny jazyky", () => {
  const robots = fs.readFileSync("robots.txt", "utf8");
  const sitemap = fs.readFileSync("sitemap.xml", "utf8");
  assert.match(robots, /Sitemap: https:\/\/garath33\.github\.io\/raclette\/sitemap\.xml/);
  for (const lang of LANGS) {
    assert.match(sitemap, new RegExp("lang=" + lang));
  }
  assert.match(sitemap, /hreflang="x-default"/);
  assert.equal(sitemap.includes(HOST), true);
});

test("soubor _redirects posílá staré a spojovníkové domény 301 na raclettelovers.*", () => {
  const redirects = fs.readFileSync("_redirects", "utf8");
  const rules = [
    ["raclettepointoriginal.com", "www.raclettelovers.com"],
    ["raclettepointoriginal.cz", "raclettelovers.cz"],
    ["raclettepointoriginal.sk", "raclettelovers.sk"],
    ["raclettepointoriginal.ch", "raclettelovers.ch"],
    ["raclette-point-original.com", "www.raclettelovers.com"],
    ["raclette-lovers.com", "www.raclettelovers.com"]
  ];
  for (const [from, to] of rules) {
    assert.match(redirects, new RegExp("https://" + from.replace(/\./g, "\\.") + "/\\* https://" + to.replace(/\./g, "\\.") + "/:splat 301"));
    assert.match(redirects, new RegExp("https://www\\." + from.replace(/\./g, "\\.") + "/\\* https://" + to.replace(/\./g, "\\.") + "/:splat 301"));
  }
  for (const host of ["raclettelovers.cz", "raclettelovers.sk", "raclettelovers.ch"]) {
    assert.match(redirects, new RegExp("https://www\\." + host.replace(/\./g, "\\.") + "/\\* https://" + host.replace(/\./g, "\\.") + "/:splat 301"));
  }
  assert.equal(redirects.includes("https://www.raclettelovers.com/* https://raclettelovers.com/:splat 301"), false);
});

test("worker.js má stejné cíle 301 a kanonické hosty nechává na webu", () => {
  const worker = fs.readFileSync("worker.js", "utf8");
  const rules = [
    ["www.raclettelovers.cz", "https://raclettelovers.cz"],
    ["www.raclettelovers.sk", "https://raclettelovers.sk"],
    ["www.raclettelovers.ch", "https://raclettelovers.ch"],
    ["raclettepointoriginal.com", "https://www.raclettelovers.com"],
    ["www.raclettepointoriginal.com", "https://www.raclettelovers.com"],
    ["raclettepointoriginal.cz", "https://raclettelovers.cz"],
    ["www.raclettepointoriginal.cz", "https://raclettelovers.cz"],
    ["raclettepointoriginal.sk", "https://raclettelovers.sk"],
    ["www.raclettepointoriginal.sk", "https://raclettelovers.sk"],
    ["raclettepointoriginal.ch", "https://raclettelovers.ch"],
    ["www.raclettepointoriginal.ch", "https://raclettelovers.ch"],
    ["raclette-point-original.com", "https://www.raclettelovers.com"],
    ["www.raclette-point-original.com", "https://www.raclettelovers.com"],
    ["raclette-lovers.com", "https://www.raclettelovers.com"],
    ["www.raclette-lovers.com", "https://www.raclettelovers.com"]
  ];
  for (const [from, to] of rules) {
    assert.match(worker, new RegExp('"' + from.replace(/\./g, "\\.") + '": "' + to.replace(/[.]/g, "\\.") + '"'));
  }
  assert.equal(worker.includes('"raclettelovers.cz"'), false);
  assert.equal(worker.includes('"www.raclettelovers.com"'), false);
  assert.equal(fs.existsSync("public/_redirects"), false);
});

test("složka public je stejný web, který nahrává Cloudflare Worker", () => {
  const files = [
    "index.html",
    "robots.txt",
    "sitemap.xml",
    "css/styles.css",
    "js/site.js",
    "js/app.js"
  ];
  for (const file of files) {
    assert.equal(fs.readFileSync("public/" + file, "utf8"), fs.readFileSync(file, "utf8"), file);
  }
  assert.equal(fs.existsSync("public/assets/photo-service.jpg"), true);
});

test("veřejné soubory drží výkonnostní rozpočet", () => {
  const limits = {
    "css/styles.css": 40 * 1024,
    "js/app.js": 20 * 1024,
    "js/i18n.js": 60 * 1024,
    "js/i18n-extra.js": 128 * 1024,
    "assets/photo-service.jpg": 400 * 1024,
    "assets/photo-wedge.jpg": 280 * 1024,
    "assets/photo-barry.jpg": 220 * 1024,
    "assets/logo-point.png": 150 * 1024,
    "assets/cow-head.png": 150 * 1024
  };
  for (const [file, limit] of Object.entries(limits)) {
    const size = fs.statSync(file).size;
    assert.ok(size <= limit, file + " má " + size + " B, limit je " + limit);
  }
});

test("kontaktní stránka neuvádí Veroniku a uvádí Martina Šimůnka", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.equal(/veronika/i.test(html), false);
  assert.match(html, /Martin Šimůnek/);
  assert.match(html, /id="pointy"/);
  assert.match(html, /id="franchise"/);
  assert.match(html, /id="kontakty"/);
  assert.match(html, /id="pribeh"/);
});
