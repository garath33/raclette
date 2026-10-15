const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadTranslations() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("js/i18n.js", "utf8") + "\nglobalThis.TRANSLATIONS = TRANSLATIONS;\nglobalThis.LANGS = LANGS;", context);
  vm.runInContext(fs.readFileSync("js/i18n-extra.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("js/i18n-app.js", "utf8"), context);
  return context;
}

test("všech devět jazyků má stejné klíče", () => {
  const { TRANSLATIONS, LANGS } = loadTranslations();
  assert.deepEqual(Object.keys(TRANSLATIONS).sort(), [...LANGS].sort());
  const base = Object.keys(TRANSLATIONS.cs);
  for (const lang of LANGS) {
    const keys = Object.keys(TRANSLATIONS[lang]);
    assert.deepEqual(keys.filter((key) => !base.includes(key)), [], lang + " má navíc klíče");
    assert.deepEqual(base.filter((key) => !keys.includes(key)), [], lang + " nemá všechny klíče");
    for (const key of base) {
      assert.equal(typeof TRANSLATIONS[lang][key], "string");
      assert.notEqual(TRANSLATIONS[lang][key].trim(), "", lang + " " + key);
    }
  }
});

test("veřejný text nezmiňuje vyřazenou osobu a IT role existuje", () => {
  const { TRANSLATIONS } = loadTranslations();
  for (const lang of Object.keys(TRANSLATIONS)) {
    const blob = Object.values(TRANSLATIONS[lang]).join("\n");
    assert.equal(/veronika/i.test(blob), false, lang);
  }
  assert.match(TRANSLATIONS.cs["franchise.s2d"], /schůzku/);
  assert.match(TRANSLATIONS.cs["franchise.f1d"], /částečné po kompletní/);
  assert.match(TRANSLATIONS.cs["franchise.title"], /Raclette Point Original/);
  assert.match(TRANSLATIONS.cs["nav.points"], /Naše raclette pointy/);
  assert.match(TRANSLATIONS.cs["hero.secondary"], /Chci se stát raclette pointem/);
  assert.match(TRANSLATIONS.cs["franchise.lead"], /Bez statisícových investic a bez šéfkuchaře/);
  assert.match(TRANSLATIONS.cs["franchise.concept"], /průměrnou útratu/);
  assert.match(TRANSLATIONS.cs["franchise.why1d"], /Raclette Lovers/);
  assert.match(TRANSLATIONS.cs["franchise.g2d"], /Vacherin Fribourgeois/);
  assert.match(TRANSLATIONS.cs["franchise.g3d"], /Raclette Master/);
  assert.match(TRANSLATIONS.cs["franchise.approach"], /statisícové ani milionové vstupní poplatky/);
  assert.match(TRANSLATIONS.cs["franchise.a3d"], /Měsíční partnerský poplatek/);
  assert.match(TRANSLATIONS.cs["franchise.s4d"], /Eddy Baillifard/);
  assert.match(TRANSLATIONS.cs["form.lead"], /Ozveme se vám/);
  for (const lang of Object.keys(TRANSLATIONS)) {
    const blob = Object.values(TRANSLATIONS[lang]).join("\n");
    assert.equal(/raclette-original\.com/i.test(blob), false, lang);
  }
  const pages = fs.readFileSync("index.html", "utf8") + fs.readFileSync("pro-partnery.html", "utf8");
  assert.equal(/raclette-original\.com/i.test(pages), false);
  assert.match(TRANSLATIONS.cs["form.invite"], /formulář|zavolejte/);
  assert.match(TRANSLATIONS.cs["nav.franchise"], /Pro partnery/);
  assert.match(TRANSLATIONS.cs["app.cta"], /Raclette Lovers/);
  assert.match(TRANSLATIONS.cs["app.how.ios"], /Safari/);
  assert.match(TRANSLATIONS.cs["app.how.android"], /Chrome/);
  assert.match(TRANSLATIONS.sk["app.open"], /Otvoriť/);
  assert.match(TRANSLATIONS.en["app.install"], /Home screen/);
  assert.match(TRANSLATIONS.cs["app.install"], /Na plochu telefonu/);
  assert.match(TRANSLATIONS.fr["app.website"], /Notre site/);
  assert.match(TRANSLATIONS.cs["aop.title"], /AOP/);
  assert.match(TRANSLATIONS.cs["aop.body"], /Appellation d’Origine Protégée/);
  assert.match(TRANSLATIONS.cs["supplier"], /mlékárny Laiterie d’Orsières/);
  assert.match(TRANSLATIONS.cs["supplier.brand"], /designová značka mlékárny z Valais/);
  assert.equal(/Laterie/i.test(Object.values(TRANSLATIONS.cs).join("\n")), false);
  const franchiseBlob = Object.entries(TRANSLATIONS.cs).filter(([key]) => key.startsWith("franchise.")).map(([, value]) => value).join("\n");
  assert.equal(/nalák/i.test(franchiseBlob), false);
  assert.equal(/\d+\s*(Kč|EUR|CHF|€|%)/.test(franchiseBlob), false);
  assert.match(TRANSLATIONS.cs["shop.party.d"], /Podívejte se na náš e-shop/);
  assert.match(TRANSLATIONS.cs["shop.party.d"], /dřevěné výrobky na míru/);
  assert.equal(/rakletovací stoly/.test(TRANSLATIONS.cs["shop.party.d"]), false);
  assert.match(TRANSLATIONS.cs["shop.cheese.t"], /Raclette sýry/);
  assert.match(TRANSLATIONS.cs["shop.grills.t"], /Raclette grily a příslušenství/);
  assert.match(TRANSLATIONS.cs["shop.custom.t"], /TTM na míru/);
  assert.match(TRANSLATIONS.cs["shop.spice.t"], /Raclette koření/);
  assert.match(TRANSLATIONS.cs["shop.rent.t"], /Sýrová půjčovna/);
  assert.match(TRANSLATIONS.cs["shop.wine.t"], /Švýcarská vína/);
  assert.match(TRANSLATIONS.cs["shop.fondue.t"], /Fondue/);
  assert.match(TRANSLATIONS.cs["shop.wood.t"], /Family WOOD/);
  assert.match(TRANSLATIONS.cs["shop.wood.t"], /řemeslná elegance/);
  assert.match(TRANSLATIONS.cs["shop.wood.t"], /dřevěné výrobky na míru/);
  assert.equal(/rakletovací stoly/.test(TRANSLATIONS.cs["shop.wood.t"]), false);
  assert.match(TRANSLATIONS.en["shop.party.d"], /shop/);
  assert.match(TRANSLATIONS.cs["person.martin.role"], /IT specialista/);
  assert.match(TRANSLATIONS.cs["raclette.lead"], /fondue/);
  assert.match(TRANSLATIONS.cs["raclette.name"], /racler/);
  assert.match(TRANSLATIONS.cs["raclette.quality"], /Laiterie d’Orsières/);
  assert.match(TRANSLATIONS.cs["raclette.stat4d"], /18 milionů/);
  assert.equal(/36 milion/.test(Object.values(TRANSLATIONS.cs).join("\n")), false);
  assert.match(TRANSLATIONS.cs["shop.rent.d"], /rakler/);
  assert.equal(TRANSLATIONS.cs["events.title"], "Od malých oslav po festivaly s tisíci lidmi");
  assert.match(TRANSLATIONS.cs["events.lead"], /narozenin/);
  assert.match(TRANSLATIONS.cs["events.lead"], /tisíci a více lidmi/);
  assert.match(TRANSLATIONS.cs["hero.lead"], /autentický a originální švýcarský raclette/);
  assert.match(TRANSLATIONS.cs["hero.lead"], /sýry nejvyšší a originální kvality/);
  assert.match(TRANSLATIONS.cs["hero.lead"], /původních švýcarských receptur/);
  assert.match(TRANSLATIONS.cs["pitch.lead"], /původních švýcarských receptur/);
  assert.match(TRANSLATIONS.cs["franchise.lead"], /autentický a originální švýcarský raclette/);
  assert.match(TRANSLATIONS.cs["franchise.g2d"], /původních švýcarských receptur/);
  assert.match(TRANSLATIONS.sk["events.title"], /tisíckami/);
  assert.match(TRANSLATIONS.en["events.title"], /thousands/);
  assert.match(TRANSLATIONS.cs["events.e2"], /brunch/i);
  assert.match(TRANSLATIONS.cs["events.e3"], /kolaudace/i);
  assert.match(TRANSLATIONS.cs["events.book"], /Zavolejte nám/);
  assert.equal(/Otýpkov/.test(TRANSLATIONS.cs["events.book"]), false);
  assert.match(TRANSLATIONS.cs["events.book"], /párty/);
  assert.equal(TRANSLATIONS.cs["events.call"], "Zavolat +420 777 600 223");
  assert.equal(TRANSLATIONS.cs["events.galleryTitle"], "Kde se už na švýcarský raklet stála fronta");
  assert.match(TRANSLATIONS.cs["events.galleryLead"], /ochutnat/);
  assert.match(TRANSLATIONS.cs["events.note"], /Zavolejte/);
  assert.match(TRANSLATIONS.en["events.galleryTitle"], /queue/);
  assert.match(TRANSLATIONS.sk["events.galleryLead"], /ochutnať/);
  assert.equal(Object.hasOwn(TRANSLATIONS.cs, "events.chameleon"), false);
  assert.equal(Object.hasOwn(TRANSLATIONS.cs, "events.when"), false);
  assert.match(TRANSLATIONS.cs["shop.partners"], /Raclette House/);
  assert.match(TRANSLATIONS.cs["person.kabrt.role"], /raclette show/);
  assert.match(TRANSLATIONS.cs["person.eliska.role"], /eventů/);
  assert.match(TRANSLATIONS.cs["person.pavlina.role"], /Manažerka projektů/);
  assert.equal(TRANSLATIONS.cs["contact.billingLabel"], "Sídlo firmy a fakturační adresa");
  assert.equal(TRANSLATIONS.en["contact.billingLabel"], "Registered office and billing address");
  assert.equal(Object.hasOwn(TRANSLATIONS.cs, "contact.deliveryLabel"), false);
  assert.match(TRANSLATIONS.en["nav.raclette"], /raclette/i);
  assert.match(TRANSLATIONS.sk["person.martin.role"], /IT špecialista/);
  assert.match(TRANSLATIONS.en["person.martin.role"], /IT specialist/);
  assert.match(TRANSLATIONS.cs["celeb.title"], /Celebrity a náš Raclette/);
  assert.equal(TRANSLATIONS.cs["celeb.fb"], "Sledujte naše aktuality");
  assert.match(TRANSLATIONS.cs["celeb.klus.alt"], /Tomáš Klus/);
  assert.match(TRANSLATIONS.en["celeb.fb"], /Follow our news/);
  assert.equal(Object.hasOwn(TRANSLATIONS.cs, "celeb.lead"), false);
  assert.equal(TRANSLATIONS.cs["tl7t"], "Pobočky Raclette Point Original");
  assert.match(TRANSLATIONS.cs["tl7d"], /Česku/);
  assert.match(TRANSLATIONS.cs["tl7d"], /Švýcarsku/);
  assert.equal(TRANSLATIONS.cs["tl7.czUnit"], "poboček");
  assert.equal(TRANSLATIONS.cs["tl7.chUnit"], "pobočky");
  assert.match(TRANSLATIONS.en["tl7t"], /branches/);
  assert.match(TRANSLATIONS.sk["tl7.czUnit"], /pobočiek/);
  const story = fs.readFileSync("index.html", "utf8");
  assert.match(story, /2025–2026/);
  assert.match(story, /class="tl-count"[\s\S]*?<strong>5<\/strong>/);
  assert.match(story, /class="tl-count"[\s\S]*?<strong>3<\/strong>/);
  assert.match(TRANSLATIONS.cs["footer.rights"], /Web vyvinul Martin Šimůnek/);
  assert.match(TRANSLATIONS.sk["footer.rights"], /Web vyvinul Martin Šimůnek/);
  assert.match(TRANSLATIONS.en["footer.rights"], /Website developed by Martin Šimůnek/);
  assert.match(TRANSLATIONS.fr["footer.rights"], /Site développé par Martin Šimůnek/);
  assert.match(TRANSLATIONS.de["footer.rights"], /Website entwickelt von Martin Šimůnek/);
  assert.match(TRANSLATIONS.it["footer.rights"], /Sito sviluppato da Martin Šimůnek/);
  assert.match(TRANSLATIONS.pl["footer.rights"], /Stronę opracował Martin Šimůnek/);
  assert.match(TRANSLATIONS.es["footer.rights"], /Sitio desarrollado por Martin Šimůnek/);
  assert.match(TRANSLATIONS.ru["footer.rights"], /Сайт разработал Martin Šimůnek/);
});

test("hlášky k poloze jsou krátké a na telefonu žádají GPS", () => {
  const { TRANSLATIONS } = loadTranslations();
  for (const lang of Object.keys(TRANSLATIONS)) {
    assert.match(TRANSLATIONS[lang]["points.needGps"], /GPS|IP/i);
    assert.ok(TRANSLATIONS[lang]["points.found"].length < 80, lang + " found");
    assert.ok(TRANSLATIONS[lang]["points.foundIp"].length < 220, lang + " foundIp");
    assert.ok(TRANSLATIONS[lang]["points.needGps"].length < 280, lang + " needGps");
  }
  assert.match(TRANSLATIONS.cs["points.needGps"], /Android/);
  assert.match(TRANSLATIONS.cs["points.timeout"], /GPS se nenačetla včas/);
});

test("každý data-i18n klíč ze stránky je přeložený", () => {
  const { TRANSLATIONS } = loadTranslations();
  const html = fs.readFileSync("index.html", "utf8") + fs.readFileSync("pro-partnery.html", "utf8") + fs.readFileSync("app.html", "utf8");
  const used = [...html.matchAll(/data-i18n(?:-alt|-title)?="([^"]+)"/g)].map((match) => match[1]);
  const missing = [...new Set(used)].filter((key) => !TRANSLATIONS.cs[key]);
  assert.deepEqual(missing, []);
});
