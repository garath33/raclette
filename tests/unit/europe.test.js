const test = require("node:test");
const assert = require("node:assert/strict");
const europe = require("../../js/europe");
const { POINTS } = require("../../js/points");

test("české Pointy i Švýcarsko leží uvnitř výřezu mapy", () => {
  for (const point of POINTS) {
    const pos = europe.project(point.lat, point.lng);
    assert.ok(pos.x > 40 && pos.x < europe.VIEW.width - 40, point.id);
    assert.ok(pos.y > 40 && pos.y < europe.VIEW.height - 40, point.id);
  }
  const swiss = europe.COUNTRIES.find((country) => country.id === "ch");
  const czech = europe.COUNTRIES.find((country) => country.id === "cz");
  assert.equal(swiss.interactive, true);
  assert.equal(czech.interactive, true);
  assert.ok(swiss.d.length > 100);
  const mark = europe.project(46.72, 7.46);
  assert.ok(Math.abs(mark.x - swiss.label[0]) < 8);
  assert.ok(Math.abs(mark.y - swiss.label[1]) < 8);
  assert.ok(swiss.label[0] < europe.VIEW.width / 2);
  assert.ok(swiss.label[1] > europe.VIEW.height / 2);
  const names = europe.CITIES.map((city) => city.name);
  for (const name of ["Praha", "Brno", "Bern", "Bratislava", "Vídeň", "Budapešť"]) {
    assert.ok(names.includes(name), name);
  }
  for (const name of ["Opava", "Ostrava", "Poprad", "Curych", "Mnichov", "Krakov"]) {
    assert.equal(names.includes(name), false, name);
  }
  for (const city of europe.CITIES) {
    const pos = europe.project(city.lat, city.lng);
    assert.ok(pos.x > 15 && pos.x < europe.VIEW.width - 8, city.name);
    assert.ok(pos.y > 15 && pos.y < europe.VIEW.height - 8, city.name);
  }
});

test("cameraFor automaticky vycentruje každý stát výškově i vodorovně s bezpečným odstupem od okraje bochníku", () => {
  for (const country of europe.COUNTRIES) {
    const cam = europe.cameraFor(country.id);
    const b = cam.bounds;
    const minXPct = cam.leftPct + (b.minX / europe.VIEW.width) * cam.widthPct;
    const maxXPct = cam.leftPct + (b.maxX / europe.VIEW.width) * cam.widthPct;
    const midXPct = (minXPct + maxXPct) / 2;
    const minYPct = cam.topPct + (b.minY / europe.VIEW.height) * cam.heightPct;
    const maxYPct = cam.topPct + (b.maxY / europe.VIEW.height) * cam.heightPct;
    const midYPct = (minYPct + maxYPct) / 2;
    assert.ok(Math.abs(midXPct - 50) < 0.05, country.id + " midX=" + midXPct);
    assert.ok(Math.abs(midYPct - 44) < 0.05, country.id + " midY=" + midYPct);
    assert.ok(minXPct >= 31 && maxXPct <= 69, country.id + " X range");
    assert.ok(minYPct >= 29 && maxYPct <= 59, country.id + " Y range");
    for (const [x, y] of b.points) {
      const cx = cam.leftPct + (x / europe.VIEW.width) * cam.widthPct;
      const cy = cam.topPct + (y / europe.VIEW.height) * cam.heightPct;
      const rindRatio = Math.hypot((cx - 50) / 50, (cy - 24.2) / 75.8);
      assert.ok(rindRatio < 0.52, country.id + " vertex distance to rind=" + rindRatio);
    }
  }
});
