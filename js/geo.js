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
    const ts = Number(position.timestamp);
    // Installed Android WebViews sometimes return timestamp 0; with maximumAge 0
    // the callback is still a live reading and must not be discarded as stale.
    const fresh =
      !Number.isFinite(ts) || ts <= 0
        ? true
        : isFreshTimestamp(ts, now, maxAgeMs);
    return {
      lat,
      lng,
      accuracy: Number.isFinite(accuracy) ? accuracy : null,
      fresh,
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
   * dir_action=navigate is omitted on purpose: on Android it opens turn-by-turn
   * before the blue route is drawn, so a stationary phone shows only the car.
   * The overview draws the line immediately; the Maps app then has its own Start.
   * The origin argument is ignored on purpose.
   */
  function mapsDirUrl(point) {
    const dest = point.lat + "," + point.lng;
    return (
      "https://www.google.com/maps/dir/?api=1" +
      "&destination=" + encodeURIComponent(dest) +
      "&travelmode=driving"
    );
  }

  function isAndroid(nav) {
    return /Android/i.test(String((nav && nav.userAgent) || ""));
  }

  function isIos(nav) {
    const ua = String((nav && (nav.userAgent || nav.vendor)) || "");
    if (/iPhone|iPod|iPad/i.test(ua)) return true;
    return !!(nav && nav.platform === "MacIntel" && Number(nav.maxTouchPoints) > 1);
  }

  function hasCoarsePointer(matchMediaFn, nav) {
    if (typeof matchMediaFn !== "function") return false;
    try {
      if (!matchMediaFn("(hover: none) and (pointer: coarse)").matches) return false;
    } catch (err) {
      return false;
    }
    return Number(nav && nav.maxTouchPoints) > 0;
  }

  /**
   * Phones and tablets have GPS. A mobile-carrier IP is often a POP hundreds of
   * kilometres away (Zličín via CGNAT can look like Jeseník), so the network
   * fallback is only for laptops, where Wi-Fi IPs are usually city-level.
   */
  function isMobileDevice(env) {
    const source = env || {};
    if (typeof source.mobile === "boolean") return source.mobile;
    const nav = source.navigator || (typeof navigator !== "undefined" ? navigator : null);
    if (!nav) return false;
    // UA first: Playwright and "Request desktop site" can disagree with client hints.
    if (isAndroid(nav) || isIos(nav)) return true;
    const ua = String(nav.userAgent || "");
    if (/webOS|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)) return true;
    if (nav.userAgentData && typeof nav.userAgentData.mobile === "boolean") {
      return nav.userAgentData.mobile;
    }
    const mm = source.matchMedia || (typeof matchMedia === "function" ? matchMedia : null);
    return hasCoarsePointer(typeof mm === "function" ? mm : null, nav);
  }

  function geoErrorReason(err) {
    if (!err) return "unavailable";
    if (err.code === 1) return "denied";
    if (err.code === 3) return "timeout";
    if (err.message === "stale") return "stale";
    return "unavailable";
  }

  function isStandaloneDisplay(env) {
    const source = env || {};
    const mm = source.matchMedia || (typeof matchMedia === "function" ? matchMedia : null);
    if (typeof mm === "function") {
      try {
        if (mm("(display-mode: standalone)").matches) return true;
        if (mm("(display-mode: fullscreen)").matches) return true;
      } catch (err) {
        /* ignore */
      }
    }
    const nav = source.navigator || (typeof navigator !== "undefined" ? navigator : null);
    return !!(nav && nav.standalone === true);
  }

  function mobileGpsStatusKey(env) {
    return isStandaloneDisplay(env) ? "points.needGpsInstalled" : "points.needGps";
  }

  function runtimeEnv(overrides) {
    const base = {
      navigator: typeof navigator !== "undefined" ? navigator : null,
      matchMedia: typeof matchMedia === "function" ? matchMedia : null
    };
    return overrides ? Object.assign(base, overrides) : base;
  }

  function failureStatusKey(result, env) {
    if (!result || result.fix) return null;
    if (result.reason === "unsupported") return "points.unsupported";
    if (result.mobile) {
      if (result.reason === "timeout") return "points.timeout";
      return mobileGpsStatusKey(env);
    }
    return "points.denied";
  }

  function queryGeoPermission(env) {
    const nav = (env && env.navigator) || (typeof navigator !== "undefined" ? navigator : null);
    if (!nav || !nav.permissions || typeof nav.permissions.query !== "function") {
      return Promise.resolve(null);
    }
    return nav.permissions.query({ name: "geolocation" }).then(
      (status) => (status && status.state) || null,
      () => null
    );
  }

  async function resolveFailureStatusKey(result, env) {
    if (!result || result.fix) return null;
    if (result.reason === "unsupported") return "points.unsupported";
    if (!result.mobile) return "points.denied";
    if (result.reason === "timeout") {
      // Even on timeout, check if perm was granted — user may have just enabled GPS.
      const perm = await queryGeoPermission(env);
      if (perm === "granted") return "points.timeout";
      if (perm === "denied") return isStandaloneDisplay(env) ? "points.needGpsInstalled" : "points.deniedSite";
      if (perm === "prompt") return "points.needGpsPrompt";
      return mobileGpsStatusKey(env);
    }
    const perm = await queryGeoPermission(env);
    if (perm === "denied") {
      return isStandaloneDisplay(env) ? "points.needGpsInstalled" : "points.deniedSite";
    }
    if (perm === "granted") {
      // Permission granted but still no fix — GPS hardware not yet ready.
      return "points.timeout";
    }
    if (perm === "prompt") return "points.needGpsPrompt";
    return mobileGpsStatusKey(env);
  }

  function acquireFixWithRetry(env) {
    return acquireFix(env);
  }

  function statusTone(key) {
    if (
      key === "points.needGps" ||
      key === "points.needGpsInstalled" ||
      key === "points.needGpsPrompt" ||
      key === "points.deniedSite" ||
      key === "points.gpsWarmup" ||
      key === "points.denied" ||
      key === "points.timeout" ||
      key === "points.unsupported"
    ) {
      return "need";
    }
    if (key === "points.foundIp" || key === "points.foundStale" || key === "points.foundUncertain") {
      return "warn";
    }
    return "";
  }

  function readPosition(geo, options) {
    return new Promise((resolve, reject) => {
      geo.getCurrentPosition(resolve, reject, options);
    });
  }

  function readWatch(geo, options, ms) {
    return new Promise((resolve, reject) => {
      if (!geo || typeof geo.watchPosition !== "function") {
        const err = new Error("unsupported");
        err.code = 2;
        reject(err);
        return;
      }
      let finished = false;
      let id = null;
      const finish = (fn, value) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (id != null && typeof geo.clearWatch === "function") geo.clearWatch(id);
        fn(value);
      };
      const timer = setTimeout(() => {
        const err = new Error("timeout");
        err.code = 3;
        finish(reject, err);
      }, ms);
      id = geo.watchPosition(
        (pos) => finish(resolve, pos),
        (err) => finish(reject, err || { code: 2 }),
        options
      );
    });
  }

  /**
   * One tap. Wi-Fi and mobile network only — enableHighAccuracy opens Android's
   * "location accuracy" sheet and Chrome then cancels the request, so the page
   * showed a timeout about a second after Zapnout. A coarse watch stays up, and
   * every few seconds we ask again until a fix arrives. The user does not tap again.
   */
  function readMobileWatch(geo, env) {
    const ms = Number(env && env.watchMs) > 0 ? Number(env.watchMs) : 24000;
    const pulseMs = Number(env && env.pulseMs) > 0 ? Number(env.pulseMs) : 3000;
    const coarse = { enableHighAccuracy: false, maximumAge: 10000, timeout: 8000 };
    return new Promise((resolve, reject) => {
      let finished = false;
      const ids = [];
      let polls = null;
      let pulse = null;
      const finish = (fn, value) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (pulse) clearInterval(pulse);
        if (polls) clearInterval(polls);
        if (typeof geo.clearWatch === "function") ids.forEach((id) => geo.clearWatch(id));
        fn(value);
      };
      const ask = () => {
        if (finished || typeof geo.getCurrentPosition !== "function") return;
        geo.getCurrentPosition(
          (pos) => finish(resolve, pos),
          () => {},
          coarse
        );
      };
      const timer = setTimeout(() => {
        const err = new Error("timeout");
        err.code = 3;
        finish(reject, err);
      }, ms);
      const look = () => {
        queryGeoPermission(env).then((perm) => {
          if (!finished && perm === "denied") {
            const err = new Error("denied");
            err.code = 1;
            finish(reject, err);
          }
        });
      };
      polls = setInterval(look, 700);
      if (typeof geo.watchPosition === "function") {
        const id = geo.watchPosition(
          (pos) => finish(resolve, pos),
          () => {},
          coarse
        );
        ids.push(id);
      }
      ask();
      pulse = setInterval(ask, pulseMs);
      if (finished) {
        clearInterval(pulse);
        if (polls) clearInterval(polls);
      }
    });
  }

  async function readLaptop(geo) {
    let pos;
    try {
      pos = await readPosition(geo, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    } catch (first) {
      if (first && first.code === 1) throw first;
      try {
        pos = await readPosition(geo, { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 });
      } catch (second) {
        if (second && second.code === 1) throw second;
        pos = await readWatch(geo, { enableHighAccuracy: true, maximumAge: 0 }, 8000);
      }
    }
    return pos;
  }

  async function readBrowser(geo, env) {
    const pos =
      isMobileDevice(env) && geo && typeof geo.watchPosition === "function"
        ? await readMobileWatch(geo, env)
        : await readLaptop(geo);
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
   * Call from the click handler before any DOM updates; otherwise Android Chrome
   * may skip the permission prompt. Laptops may fall back to the current IP. Phones
   * too coarse and too often in another region.
   */
  function acquireFix(env) {
    const source = env || {};
    const mobile = isMobileDevice(source);
    const geo = source.geolocation;
    const fetchImpl = source.fetch || (typeof fetch === "function" ? fetch : null);
    const networkPromise = mobile
      ? Promise.resolve(null)
      : withTimeout(readNetwork(fetchImpl, source.networkUrl), 4000);
    let browserPromise;
    const canRead =
      geo &&
      (typeof geo.watchPosition === "function" || typeof geo.getCurrentPosition === "function");
    if (!canRead) {
      browserPromise = Promise.resolve({ browser: null, reason: "unsupported" });
    } else {
      browserPromise = readBrowser(geo, source).then(
        (browser) => ({ browser, reason: null }),
        (err) => ({
          browser: err && err.fix ? err.fix : null,
          reason: geoErrorReason(err)
        })
      );
    }
    return Promise.all([browserPromise, networkPromise]).then(([browserResult, network]) => {
      const fix = chooseFix(browserResult.browser, mobile ? null : network);
      if (mobile && (!fix || fix.source !== "browser")) {
        return { fix: null, reason: browserResult.reason || "unavailable", mobile: true };
      }
      return { fix, reason: fix ? null : (browserResult.reason || "unavailable"), mobile };
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
    acquireFixWithRetry,
    queryGeoPermission,
    resolveFailureStatusKey,
    isMobileDevice,
    isAndroid,
    isIos,
    isStandaloneDisplay,
    mobileGpsStatusKey,
    runtimeEnv,
    geoErrorReason,
    failureStatusKey,
    statusTone,
    STALE_KM,
    FRESH_MS
  };
});
