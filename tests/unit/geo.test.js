const test = require("node:test");
const assert = require("node:assert/strict");
const geo = require("../../js/geo");
const { POINTS } = require("../../js/points");

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
  assert.equal(POINTS.length, 3);
  for (const point of POINTS) {
    assert.equal(typeof point.lat, "number");
    assert.equal(typeof point.lng, "number");
  }
  assert.equal(POINTS.find((point) => point.id === "krizovy").web, "https://krizovyvrch.cz/cs");
  assert.equal(POINTS.find((point) => point.id === "spindl").web, null);
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
