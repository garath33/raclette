const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const LANGS = ["cs", "en", "fr", "sk", "it", "de", "pl", "es", "ru"];
const HOST = "https://www.raclettelovers.com/";

test("stránka má kanonickou adresu, hreflang, Open Graph a strukturovaná data", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /rel="canonical"/);
  assert.match(html, /index, follow/);
  assert.equal(/noindex/.test(html), false);
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

test("soubor CNAME drží raclettelovers.com a zdrojové HTML se smí indexovat", () => {
  assert.equal(fs.readFileSync("CNAME", "utf8").trim(), "raclettelovers.com");
  assert.match(fs.readFileSync("index.html", "utf8"), /index, follow/);
  assert.match(fs.readFileSync("index.html", "utf8"), /https:\/\/www\.raclettelovers\.com\/\?lang=en/);
  assert.match(fs.readFileSync("index.html", "utf8"), /https:\/\/raclettelovers\.cz\/\?lang=cs/);
});

test("robots a sitemap ukazují na ostré domény a všechny jazyky", () => {
  const robots = fs.readFileSync("robots.txt", "utf8");
  const sitemap = fs.readFileSync("sitemap.xml", "utf8");
  assert.match(robots, /Sitemap: https:\/\/www\.raclettelovers\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/raclettelovers\.sk\/\?lang=sk/);
  assert.match(sitemap, /https:\/\/raclettelovers\.ch\/\?lang=fr/);
  assert.match(sitemap, /pro-partnery\.html\?lang=cs/);
  assert.match(sitemap, /pro-partnery\.html\?lang=sk/);
  assert.match(sitemap, /app\.html\?lang=cs/);
  assert.match(sitemap, /app\.html\?lang=en/);
  assert.match(sitemap, /app\.html\?lang=fr/);
  assert.match(sitemap, /app\.html\?lang=sk/);
  for (const lang of LANGS) {
    assert.match(sitemap, new RegExp("lang=" + lang));
  }
  assert.match(sitemap, /hreflang="x-default"/);
  assert.equal(sitemap.includes(HOST), true);
});

test("veřejné soubory drží výkonnostní rozpočet", () => {
  const limits = {
    "css/styles.css": 46 * 1024,
    "js/app.js": 20 * 1024,
    "js/i18n-app.js": 16 * 1024,
    "js/lovers-app.js": 12 * 1024,
    "js/i18n.js": 90 * 1024,
    "js/i18n-extra.js": 188 * 1024,
    "assets/photo-service.jpg": 400 * 1024,
    "assets/photo-wedge.jpg": 280 * 1024,
    "assets/shop-assortment.jpg": 320 * 1024,
    "assets/photo-barry.jpg": 220 * 1024,
    "assets/photo-laiterie.jpg": 80 * 1024,
    "assets/event-open-raklet.jpg": 160 * 1024,
    "assets/event-colours.jpg": 160 * 1024,
    "assets/event-beats.jpg": 160 * 1024,
    "assets/event-apetit.jpg": 80 * 1024,
    "assets/event-foodparade.jpg": 80 * 1024,
    "assets/event-senec.jpg": 180 * 1024,
    "assets/logo-point.png": 150 * 1024,
    "assets/icon-512.png": 120 * 1024,
    "assets/cow-head.png": 150 * 1024
  };
  for (const [file, limit] of Object.entries(limits)) {
    const size = fs.statSync(file).size;
    assert.ok(size <= limit, file + " má " + size + " B, limit je " + limit);
  }
});

test("web odkazuje na Instagram a YouTube Raclette Original", () => {
  for (const file of ["index.html", "pro-partnery.html"]) {
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /https:\/\/www\.instagram\.com\/racletteoriginal\//);
    assert.match(html, /https:\/\/www\.youtube\.com\/@RacletteOriginal/);
    assert.match(html, /class="social-links"/);
    assert.match(html, /class="header-social"/);
    assert.match(html, /"sameAs"/);
    assert.match(html, /data-i18n="social\.lead"/);
  }
  assert.match(fs.readFileSync("index.html", "utf8"), /class="social-follow"/);
});

test("kontaktní stránka neuvádí Veroniku a uvádí Martina Šimůnka", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.equal(/veronika/i.test(html), false);
  assert.match(html, /Martin Šimůnek/);
  assert.match(html, /Eliška Reine/);
  assert.match(html, /id="raclette"/);
  assert.match(html, /tel:\+420777891177/);
  assert.match(html, /tel:\+420602402935/);
  assert.match(html, /tel:\+420777600223/);
  assert.equal(/Ohýbková/.test(html), false);
  assert.equal(/400237/.test(html), false);
  assert.match(html, /id="vyhody"/);
  assert.match(html, /id="pointy"/);
  assert.match(html, /id="aplikace"/);
  assert.match(html, /app\.html/);
  assert.match(html, /rel="manifest"/);
  assert.equal(/id="franchise"/.test(html), false);
  assert.equal(/id="partner-form"/.test(html), false);
  assert.match(html, /pro-partnery\.html/);
  assert.match(html, /id="kontakty"/);
  assert.match(html, /id="pribeh"/);
  assert.match(html, /supplier-cow/);
  assert.match(html, /supplier-crest/);
  assert.equal(/hero-cow/.test(html), false);
  const partners = fs.readFileSync("pro-partnery.html", "utf8");
  assert.match(partners, /id="franchise"/);
  assert.match(partners, /id="franchise-form"/);
  assert.match(partners, /id="partner-form"/);
  assert.match(partners, /pro-partnery\.html\?lang=/);
});

test("PWA Raclette Lovers má manifest, ikony a stránku aplikace", () => {
  const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
  assert.equal(manifest.name, "Raclette Lovers");
  assert.equal(manifest.short_name, "Raclette Lovers");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./app.html");
  const app = fs.readFileSync("app.html", "utf8");
  assert.match(app, /rel="manifest"/);
  assert.match(app, /apple-touch-icon/);
  assert.match(app, /apple-mobile-web-app-capable/);
  assert.match(app, /id="locate"/);
  assert.match(app, /option value="cs"/);
  assert.match(app, /option value="sk"/);
  assert.match(app, /option value="en"/);
  assert.match(app, /option value="fr"/);
  assert.equal(/option value="de"/.test(app), false);
  assert.match(app, /https:\/\/www\.facebook\.com\/rakletparty\//);
  assert.ok(fs.existsSync("assets/icon-192.png"));
  assert.ok(fs.existsSync("assets/icon-512.png"));
  assert.ok(fs.existsSync("assets/icon-maskable.png"));
  assert.ok(fs.existsSync("assets/apple-touch-icon.png"));
  assert.match(fs.readFileSync("sw.js", "utf8"), /fetch/);
});
