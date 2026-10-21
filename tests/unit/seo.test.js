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

test("výchozí HTML je anglicky a sitemap uvádí každý jazyk jako vlastní adresu", async () => {
  const { extractPacks, extractPoints, localizeHtml, mergePacks, sitemapXml } = await import("../../lib/seo-html.mjs");
  const fs = require("node:fs");
  const files = ["js/i18n.js", "js/i18n-extra.js", "js/i18n-app.js", "js/i18n-ig.js"];
  let packs = {};
  for (const file of files) packs = mergePacks(packs, extractPacks(fs.readFileSync(file, "utf8")));
  const points = extractPoints(fs.readFileSync("js/points.js", "utf8"));
  assert.equal(points.length, 8);
  assert.equal(points[0].id, "krizovy");
  assert.equal(points[0].lat, 50.2260421);
  const vm = require("node:vm");
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("js/i18n.js", "utf8") + "\nglobalThis.TRANSLATIONS = TRANSLATIONS;", context);
  vm.runInContext(fs.readFileSync("js/i18n-extra.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("js/i18n-app.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("js/i18n-ig.js", "utf8"), context);
  for (const lang of Object.keys(context.TRANSLATIONS)) {
    assert.deepEqual(Object.keys(packs[lang]).sort(), Object.keys(context.TRANSLATIONS[lang]).sort(), lang);
  }
  const pages = [
    ["index.html", "/", "www.raclettelovers.com"],
    ["pro-partnery.html", "/pro-partnery.html", "www.raclettelovers.com"],
    ["app.html", "/app.html", "www.raclettelovers.com"]
  ];
  for (const [file, path, host] of pages) {
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /<html lang="en">/);
    assert.equal(localizeHtml(html, "en", packs, host, path, points), html, file + " se rozchází s anglickým zněním");
  }
  assert.match(fs.readFileSync("pro-partnery.html", "utf8"), /<h1[^>]*data-i18n="franchise.title"/);
  assert.equal(fs.readFileSync("sitemap.xml", "utf8"), sitemapXml("www.raclettelovers.com"));
  const sitemap = sitemapXml();
  for (const lang of ["de", "it", "pl", "es", "ru"]) {
    assert.match(sitemap, new RegExp("<loc>https://www\\.raclettelovers\\.com/\\?lang=" + lang + "</loc>"));
    assert.match(sitemap, new RegExp("<loc>https://www\\.raclettelovers\\.com/pro-partnery\\.html\\?lang=" + lang + "</loc>"));
  }
  assert.equal(sitemap.includes("app.html?lang=de"), false);
});

test("robots a sitemap ukazují na ostré domény a všechny jazyky", async () => {
  const { sitemapXml } = await import("../../lib/seo-html.mjs");
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
  const file = fs.readFileSync("sitemap.xml", "utf8");
  assert.equal(file.includes("<loc>https://raclettelovers.cz/"), false);
  assert.equal(file.includes("<loc>https://raclettelovers.sk/"), false);
  assert.equal(file.includes("<loc>https://raclettelovers.ch/"), false);
  assert.match(file, /hreflang="cs" href="https:\/\/raclettelovers\.cz\/\?lang=cs"/);
  const czech = sitemapXml("raclettelovers.cz");
  assert.match(czech, /<loc>https:\/\/raclettelovers\.cz\/\?lang=cs<\/loc>/);
  assert.match(czech, /<loc>https:\/\/raclettelovers\.cz\/pro-partnery\.html\?lang=cs<\/loc>/);
  assert.match(czech, /<loc>https:\/\/raclettelovers\.cz\/app\.html\?lang=cs<\/loc>/);
  assert.equal(czech.includes("<loc>https://www.raclettelovers.com/"), false);
  assert.match(czech, /hreflang="en" href="https:\/\/www\.raclettelovers\.com\/\?lang=en"/);
});

