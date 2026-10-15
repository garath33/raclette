const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const europe = require("../../js/europe");
const { POINTS, flagSvg, branchFlag } = require("../../js/points");

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

test("vlajka na kartě pobočky je stejná kresba jako nad bochníkem", () => {
  const cz = flagSvg("cz");
  const ch = flagSvg("ch");
  assert.match(cz, /class="flag-svg"/);
  assert.match(cz, /viewBox="0 0 60 40"/);
  assert.match(cz, /#11457e/);
  assert.match(cz, /#d7141a/);
  assert.match(ch, /viewBox="0 0 32 32"/);
  assert.match(ch, /#da291c/);
  assert.match(ch, /x="13" y="6"/);
  assert.equal(flagSvg("sk"), "");
  const marked = branchFlag("ch", 'Švýcarsko & "CH"');
  assert.match(marked, /class="card-flag"/);
  assert.match(marked, /aria-label="Švýcarsko &amp; &quot;CH&quot;"/);
  assert.ok(marked.includes(ch));
  const europeSrc = fs.readFileSync("js/europe.js", "utf8");
  assert.match(europeSrc, /RaclettePoints\.flagSvg\(id\)/);
  assert.equal(europeSrc.includes("flag-svg"), false);
  for (const file of ["js/app.js", "js/lovers-app.js"]) {
    assert.match(fs.readFileSync(file, "utf8"), /RaclettePoints\.branchFlag\(point\.country, t\("map\.country\." \+ point\.country\)\)/);
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
    assert.ok(Math.abs(midYPct - 38.5) < 0.05, country.id + " midY=" + midYPct);
    assert.ok(minXPct >= 26 && maxXPct <= 74, country.id + " X range");
    assert.ok(minYPct >= 19.5 && maxYPct <= 57.5, country.id + " Y range");
    for (const [x, y] of b.points) {
      const cx = cam.leftPct + (x / europe.VIEW.width) * cam.widthPct;
      const cy = cam.topPct + (y / europe.VIEW.height) * cam.heightPct;
      const rindRatio = Math.hypot((cx - 50) / 50, (cy - 24.2) / 75.8);
      assert.ok(rindRatio < 0.62, country.id + " vertex distance to rind=" + rindRatio);
    }
  }
});
