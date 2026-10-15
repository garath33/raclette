(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RacletteGeo = api;
})(typeof self !== "undefined" ? self : this, function () {
  // A Wi-Fi pin can sit a street away. Farther than this from the current IP,
  // the pin is a leftover (Hamerský rybník days later) and must not start navigation.
  const STALE_KM = 8;
  const FRESH_MS = 120000;

  function haversine(aLat, aLng, bLat, bLng) {
    const R = 6371;
    const dLat = ((bLat - aLat) * Math.PI) / 180;
    const dLng = ((bLng - aLng) * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((aLat * Math.PI) / 180) *
        Math.cos((bLat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function rank(points, lat, lng) {
    return points
      .map((point) => ({ point, km: haversine(lat, lng, point.lat, point.lng) }))
      .sort((a, b) => a.km - b.km || a.point.id.localeCompare(b.point.id));
  }

  function nearest(points, lat, lng) {
    const ranked = rank(points, lat, lng);
    return ranked.length ? ranked[0].point : undefined;
  }

  /**
   * A fix with this accuracy radius cannot change the nearest Point when the
   * gap to the runner-up is larger than twice the radius: the reading can
   * move toward the second Point and away from the first at the same time.
   */
  function nearestIsStable(points, lat, lng, accuracyMeters) {
    const ranked = rank(points, lat, lng);
    if (ranked.length < 2) return true;
    const accuracy = Number(accuracyMeters);
    if (!Number.isFinite(accuracy) || accuracy < 0) return false;
    const gapMeters = (ranked[1].km - ranked[0].km) * 1000;
    return gapMeters > accuracy * 2;
  }

  /** precise: trust the fix. coarse: approximate, but the winner holds. uncertain: the error can flip it. */
  function readingKind(points, lat, lng, accuracyMeters) {
    const COARSE_M = 300;
    const accuracy = Number(accuracyMeters);
    if (!Number.isFinite(accuracy) || accuracy < COARSE_M) return "precise";
    if (rank(points, lat, lng).length < 2) return "precise";
    return nearestIsStable(points, lat, lng, accuracy) ? "coarse" : "uncertain";
  }

  function isFreshTimestamp(timestamp, now, maxAgeMs) {
    const ts = Number(timestamp);
    const at = Number(now);
    if (!Number.isFinite(ts) || !Number.isFinite(at)) return false;
    const age = at - ts;
    const max = Number.isFinite(Number(maxAgeMs)) ? Number(maxAgeMs) : FRESH_MS;
    return age >= -60000 && age <= max;
  }

  function browserFix(position, now, maxAgeMs) {
    if (!position || !position.coords) return null;
    const lat = Number(position.coords.latitude);
    const lng = Number(position.coords.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const accuracy = Number(position.coords.accuracy);
    return {
      lat,
      lng,
      accuracy: Number.isFinite(accuracy) ? accuracy : null,
      fresh: isFreshTimestamp(position.timestamp, now, maxAgeMs),
      source: "browser"
    };
  }

  function networkFix(data) {
    if (!data || data.ok === false) return null;
    const lat = Number(data.lat);
    const lng = Number(data.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    const accuracy = Number(data.accuracy);
    return {
      lat,
      lng,
      accuracy: Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : 20000,
      source: "ip"
    };
  }

  /**
   * Prefer a fresh browser reading. When it is missing, stale, or more than
   * STALE_KM from the current IP, navigation starts from the IP instead of
   * a days-old Wi-Fi pin.
   */
  function chooseFix(browser, network) {
    const browserOk = !!(browser && browser.fresh !== false && Number.isFinite(browser.lat) && Number.isFinite(browser.lng));
    const networkOk = !!(network && Number.isFinite(network.lat) && Number.isFinite(network.lng));
    if (browserOk && networkOk) {
      const gap = haversine(browser.lat, browser.lng, network.lat, network.lng);
      if (gap > STALE_KM) {
        return { lat: network.lat, lng: network.lng, accuracy: network.accuracy, source: "ip", staleKm: gap };
      }
      return { lat: browser.lat, lng: browser.lng, accuracy: browser.accuracy, source: "browser" };
    }
    if (browserOk) return { lat: browser.lat, lng: browser.lng, accuracy: browser.accuracy, source: "browser" };
    if (browser && networkOk) {
      const gap = haversine(browser.lat, browser.lng, network.lat, network.lng);
      return {
        lat: network.lat,
        lng: network.lng,
        accuracy: network.accuracy,
        source: "ip",
        staleKm: gap > STALE_KM ? gap : 0
      };
    }
    if (networkOk) return { lat: network.lat, lng: network.lng, accuracy: network.accuracy, source: "ip" };
    return null;
  }

  function describeFix(points, fix) {
    const ranked = rank(points, fix.lat, fix.lng);
    const nearestPoint = ranked[0].point;
    const km = ranked[0].km;
    const gapKm = ranked[1] ? ranked[1].km - ranked[0].km : 0;
    let key = "points.found";
    if (fix.source === "ip" && Number(fix.staleKm) > 0) key = "points.foundStale";
    else if (fix.source === "ip") key = "points.foundIp";
    else {
      const kind = readingKind(points, fix.lat, fix.lng, fix.accuracy);
      if (kind === "coarse") key = "points.foundCoarse";
      else if (kind === "uncertain") key = "points.foundUncertain";
    }
    return {
      nearest: nearestPoint,
      key,
      km,
      gapKm,
      accuracy: fix.accuracy,
      staleKm: Number(fix.staleKm) || 0
    };
  }

  /**
   * Directions URL with destination only. A laptop fix is often just a dot in
   * the city centre; putting it in origin makes Maps reverse-geocode it into a
   * nearby business (pragERLEBNIS on Staroměstské náměstí for 50.080804,14.42076).
   * Maps then starts from "Your location" instead of that invented address.
   * The origin argument is ignored on purpose.
   */
  function mapsDirUrl(point) {
    const dest = point.lat + "," + point.lng;
    return (
      "https://www.google.com/maps/dir/?api=1" +
      "&destination=" + encodeURIComponent(dest) +
      "&travelmode=driving" +
      "&dir_action=navigate"
    );
  }

  function readPosition(geo, options) {
    return new Promise((resolve, reject) => {
      geo.getCurrentPosition(resolve, reject, options);
    });
  }

  async function readBrowser(geo) {
    let pos;
    try {
      // Long enough for the permission prompt. maximumAge 0 refuses a cached pin.
      pos = await readPosition(geo, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    } catch (first) {
      if (!(first && (first.code === 2 || first.code === 3))) throw first;
      pos = await readPosition(geo, { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 });
    }
    const fix = browserFix(pos, Date.now(), FRESH_MS);
    if (!fix) {
      const err = new Error("invalid");
      err.code = 2;
      throw err;
    }
    if (!fix.fresh) {
      const err = new Error("stale");
      err.code = 2;
      err.fix = fix;
      throw err;
    }
    return fix;
  }

  function withTimeout(promise, ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), ms);
      Promise.resolve(promise).then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        () => {
          clearTimeout(timer);
          resolve(null);
        }
      );
    });
  }

  async function readNetwork(fetchImpl, networkUrl) {
    if (typeof fetchImpl !== "function") return null;
    try {
      const response = await fetchImpl(networkUrl || "/api/where", { cache: "no-store" });
      if (!response || !response.ok) return null;
      return networkFix(await response.json());
    } catch (err) {
      return null;
    }
  }

  /**
   * Starts the browser prompt immediately (no await before getCurrentPosition)
   * and reads the current IP in parallel. A denied or switched-off laptop
   * still gets the IP when the worker can see it.
   */
  function acquireFix(env) {
    const source = env || {};
    const geo = source.geolocation;
    const fetchImpl = source.fetch || (typeof fetch === "function" ? fetch : null);
    const networkPromise = withTimeout(readNetwork(fetchImpl, source.networkUrl), 4000);
    let browserPromise;
    if (!geo || typeof geo.getCurrentPosition !== "function") {
      browserPromise = Promise.resolve({ browser: null, reason: "unsupported" });
    } else {
      browserPromise = readBrowser(geo).then(
        (browser) => ({ browser, reason: null }),
        (err) => ({
          browser: err && err.fix ? err.fix : null,
          reason: err && err.code === 1 ? "denied" : "unavailable"
        })
      );
    }
    return Promise.all([browserPromise, networkPromise]).then(([browserResult, network]) => {
      const fix = chooseFix(browserResult.browser, network);
      return { fix, reason: fix ? null : (browserResult.reason || "unavailable") };
    });
  }

  return {
    haversine,
    rank,
    nearest,
    nearestIsStable,
    readingKind,
    isFreshTimestamp,
    browserFix,
    networkFix,
    chooseFix,
    describeFix,
    mapsDirUrl,
    acquireFix,
    STALE_KM,
    FRESH_MS
  };
});
