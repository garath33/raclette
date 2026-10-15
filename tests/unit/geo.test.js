const test = require("node:test");
const assert = require("node:assert/strict");
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

test("mapsDirUrl má jen cíl, hrubý bod v centru Prahy se nestane adresou startu", () => {
  const point = POINTS.find((item) => item.id === "kabrt");
  const bare = geo.mapsDirUrl(point);
  assert.match(bare, /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
  assert.match(bare, /destination=50\.1466053%2C14\.1026398/);
  assert.match(bare, /travelmode=driving/);
  assert.equal(/dir_action=navigate/.test(bare), false);
  assert.equal(/[?&]origin=/.test(bare), false);
  // 50.080804,14.42076 je hrubý bod u Staroměstského náměstí. Maps z něj udělaly pragERLEBNIS.
  const url = geo.mapsDirUrl(point, { lat: 50.080804, lng: 14.42076 });
  assert.equal(/[?&]origin=/.test(url), false);
  assert.equal(url.includes("50.080804"), false);
  assert.match(url, /destination=50\.1466053%2C14\.1026398/);
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
  for (const point of POINTS) {
    assert.equal(typeof point.address, "string");
    assert.notEqual(point.address.trim(), "");
  }
});

test("nové pobočky vyhrávají u svých dveří", () => {
  assert.equal(geo.nearest(POINTS, 46.0632584, 7.2161147).id, "eddy");
  assert.equal(geo.nearest(POINTS, 46.0409525, 7.1467833).id, "orsieres");
  assert.equal(geo.nearest(POINTS, 46.7450192, 7.1714657).id, "mouret");
  assert.equal(geo.nearest(POINTS, 49.9361636, 17.9036825).id, "minorit");
  assert.equal(geo.nearest(POINTS, 49.9638485, 14.0741966).id, "bonte");
});

test("Zličín je dál od Hamerského rybníka, než aby šlo o stejné místo", () => {
  const pond = { lat: 50.0518466, lng: 14.4857067 };
  const zlicin = { lat: 50.0535, lng: 14.3062 };
  const gap = geo.haversine(pond.lat, pond.lng, zlicin.lat, zlicin.lng);
  assert.ok(gap > geo.STALE_KM, gap);
  assert.equal(geo.nearest(POINTS, zlicin.lat, zlicin.lng).id, "kabrt");
});

test("starý pin u Hamerského rybníka neporazí aktuální IP na Zličíně", () => {
  const pond = { lat: 50.0518466, lng: 14.4857067, accuracy: 1500, fresh: true, source: "browser" };
  const zlicin = { lat: 50.0535, lng: 14.3062, accuracy: 20000, source: "ip" };
  const chosen = geo.chooseFix(pond, zlicin);
  assert.equal(chosen.source, "ip");
  assert.equal(chosen.lat, zlicin.lat);
  assert.equal(chosen.lng, zlicin.lng);
  assert.ok(chosen.staleKm > geo.STALE_KM);
  const info = geo.describeFix(POINTS, chosen);
  assert.equal(info.key, "points.foundStale");
  assert.equal(info.nearest.id, "kabrt");
});

test("odchylka o kilometr v Záběhlicích zůstane, když je IP blízko", () => {
  const pond = { lat: 50.0518466, lng: 14.4857067, accuracy: 1500, fresh: true };
  const trencinska = { lat: 50.045505, lng: 14.4731025, accuracy: 20000 };
  const chosen = geo.chooseFix(pond, trencinska);
  assert.equal(chosen.source, "browser");
  assert.equal(chosen.lat, pond.lat);
});

test("vypnutá poloha bere IP a starý časový pin se nepoužije", () => {
  const ip = { lat: 50.0535, lng: 14.3062, accuracy: 20000 };
  assert.equal(geo.chooseFix(null, ip).source, "ip");
  assert.equal(geo.describeFix(POINTS, geo.chooseFix(null, ip)).key, "points.foundIp");
  const stale = { lat: 50.0518466, lng: 14.4857067, accuracy: 1500, fresh: false };
  const chosen = geo.chooseFix(stale, ip);
  assert.equal(chosen.source, "ip");
  assert.equal(chosen.lat, ip.lat);
  assert.equal(geo.chooseFix(stale, null), null);
  const now = 1700000000000;
  assert.equal(geo.isFreshTimestamp(now - 30000, now), true);
  assert.equal(geo.isFreshTimestamp(now - 3 * 60 * 1000, now), false);
  assert.equal(geo.isFreshTimestamp(undefined, now), false);
  const fresh = geo.browserFix({
    timestamp: now,
    coords: { latitude: 50.0535, longitude: 14.3062, accuracy: 40 }
  }, now);
  assert.equal(fresh.fresh, true);
  assert.equal(fresh.source, "browser");
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

test("telefon pozná Android, iPhone i iPad předstírající Mac", () => {
  assert.equal(geo.isMobileDevice({ mobile: true }), true);
  assert.equal(geo.isMobileDevice({ mobile: false }), false);
  assert.equal(geo.isMobileDevice({
    navigator: { userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36" }
  }), true);
  assert.equal(geo.isMobileDevice({
    navigator: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" }
  }), true);
  assert.equal(geo.isMobileDevice({
    navigator: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", platform: "MacIntel", maxTouchPoints: 5 }
  }), true);
  assert.equal(geo.isMobileDevice({
    navigator: {
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      userAgentData: { mobile: true }
    }
  }), true);
  assert.equal(geo.isMobileDevice({
    navigator: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      userAgentData: { mobile: false }
    }
  }), false);
  assert.equal(geo.isMobileDevice({
    navigator: { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    matchMedia: () => ({ matches: false })
  }), false);
});

function deniedGeo() {
  return {
    getCurrentPosition(_ok, err) {
      err({ code: 1, message: "denied" });
    }
  };
}

function fixGeo(lat, lng, accuracy) {
  return {
    getCurrentPosition(ok) {
      ok({
        timestamp: Date.now(),
        coords: { latitude: lat, longitude: lng, accuracy: accuracy || 20 }
      });
    }
  };
}

function ipFetch(lat, lng) {
  return async () => ({
    ok: true,
    json: async () => ({ ok: true, lat, lng, accuracy: 20000 })
  });
}

test("telefon s vypnutou polohou nebere IP z Jeseníku", async () => {
  let fetched = 0;
  const result = await geo.acquireFix({
    geolocation: deniedGeo(),
    mobile: true,
    fetch: async () => {
      fetched += 1;
      return ipFetch(50.23, 17.22)();
    }
  });
  assert.equal(fetched, 0);
  assert.equal(result.fix, null);
  assert.equal(result.mobile, true);
  assert.equal(result.reason, "denied");
  assert.equal(geo.failureStatusKey(result), "points.needGps");
  assert.equal(geo.statusTone("points.needGps"), "need");
});

test("notebook s vypnutou polohou vezme IP na Zličíně", async () => {
  const result = await geo.acquireFix({
    geolocation: deniedGeo(),
    mobile: false,
    fetch: ipFetch(50.0535, 14.3062)
  });
  assert.equal(result.fix.source, "ip");
  assert.equal(result.mobile, false);
  assert.equal(geo.describeFix(POINTS, result.fix).nearest.id, "kabrt");
  assert.equal(geo.failureStatusKey(result), null);
});

test("telefon se zapnutou GPS na Zličíně vybere food truck i proti IP z Jeseníku", async () => {
  let fetched = 0;
  const result = await geo.acquireFix({
    geolocation: fixGeo(50.0535, 14.3062, 18),
    mobile: true,
    fetch: async () => {
      fetched += 1;
      return ipFetch(50.23, 17.22)();
    }
  });
  assert.equal(fetched, 0);
  assert.equal(result.fix.source, "browser");
  assert.equal(result.fix.lat, 50.0535);
  assert.equal(geo.describeFix(POINTS, result.fix).nearest.id, "kabrt");
  assert.notEqual(geo.describeFix(POINTS, result.fix).nearest.id, "krizovy");
});

test("timeout na telefonu nespustí IP odhad", async () => {
  const result = await geo.acquireFix({
    geolocation: {
      getCurrentPosition(_ok, err) {
        err({ code: 3, message: "timeout" });
      },
      watchPosition(_ok, err) {
        err({ code: 3, message: "timeout" });
        return 0;
      },
      clearWatch() {}
    },
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(result.fix, null);
  assert.equal(result.reason, "timeout");
  assert.equal(geo.failureStatusKey(result), "points.timeout");
});

test("Android Chrome po timeoutu vezme watchPosition", async () => {
  const result = await geo.acquireFix({
    geolocation: {
      getCurrentPosition(_ok, err) {
        err({ code: 3, message: "timeout" });
      },
      watchPosition(ok) {
        ok({
          timestamp: Date.now(),
          coords: { latitude: 50.0535, longitude: 14.3062, accuracy: 30 }
        });
        return 7;
      },
      clearWatch() {}
    },
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(result.fix.source, "browser");
  assert.equal(result.fix.lat, 50.0535);
  assert.equal(geo.describeFix(POINTS, result.fix).nearest.id, "kabrt");
});

test("telefon bez geolocation API neuhádne Point z IP", async () => {
  const result = await geo.acquireFix({
    geolocation: null,
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(result.fix, null);
  assert.equal(result.reason, "unsupported");
  assert.equal(geo.failureStatusKey(result), "points.unsupported");
});

test("po chybném denied z Androidu zkusí ještě hrubší odečet", async () => {
  let calls = 0;
  const result = await geo.acquireFix({
    geolocation: {
      getCurrentPosition(_ok, err) {
        calls += 1;
        if (calls === 1) err({ code: 1, message: "denied" });
        else {
          _ok({
            timestamp: Date.now(),
            coords: { latitude: 50.0535, longitude: 14.3062, accuracy: 30 }
          });
        }
      },
      watchPosition() {
        return 0;
      },
      clearWatch() {}
    },
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(calls, 2);
  assert.equal(result.fix.source, "browser");
  assert.equal(result.fix.lat, 50.0535);
});

test("Android WebView s časem 0 vrátí platný fix", async () => {
  const result = await geo.acquireFix({
    geolocation: {
      getCurrentPosition(ok) {
        ok({
          timestamp: 0,
          coords: { latitude: 50.0535, longitude: 14.3062, accuracy: 25 }
        });
      }
    },
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(result.fix.source, "browser");
  assert.equal(result.fix.lat, 50.0535);
});

test("instalovaná aplikace bez GPS ukáže návod do oprávnění aplikace", () => {
  const standalone = { matchMedia: (q) => ({ matches: /standalone|fullscreen/.test(q) }) };
  const result = { fix: null, reason: "denied", mobile: true };
  assert.equal(geo.failureStatusKey(result, standalone), "points.needGpsInstalled");
  assert.equal(geo.failureStatusKey(result), "points.needGps");
});

test("starý pin na telefonu se nahradí požadavkem na GPS, ne IP", async () => {
  const now = Date.now();
  const result = await geo.acquireFix({
    geolocation: {
      getCurrentPosition(ok) {
        ok({
          timestamp: now - 5 * 60 * 1000,
          coords: { latitude: 50.0518466, longitude: 14.4857067, accuracy: 40 }
        });
      }
    },
    mobile: true,
    fetch: ipFetch(50.23, 17.22)
  });
  assert.equal(result.fix, null);
  assert.equal(result.reason, "stale");
  assert.equal(geo.failureStatusKey(result), "points.needGps");
});
