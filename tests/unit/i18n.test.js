const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadTranslations() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("js/i18n.js", "utf8") + "\nglobalThis.TRANSLATIONS = TRANSLATIONS;\nglobalThis.LANGS = LANGS;", context);
  vm.runInContext(fs.readFileSync("js/i18n-extra.js", "utf8"), context);
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
  assert.match(TRANSLATIONS.cs["person.martin.role"], /IT specialista/);
  assert.match(TRANSLATIONS.sk["person.martin.role"], /IT špecialista/);
  assert.match(TRANSLATIONS.en["person.martin.role"], /IT specialist/);
});

test("každý data-i18n klíč ze stránky je přeložený", () => {
  const { TRANSLATIONS } = loadTranslations();
  const html = fs.readFileSync("index.html", "utf8");
  const used = [...html.matchAll(/data-i18n(?:-alt|-title)?="([^"]+)"/g)].map((match) => match[1]);
  const missing = [...new Set(used)].filter((key) => !TRANSLATIONS.cs[key]);
  assert.deepEqual(missing, []);
});
