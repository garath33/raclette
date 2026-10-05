const test = require("node:test");
const assert = require("node:assert/strict");
const site = require("../../js/site");

test("github.io zůstává zkušební a raclettelovers.com je ostrý web", () => {
  assert.equal(site.isStagingHost("garath33.github.io"), true);
  assert.equal(site.isStagingHost("raclettelovers.com"), false);
  assert.equal(site.isStagingHost("www.raclettelovers.com"), false);
  assert.equal(site.isStagingHost("localhost"), true);
});

test("na raclettelovers.com je výchozí angličtina, jinde se jazyk nevnucuje", () => {
  assert.equal(site.defaultLanguage("raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("www.raclettelovers.com"), "en");
  assert.equal(site.defaultLanguage("garath33.github.io"), null);
  assert.equal(site.defaultLanguage("raclettelovers.cz"), null);
});
