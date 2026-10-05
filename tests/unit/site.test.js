const test = require("node:test");
const assert = require("node:assert/strict");
const site = require("../../js/site");

const loc = (hostname, extra) => Object.assign({
  hostname,
  origin: hostname.endsWith("github.io") ? "https://" + hostname : "https://" + hostname,
  pathname: hostname.endsWith("github.io") ? "/raclette/" : "/",
  hash: ""
}, extra);

test("github.io i raclettelovers.* zůstávají zkušební, dokud není ostrý souhlas", () => {
  assert.equal(site.isStagingHost("garath33.github.io"), true);
  assert.equal(site.isStagingHost("raclettelovers.com"), true);
  assert.equal(site.isStagingHost("www.raclettelovers.com"), true);
  assert.equal(site.isStagingHost("raclettelovers.cz"), true);
  assert.equal(site.isStagingHost("www.raclettelovers.sk"), true);
  assert.equal(site.isStagingHost("raclettelovers.ch"), true);
  assert.equal(site.isStagingHost("localhost"), true);
  assert.equal(site.isPreviewHost("127.0.0.1"), true);
  assert.equal(site.isPreviewHost("raclettelovers.com"), false);
});

test("výchozí jazyk se bere z kanonické domény", () => {
  assert.equal(site.defaultLanguage("raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("www.raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("raclettelovers.cz"), "cs");
  assert.equal(site.defaultLanguage("www.raclettelovers.cz"), "cs");
  assert.equal(site.defaultLanguage("raclettelovers.sk"), "sk");
  assert.equal(site.defaultLanguage("raclettelovers.ch"), "de");
  assert.equal(site.defaultLanguage("garath33.github.io"), null);
});

test("na .ch se z prohlížeče bere jen němčina, francouzština nebo italština", () => {
  assert.equal(site.preferredLanguage("raclettelovers.ch", "fr-CH"), "fr");
  assert.equal(site.preferredLanguage("raclettelovers.ch", "it-IT"), "it");
  assert.equal(site.preferredLanguage("raclettelovers.ch", "de-DE"), "de");
  assert.equal(site.preferredLanguage("raclettelovers.ch", "cs-CZ"), "de");
  assert.equal(site.preferredLanguage("raclettelovers.cz", "sk-SK"), "cs");
  assert.equal(site.preferredLanguage("raclettelovers.com", "pl-PL"), "pl");
  assert.equal(site.preferredLanguage("raclettelovers.com", "de-DE"), "en");
});

test("přepínač jazyka na ostré doméně skáče na kanonický hostitel", () => {
  assert.equal(site.languageUrl("cs", loc("raclettelovers.com")), "https://raclettelovers.cz/");
  assert.equal(site.languageUrl("sk", loc("raclettelovers.cz")), "https://raclettelovers.sk/");
  assert.equal(site.languageUrl("en", loc("raclettelovers.cz")), "https://raclettelovers.com/");
  assert.equal(site.languageUrl("de", loc("raclettelovers.com")), "https://raclettelovers.ch/");
  assert.equal(site.languageUrl("fr", loc("raclettelovers.ch")), "https://raclettelovers.ch/?lang=fr");
  assert.equal(site.languageUrl("pl", loc("raclettelovers.cz")), "https://raclettelovers.com/?lang=pl");
  assert.equal(site.languageUrl("cs", loc("garath33.github.io")), "https://garath33.github.io/raclette/?lang=cs");
  assert.equal(site.languageUrl("de", loc("127.0.0.1", { origin: "http://127.0.0.1:4173", pathname: "/" })), "http://127.0.0.1:4173/?lang=de");
});

test("výchozí jazyk hostitele nemá v adrese ?lang=", () => {
  assert.equal(site.languageUrl("en", loc("raclettelovers.com")), "https://raclettelovers.com/");
  assert.equal(site.languageUrl("cs", loc("raclettelovers.cz")), "https://raclettelovers.cz/");
  assert.equal(site.languageUrl("sk", loc("raclettelovers.sk")), "https://raclettelovers.sk/");
  assert.equal(site.languageUrl("de", loc("raclettelovers.ch")), "https://raclettelovers.ch/");
});

test("švýcarský hostitel značí jazyk jako de-CH a localStorage cizího jazyka se na .cz nebere", () => {
  assert.equal(site.htmlLang("de", "raclettelovers.ch"), "de-CH");
  assert.equal(site.htmlLang("fr", "www.raclettelovers.ch"), "fr-CH");
  assert.equal(site.htmlLang("de", "raclettelovers.com"), "de");
  assert.equal(site.ogLocale("de", "raclettelovers.ch"), "de_CH");
  assert.equal(site.ogLocale("de", "raclettelovers.com"), "de_DE");
  assert.equal(site.isNativeLanguage("raclettelovers.cz", "cs"), true);
  assert.equal(site.isNativeLanguage("raclettelovers.cz", "en"), false);
  assert.equal(site.isNativeLanguage("raclettelovers.ch", "fr"), true);
});
