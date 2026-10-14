const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const geo = require("../../js/geo");
const { POINTS, PENDING, placesFor, homeCountry, branchCount } = require("../../js/points");

test("vzdálenost na rovníku o jeden stupeň je asi 111 km", () => {
  const km = geo.haversine(0, 0, 0, 1);
  assert.ok(km > 110 && km < 112, km);
});

test("z Kladna je nejbližší food truck, z Jeseníku Křížový vrch", () => {
  const kladno = geo.nearest(POINTS, 50.1466, 14.1026);
  const jesenik = geo.nearest(POINTS, 50.23, 17.22);
  assert.equal(kladno.id, "kabrt");
  assert.equal(jesenik.id, "krizovy");
  assert.ok(geo.haversine(50.1466, 14.1026, kladno.lat, kladno.lng) < 1);
});

test("body Pointů mají souřadnice a Křížový vrch má web", () => {
  assert.equal(POINTS.length, 8);
  for (const point of POINTS) {
    assert.equal(typeof point.lat, "number");
    assert.equal(typeof point.lng, "number");
    assert.ok(point.country === "cz" || point.country === "ch");
  }
  assert.equal(POINTS.find((point) => point.id === "krizovy").web, "https://krizovyvrch.cz/cs");
  assert.equal(POINTS.find((point) => point.id === "spindl").web, null);
  assert.equal(POINTS.find((point) => point.id === "eddy").web, "https://eddy-baillifard.com");
  assert.equal(POINTS.find((point) => point.id === "orsieres").web, "https://laiterie-orsieres.ch");
  assert.equal(POINTS.find((point) => point.id === "mouret").web, "https://www.laiterie-du-mouret.ch");
  assert.equal(POINTS.find((point) => point.id === "minorit").web, "https://minorit-opava.cz/kavarna/");
  assert.equal(POINTS.find((point) => point.id === "bonte").web, "https://bontesyry.cz");
});

test("švýcarské Pointy mají zemi a z Curychu vychází švýcarský Point", () => {
  assert.equal(PENDING.length, 0);
  assert.equal(placesFor("cz").points.length, 5);
  assert.equal(placesFor("ch").points.length, 3);
  assert.equal(branchCount("cz"), 5);
  assert.equal(branchCount("ch"), 3);
  assert.equal(homeCountry("raclettelovers.ch"), "ch");
  assert.equal(homeCountry("www.raclettelovers.ch"), "ch");
  assert.equal(homeCountry("raclettelovers.cz"), "cz");
  assert.equal(homeCountry("localhost"), "cz");
  assert.equal(geo.nearest(POINTS, 47.37, 8.54).country, "ch");
});

test("mapsDirUrl má jen destination, žádný zmražený origin", () => {
  const point = POINTS.find((item) => item.id === "kabrt");
  const url = geo.mapsDirUrl(point);
  assert.match(url, /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
  assert.match(url, /destination=50\.1466053%2C14\.1026398/);
  assert.match(url, /travelmode=driving/);
  assert.match(url, /dir_action=navigate/);
  assert.equal(/[?&]origin=/.test(url), false);
});

test("z Prahy je food truck, ze Špindlu Špindlerův Mlýn", () => {
  const praha = geo.nearest(POINTS, 50.0875, 14.4213);
  const spindl = geo.nearest(POINTS, 50.7256, 15.6068);
  assert.equal(praha.id, "kabrt");
  assert.equal(spindl.id, "spindl");
});

test("ze Záběhlic je food truck, Beroun je těsně druhý", () => {
  // Trenčínská 2628/10, RÚIAN. Pin z Google Maps na notebooku: 50.0518466,14.4857067.
  const trencinska = { lat: 50.045505, lng: 14.4731025 };
  const hamersky = { lat: 50.0518466, lng: 14.4857067 };
  const offsetKm = geo.haversine(trencinska.lat, trencinska.lng, hamersky.lat, hamersky.lng);
  assert.ok(offsetKm > 1 && offsetKm < 1.3, offsetKm);

  for (const fix of [trencinska, hamersky]) {
    const ranked = geo.rank(POINTS, fix.lat, fix.lng);
    assert.equal(ranked[0].point.id, "kabrt");
    assert.equal(ranked[1].point.id, "bonte");
    assert.equal(geo.nearest(POINTS, fix.lat, fix.lng).id, "kabrt");
    assert.ok(ranked[0].km > 25 && ranked[0].km < 35, ranked[0].km);
    const gap = ranked[1].km - ranked[0].km;
    assert.ok(gap > 0.5 && gap < 3, gap);
    assert.equal(geo.readingKind(POINTS, fix.lat, fix.lng, 30), "precise");
    assert.equal(geo.nearestIsStable(POINTS, fix.lat, fix.lng, offsetKm * 1000), false);
    assert.equal(geo.readingKind(POINTS, fix.lat, fix.lng, offsetKm * 1000), "uncertain");
  }
});

test("každý Point má v kartě adresu", () => {
  const app = fs.readFileSync("js/app.js", "utf8");
  const block = app.slice(app.indexOf("const addresses = {"), app.indexOf("return '<p class=\"address\">'"));
  for (const point of POINTS) {
    assert.match(block, new RegExp("\\b" + point.id + ": \"[^\"]+\""));
  }
});

test("nové pobočky vyhrávají u svých dveří", () => {
  assert.equal(geo.nearest(POINTS, 46.0632584, 7.2161147).id, "eddy");
  assert.equal(geo.nearest(POINTS, 46.0409525, 7.1467833).id, "orsieres");
  assert.equal(geo.nearest(POINTS, 46.7450192, 7.1714657).id, "mouret");
  assert.equal(geo.nearest(POINTS, 49.9361636, 17.9036825).id, "minorit");
  assert.equal(geo.nearest(POINTS, 49.9638485, 14.0741966).id, "bonte");
});

test("nejistý výběr, když přesnost spolkne odstup druhého Pointu", () => {
  const close = [
    { id: "a", lat: 50, lng: 14 },
    { id: "b", lat: 50.001, lng: 14 }
  ];
  assert.equal(geo.nearest(close, 50, 14).id, "a");
  assert.equal(geo.nearestIsStable(close, 50, 14, 20), true);
  assert.equal(geo.nearestIsStable(close, 50, 14, 500), false);
  assert.equal(geo.readingKind(close, 50, 14, 20), "precise");
  assert.equal(geo.readingKind(close, 50, 14, 500), "uncertain");
  assert.equal(geo.readingKind(POINTS, 50.045505, 14.4731025, null), "precise");
});
