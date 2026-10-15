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
  return RacletteGeo.mapsDirUrl(point);
}

function setStatus(key, vars) {
  const el = document.getElementById("locator-status");
  if (el) el.textContent = t(key, vars);
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

function readPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

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
    return (
      '<article class="' + classes.join(" ") + '" data-id="' + point.id + '">' +
        '<div class="card-head">' +
          '<div class="card-top"><div><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
          "<h3>" + name + "</h3>" +
          '<p class="address">' + point.address + "</p>" + away + "</div>" + badge + "</div>" +
          '<p class="note">' + t("point." + point.id + ".note") + "</p>" + phone +
        "</div>" +
        '<div class="card-actions">' + web +
        '<a class="btn btn-solid" href="' + routeUrl(point) + '" target="_blank" rel="noopener noreferrer">' + t("points.route") + "</a></div>" +
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

function locatedStatus(lat, lng, accuracyMeters) {
  const ranked = RacletteGeo.rank(POINTS, lat, lng);
  const nearest = ranked[0].point;
  const name = t("point." + nearest.id + ".name");
  const km = formatKm(ranked[0].km);
  const kind = RacletteGeo.readingKind(POINTS, lat, lng, accuracyMeters);
  if (kind === "precise") return { nearest, key: "points.found", vars: { name, km } };
  const gap = formatKm(ranked[1].km - ranked[0].km);
  const accuracy = formatAccuracy(Number(accuracyMeters));
  const key = kind === "coarse" ? "points.foundCoarse" : "points.foundUncertain";
  return { nearest, key, vars: { name, km, accuracy, gap } };
}

function applyLocatedOrigin(lat, lng, accuracyMeters) {
  const accuracy = Number(accuracyMeters);
  origin = { lat, lng, accuracy: Number.isFinite(accuracy) ? accuracy : null };
  const status = locatedStatus(lat, lng, origin.accuracy);
  renderPoints();
  showNavigateNearest(status.nearest);
  setStatus(status.key, status.vars);
  document.getElementById("navigate-nearest")?.focus();
}

async function locate() {
  if (!navigator.geolocation) {
    hideNavigateNearest();
    setStatus("points.unsupported");
    return;
  }
  setStatus("points.locating");
  hideNavigateNearest();
  const locateBtn = document.getElementById("locate");
  if (locateBtn) locateBtn.disabled = true;
  try {
    let pos;
    try {
      pos = await readPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
    } catch (first) {
      if (first && (first.code === 2 || first.code === 3)) {
        pos = await readPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
      } else {
        throw first;
      }
    }
    applyLocatedOrigin(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
  } catch (err) {
    hideNavigateNearest();
    setStatus("points.denied");
  } finally {
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
    const status = locatedStatus(origin.lat, origin.lng, origin.accuracy);
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
}

boot();
