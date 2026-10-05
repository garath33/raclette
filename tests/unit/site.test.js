const test = require("node:test");
const assert = require("node:assert/strict");
const site = require("../../js/site");

const loc = (hostname, extra) => Object.assign({
  hostname,
  origin: hostname === "127.0.0.1" ? "http://127.0.0.1:4173" : "https://" + hostname,
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

test("koncovka drží tržní jazyk, když návštěvník zemi neprozradí", () => {
  assert.equal(site.defaultLanguage("raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("www.raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("raclettelovers.cz"), "cs");
  assert.equal(site.defaultLanguage("raclettelovers.sk"), "sk");
  assert.equal(site.defaultLanguage("raclettelovers.ch"), "de");
  assert.equal(site.defaultLanguage("garath33.github.io"), null);
});

test("výchozí jazyk se bere ze státu v locale prohlížeče, na každé doméně", () => {
  assert.equal(site.languageFromLocales("cs-CZ"), "cs");
  assert.equal(site.languageFromLocales("sk-SK"), "sk");
  assert.equal(site.languageFromLocales("de-CH"), "de");
  assert.equal(site.languageFromLocales("fr-CH"), "fr");
  assert.equal(site.languageFromLocales("it-CH"), "it");
  assert.equal(site.languageFromLocales("de-DE"), "de");
  assert.equal(site.languageFromLocales("pl-PL"), "pl");
  assert.equal(site.languageFromLocales("en-US"), "en");
  assert.equal(site.languageFromLocales(["sk-SK", "cs"]), "sk");
  assert.equal(site.languageFromLocales("ja-JP"), null);
  assert.equal(site.preferredLanguage("raclettelovers.com", "cs-CZ"), "cs");
  assert.equal(site.preferredLanguage("raclettelovers.cz", "de-DE"), "de");
  assert.equal(site.preferredLanguage("raclettelovers.ch", "pl-PL"), "pl");
  assert.equal(site.preferredLanguage("raclettelovers.com", "ja-JP"), "en");
  assert.equal(site.preferredLanguage("garath33.github.io", ""), "cs");
});

test("přepínač jazyka zůstane na stejné doméně a nabídne všechny jazyky", () => {
  assert.equal(site.languageUrl("cs", loc("raclettelovers.com")), "https://raclettelovers.com/?lang=cs");
  assert.equal(site.languageUrl("de", loc("raclettelovers.cz")), "https://raclettelovers.cz/?lang=de");
  assert.equal(site.languageUrl("pl", loc("www.raclettelovers.ch")), "https://www.raclettelovers.ch/?lang=pl");
  assert.equal(site.languageUrl("sk", loc("raclettelovers.sk")), "https://raclettelovers.sk/?lang=sk");
  assert.equal(site.languageUrl("cs", loc("garath33.github.io")), "https://garath33.github.io/raclette/?lang=cs");
  assert.equal(site.languageUrl("de", loc("127.0.0.1")), "http://127.0.0.1:4173/?lang=de");
  assert.equal(site.isNativeLanguage("raclettelovers.cz", "en"), true);
  assert.equal(site.isNativeLanguage("raclettelovers.ch", "pl"), true);
});

test("švýcarský hostitel značí de/fr/it jako CH variantu", () => {
  assert.equal(site.htmlLang("de", "raclettelovers.ch"), "de-CH");
  assert.equal(site.htmlLang("fr", "www.raclettelovers.ch"), "fr-CH");
  assert.equal(site.htmlLang("pl", "raclettelovers.ch"), "pl");
  assert.equal(site.htmlLang("de", "raclettelovers.com"), "de");
  assert.equal(site.ogLocale("de", "raclettelovers.ch"), "de_CH");
  assert.equal(site.ogLocale("de", "raclettelovers.com"), "de_DE");
});