test("veřejné soubory drží výkonnostní rozpočet", () => {
  const limits = {
    "css/styles.css": 50 * 1024,
    "js/app.js": 22 * 1024,
    "js/i18n-app.js": 16 * 1024,
    "js/lovers-app.js": 12 * 1024,
    "js/i18n.js": 98 * 1024,
    "js/i18n-extra.js": 208 * 1024,
    "assets/photo-service.jpg": 400 * 1024,
    "assets/photo-wedge.jpg": 280 * 1024,
    "assets/shop-assortment.jpg": 320 * 1024,
    "assets/photo-barry.jpg": 220 * 1024,
    "assets/photo-laiterie.jpg": 80 * 1024,
    "assets/photo-cellar.jpg": 80 * 1024,
    "assets/event-open-raklet.jpg": 160 * 1024,
    "assets/event-colours.jpg": 160 * 1024,
    "assets/event-beats.jpg": 160 * 1024,
    "assets/event-apetit.jpg": 80 * 1024,
    "assets/event-foodparade.jpg": 80 * 1024,
    "assets/event-senec.jpg": 180 * 1024,
    "assets/logo-point.png": 150 * 1024,
    "assets/icon-512.png": 300 * 1024,
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
  assert.equal(/tel:\+420777891177/.test(html), false);
  assert.equal(/tel:\+420602402935/.test(html), false);
  assert.equal(/777 891 177/.test(html), false);
  assert.equal(/602 402 935/.test(html), false);
  assert.equal(/Ratibořská/.test(html), false);
  assert.equal(/Dodací adresa/.test(html), false);
  assert.match(html, /tel:\+420777600223/);
  assert.match(html, /tel:\+41766083983/);
  assert.match(html, /data-flags="cz sk"/);
  assert.match(html, /data-flags="ch"/);
  assert.equal(/🇨🇿|🇸🇰|🇨🇭/.test(html), false);
  assert.match(html, /"areaServed": \["CZ", "SK"\]/);
  assert.match(html, /"areaServed": "CH"/);
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

test("veřejné stránky mají jeden nadpis, alt, lokální písmo a bezpečnostní značku", async () => {
  const { CONTENT_SECURITY_POLICY } = await import("../../worker.js");
  const escaped = CONTENT_SECURITY_POLICY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const file of ["index.html", "pro-partnery.html", "app.html"]) {
    const html = fs.readFileSync(file, "utf8");
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, file);
    assert.equal(html.includes("fonts.googleapis.com"), false, file);
    assert.match(html, /href="css\/fonts.css"/);
    assert.match(html, new RegExp('http-equiv="Content-Security-Policy" content="' + escaped + '"'));
    for (const img of html.match(/<img\b[^>]*>/g) || []) {
      assert.match(img, /\salt="/, file + " " + img);
    }
  }
  const home = fs.readFileSync("index.html", "utf8");
  const photos = [...home.matchAll(/src="(assets\/[^"]+\.jpg)"/g)].map((match) => match[1]);
  assert.ok(photos.length >= 10);
  for (const file of photos) {
    const base = file.replace(/\.jpg$/, "");
    assert.ok(fs.statSync(base + ".webp").size < fs.statSync(file).size, base);
    assert.ok(fs.statSync(base + ".avif").size < fs.statSync(file).size, base);
    assert.match(home, new RegExp('<source type="image/avif" srcset="' + base + '\\.avif">'));
    assert.match(home, new RegExp('<source type="image/webp" srcset="' + base + '\\.webp">'));
  }
  for (const tag of home.match(/<img\b[^>]*\.jpg[^>]*>/g)) {
    if (tag.includes("hero-photo")) assert.equal(tag.includes('loading="lazy"'), false);
    else assert.match(tag, /loading="lazy"/);
  }
  assert.match(home, /rel="preload" as="image" href="assets\/photo-service\.avif"/);
  assert.ok(fs.statSync("css/fonts.css").size < 8 * 1024);
  for (const font of fs.readdirSync("fonts")) {
    if (!font.endsWith(".woff2")) continue;
    assert.ok(fs.statSync("fonts/" + font).size < 80 * 1024, font);
  }
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
