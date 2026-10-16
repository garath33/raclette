const POINTS = RaclettePoints.POINTS;
const APP_LANGS = RacletteSite.APP_LANGUAGES;

let lang = "cs";
let origin = null;

function t(key, vars) {
  const pack = TRANSLATIONS[lang] || TRANSLATIONS.cs;
  let str = pack[key] || TRANSLATIONS.cs[key] || key;
  if (vars) {
    Object.keys(vars).forEach((name) => {
      str = str.replaceAll("{" + name + "}", vars[name]);
    });
  }
  return str;
}

function formatKm(km) {
  if (km < 1) {
    const meters = Math.max(50, Math.round((km * 1000) / 10) * 10);
    return meters + " m";
  }
  const digits = km < 10 ? 1 : 0;
  const value = new Intl.NumberFormat(lang === "cs" ? "cs-CZ" : lang, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(km);
  return value + " km";
}

function routeUrl(point) {
  return RacletteGeo.mapsDirUrl(point, origin);
}

function setStatus(key, vars) {
  const el = document.getElementById("locator-status");
  if (!el) return;
  el.textContent = t(key, vars);
  const tone = RacletteGeo.statusTone(key);
  el.classList.toggle("is-need", tone === "need");
  el.classList.toggle("is-warn", tone === "warn");
}

function hideNavigateNearest() {
  const link = document.getElementById("navigate-nearest");
  if (!link) return;
  link.hidden = true;
  link.removeAttribute("href");
}

function showNavigateNearest(point) {
  const link = document.getElementById("navigate-nearest");
  if (!link) return;
  link.hidden = false;
  link.href = routeUrl(point);
  link.textContent = t("points.navigate", { name: t("point." + point.id + ".name") });
}

let locateBusy = false;
let locateAttempted = false;

function renderPoints() {
  const host = document.getElementById("point-cards");
  const ranked = POINTS.map((point) => {
    const distance = origin ? RacletteGeo.haversine(origin.lat, origin.lng, point.lat, point.lng) : null;
    return { point, distance };
  }).sort((a, b) => {
    if (a.distance == null || b.distance == null) return 0;
    return a.distance - b.distance;
  });
  const nearestId = origin ? ranked[0].point.id : null;

  host.innerHTML = ranked.map(({ point, distance }) => {
    const name = t("point." + point.id + ".name");
    const web = point.web
      ? '<a class="btn btn-line" href="' + point.web + '" target="_blank" rel="noopener noreferrer">' + t("points.web") + "</a>"
      : "";
    const phone = point.phone
      ? '<a class="phone" href="' + point.phoneHref + '">' + point.phone + "</a>"
      : "";
    const badge = point.id === nearestId ? '<span class="badge">' + t("points.nearest") + "</span>" : "";
    const away = distance != null ? '<p class="distance">' + t("points.km", { km: formatKm(distance) }) + "</p>" : "";
    const classes = ["card", "lovers-card"];
    if (point.id === nearestId) classes.push("is-nearest");
    const flag = RaclettePoints.branchFlag(point.country, t("map.country." + point.country));
    return (
      '<article class="' + classes.join(" ") + '" data-id="' + point.id + '">' +
        '<div class="card-head">' +
          '<div class="card-top"><div><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
          "<h3>" + flag + name + "</h3>" +
          '<p class="address">' + point.address + "</p>" + away + "</div>" + badge + "</div>" +
          '<p class="note">' + t("point." + point.id + ".note") + "</p>" + phone +
        "</div>" +
        '<div class="card-actions">' + web +
        '<a class="btn btn-solid" data-route="' + point.id + '" href="' + routeUrl(point) + '" target="_blank" rel="noopener noreferrer">' + t("points.route") + "</a></div>" +
      "</article>"
    );
  }).join("");
}

function applyStatic() {
  document.documentElement.lang = RacletteSite.htmlLang(lang, location.hostname);
  const translate = (key) => {
    if (key === "meta.title") return t("app.meta.title");
    if (key === "meta.description") return t("app.meta.description");
    return t(key);
  };
  RacletteSite.apply(lang, translate, location);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.getElementById("lang").value = lang;
}

function formatAccuracy(meters) {
  if (meters >= 1000) return formatKm(meters / 1000);
  const rounded = Math.max(10, Math.round(meters / 10) * 10);
  return rounded + " m";
}

function locatedStatus(lat, lng, accuracyMeters, source, staleKm) {
  const info = RacletteGeo.describeFix(POINTS, {
    lat,
    lng,
    accuracy: accuracyMeters,
    source: source || "browser",
    staleKm: staleKm || 0
  });
  const name = t("point." + info.nearest.id + ".name");
  const km = formatKm(info.km);
  if (info.key === "points.found" || info.key === "points.foundIp") {
    return { nearest: info.nearest, key: info.key, vars: { name, km } };
  }
  if (info.key === "points.foundStale") {
    return { nearest: info.nearest, key: info.key, vars: { name, km, gap: formatKm(info.staleKm) } };
  }
  return {
    nearest: info.nearest,
    key: info.key,
    vars: { name, km, accuracy: formatAccuracy(Number(info.accuracy)), gap: formatKm(info.gapKm) }
  };
}

function applyLocatedOrigin(fix) {
  if (!fix || (fix.source === "ip" && RacletteGeo.isMobileDevice())) {
    hideNavigateNearest();
    setStatus(RacletteGeo.mobileGpsStatusKey(RacletteGeo.runtimeEnv()));
    return;
  }
  const accuracy = Number(fix.accuracy);
  origin = {
    lat: fix.lat,
    lng: fix.lng,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
    source: fix.source || "browser",
    staleKm: Number(fix.staleKm) || 0
  };
  const status = locatedStatus(origin.lat, origin.lng, origin.accuracy, origin.source, origin.staleKm);
  renderPoints();
  showNavigateNearest(status.nearest);
  setStatus(status.key, status.vars);
  document.getElementById("navigate-nearest")?.focus();
}

function restoreNavigate() {
  if (!origin) {
    hideNavigateNearest();
    return;
  }
  const status = locatedStatus(origin.lat, origin.lng, origin.accuracy, origin.source, origin.staleKm);
  showNavigateNearest(status.nearest);
}

async function locate() {
  if (locateBusy) return;
  locateBusy = true;
  const locateBtn = document.getElementById("locate");
  const env = RacletteGeo.runtimeEnv({
    geolocation: navigator.geolocation,
    fetch,
    networkUrl: new URL("api/where", location.href).href,
    onRefine(fix) {
      if (fix) applyLocatedOrigin(fix);
    }
  });
  const pending = RacletteGeo.acquireFixWithRetry(env);
  setStatus("points.locating");
  hideNavigateNearest();
  if (locateBtn) locateBtn.disabled = true;
  try {
    const result = await pending;
    if (!result.fix) {
      restoreNavigate();
      setStatus(await RacletteGeo.resolveFailureStatusKey(result, env));
      return;
    }
    applyLocatedOrigin(result.fix);
  } catch (err) {
    restoreNavigate();
    setStatus(
      RacletteGeo.isMobileDevice()
        ? RacletteGeo.mobileGpsStatusKey(RacletteGeo.runtimeEnv())
        : "points.denied"
    );
  } finally {
    locateBusy = false;
    locateAttempted = true;
    if (locateBtn) locateBtn.disabled = false;
  }
}

function setLang(next) {
  if (APP_LANGS.indexOf(next) === -1) {
    next = RacletteSite.appLanguage(location.hostname, navigator.languages || [navigator.language], next);
  }
  try { localStorage.setItem("raclette-lang", next); } catch (err) { /* ignore */ }
  const target = new URL(RacletteSite.languageUrl(next, location));
  lang = next;
  history.replaceState(null, "", target.pathname + target.search + target.hash);
  applyStatic();
  renderPoints();
  if (!origin) {
    hideNavigateNearest();
    setStatus("app.idle");
  } else {
    const status = locatedStatus(origin.lat, origin.lng, origin.accuracy, origin.source, origin.staleKm);
    showNavigateNearest(status.nearest);
    setStatus(status.key, status.vars);
  }
}

function boot() {
  const params = new URLSearchParams(window.location.search);
  let stored = null;
  try { stored = localStorage.getItem("raclette-lang"); } catch (err) { stored = null; }
  lang = RacletteSite.appLanguage(
    location.hostname,
    navigator.languages || [navigator.language],
    params.get("lang") || stored
  );
  const target = new URL(RacletteSite.languageUrl(lang, location));
  history.replaceState(null, "", target.pathname + target.search + target.hash);
  applyStatic();
  renderPoints();
  hideNavigateNearest();
  setStatus("app.idle");
  document.getElementById("lang").addEventListener("change", (event) => setLang(event.target.value));
  document.getElementById("locate").addEventListener("click", locate);
  document.getElementById("point-cards").addEventListener("click", (event) => {
    const link = event.target.closest("a[data-route]");
    if (!link || origin || locateAttempted) return;
    event.preventDefault();
    locate();
  });
  document.getElementById("navigate-nearest").addEventListener("click", (event) => {
    if (origin && event.currentTarget.getAttribute("href")) return;
    event.preventDefault();
    locate();
  });
}

boot();
