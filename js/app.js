const POINTS = RaclettePoints.POINTS;

const MENU = ["menu.classic", "menu.fries", "menu.tenderloin", "menu.panini"];
const MENU_COLORS = ["#fece52", "#f5811f", "#00a85c", "#007dc5"];

let lang = "cs";
let origin = null;
let country = "cz";
let pickedId = null;
let networkBound = false;

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
    const meters = Math.max(50, Math.round(km * 1000 / 10) * 10);
    return meters + " m";
  }
  const digits = km < 10 ? 1 : 0;
  const value = new Intl.NumberFormat(lang === "cs" ? "cs-CZ" : lang, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(km);
  return value + " km";
}

function haversine(aLat, aLng, bLat, bLng) {
  return RacletteGeo.haversine(aLat, aLng, bLat, bLng);
}

function mapSrc(point) {
  const hl = { cs: "cs", sk: "sk", en: "en", fr: "fr", de: "de", it: "it", pl: "pl", es: "es", ru: "ru" }[lang] || "en";
  return "https://maps.google.com/maps?q=" + point.lat + "," + point.lng + "&z=14&hl=" + hl + "&output=embed";
}

function routeUrl(point) {
  return RacletteGeo.mapsDirUrl(point);
}

function setStatus(key, vars) {
  const el = document.getElementById("locator-status");
  el.textContent = t(key, vars);
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

function bindNetwork() {
  const root = document.getElementById("network");
  if (!root || networkBound) return;
  networkBound = true;
  root.addEventListener("click", onNetwork);
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (!event.target.closest("path[data-country]")) return;
    event.preventDefault();
    onNetwork(event);
  });
}

function onNetwork(event) {
  const pin = event.target.closest("[data-point]");
  if (pin) {
    const point = POINTS.find((item) => item.id === pin.dataset.point);
    if (!point) return;
    country = point.country;
    pickedId = point.id;
    renderNetwork();
    renderPoints();
    document.querySelector('#point-cards [data-id="' + point.id + '"]')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const choice = event.target.closest("[data-country]");
  if (!choice) return;
  const next = choice.dataset.country;
  if (!RaclettePoints.COUNTRIES.includes(next) || next === country) return;
  country = next;
  pickedId = null;
  renderNetwork();
  renderPoints();
}

function renderNetwork() {
  const stage = document.getElementById("network-map");
  const flags = document.getElementById("country-flags");
  if (!stage || !flags || typeof RacletteEurope === "undefined" || !RacletteEurope.mount) return;
  const order = RaclettePoints.COUNTRIES.slice();
  if (RaclettePoints.homeCountry(location.hostname) === "ch") order.reverse();
  RacletteEurope.mount(stage, flags, { country, pickedId, points: POINTS, t, order, count: RaclettePoints.branchCount });
}

function renderPoints() {
  const host = document.getElementById("point-cards");
  if (!host) return;
  const visible = POINTS.filter((point) => point.country === country);
  const ranked = visible.map((point) => {
    const distance = origin ? haversine(origin.lat, origin.lng, point.lat, point.lng) : null;
    return { point, distance };
  }).sort((a, b) => {
    if (a.distance == null || b.distance == null) return 0;
    return a.distance - b.distance;
  });
  const nearestId = origin && ranked.length ? ranked[0].point.id : null;

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
    const menu = MENU.map((key, i) => '<li style="--c:' + MENU_COLORS[i] + '">' + t(key) + "</li>").join("");
    const classes = ["card"];
    if (point.id === nearestId) classes.push("is-nearest");
    if (point.id === pickedId) classes.push("is-picked");
    const mapTitle = t("points.mapTitle", { name }).replaceAll('"', "&quot;");
    return (
      '<article class="' + classes.join(" ") + '" data-id="' + point.id + '">' +
        '<div class="card-head">' +
          '<div class="card-top"><div><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
          "<h3>" + name + "</h3>" + addressLine(point.id) + away + "</div>" + badge + "</div>" +
          '<p class="note">' + t("point." + point.id + ".note") + "</p>" + phone +
        "</div>" +
        '<div class="card-map">' +
          '<iframe class="map-embed" title="' + mapTitle + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + mapSrc(point) + '"></iframe>' +
        "</div>" +
        '<div class="card-more">' +
          "<h4>" + t("points.menu") + "</h4><ul class=\"menu\">" + menu + "</ul>" +
          '<div class="card-actions">' + web +
          '<a class="btn btn-solid" href="' + routeUrl(point) + '" target="_blank" rel="noopener noreferrer">' + t("points.route") + "</a></div>" +
        "</div>" +
      "</article>"
    );
  }).join("");
  const pending = RaclettePoints.PENDING.filter((point) => point.country === country).map((point) => (
    '<article class="card is-pending" data-id="' + point.id + '" data-country="' + point.country + '">' +
      '<div class="card-head"><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
      "<h3>" + t("point." + point.id + ".name") + "</h3>" +
      '<p class="note">' + t("point." + point.id + ".note") + "</p></div></article>"
  )).join("");
  host.innerHTML += pending;
}

function addressLine(id) {
  const addresses = {
    krizovy: "Za Pilou 6, 790 01 Jeseník",
    spindl: "Špindlerův Mlýn",
    kabrt: "Kladno",
    eddy: "Route de Valbord 55, 1934 Bruson",
    orsieres: "Route du Grand Saint-Bernard 3, 1937 Orsières",
    mouret: "Route de la Gruyère 6, 1724 Ferpicloz",
    minorit: "Masarykova třída 342/39, 746 01 Opava",
    bonte: "Husovo náměstí 78/6, 266 01 Beroun"
  };
  return '<p class="address">' + addresses[id] + "</p>";
}

const HERO_KICKER_STEPS = [
  "#f5811f", "#f5811f",
  "#f38479", "#f38479",
  "#cd143e", "#cd143e",
  "#f38193", "#f38193",
  "#c3346a", "#c3346a",
  "#642a7d", "#642a7d",
  "#00a85c", "#00a85c",
  "#027935",
  "#56b7e8", "#56b7e8",
  "#007dc5", "#007dc5",
  "#00a5b9",
  "#00657d"
];

function paintHeroKicker() {
  const el = document.querySelector(".hero .kicker");
  if (!el) return;
  const text = el.textContent;
  const letters = [...text].filter((ch) => ch.trim() !== "");
  if (!letters.length) return;
  const steps = letters.length === HERO_KICKER_STEPS.length
    ? HERO_KICKER_STEPS
    : letters.map((_, index) => HERO_KICKER_STEPS[Math.min(HERO_KICKER_STEPS.length - 1, Math.floor(index * HERO_KICKER_STEPS.length / letters.length))]);
  el.replaceChildren();
  let index = 0;
  for (const ch of text) {
    if (ch.trim() === "") {
      el.append(ch);
      continue;
    }
    const span = document.createElement("span");
    span.style.color = steps[index];
    span.textContent = ch;
    el.append(span);
    index += 1;
  }
}

function applyStatic() {
  document.documentElement.lang = RacletteSite.htmlLang(lang, location.hostname);
  const partnersPage = Boolean(document.querySelector(".franchise-page"));
  const translate = (key) => {
    if (partnersPage && key === "meta.title") return t("franchise.title");
    if (partnersPage && key === "meta.description") return t("franchise.lead");
    return t(key);
  };
  RacletteSite.apply(lang, translate, location);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  paintHeroKicker();
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  const toggle = document.getElementById("nav-toggle");
  const open = document.getElementById("site-nav").classList.contains("is-open");
  toggle.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
  document.getElementById("lang").value = lang;
}

function typeLabel(value) {
  const key = "form.type." + value;
  const label = t(key);
  return label === key ? value : label;
}

function partnerPayload(fields) {
  return {
    name: fields.name,
    email: fields.email,
    _replyto: fields.email,
    _subject: "Raclette Point Original — spolupráce",
    _template: "table",
    _captcha: "false",
    typ: fields.typeLabel || fields.type,
    mesto: fields.city,
    telefon: fields.phone,
    jazyk: fields.lang || "",
    predstava: fields.idea,
    message: [
      "Nová poptávka z webu Raclette Point Original",
      "",
      "Název: " + fields.name,
      "Typ provozovny: " + (fields.typeLabel || fields.type),
      "Město: " + fields.city,
      "Telefon: " + fields.phone,
      "E-mail: " + fields.email,
      fields.lang ? "Jazyk formuláře: " + fields.lang : "",
      "",
      "Představa:",
      fields.idea
    ].filter(Boolean).join("\n")
  };
}

function isHomePage() {
  return Boolean(document.getElementById("pointy"));
}

function bindPartnerForm() {
  const form = document.getElementById("partner-form");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    const submit = form.querySelector("button[type='submit']");
    const fallback = document.getElementById("form-fallback");
    if (fallback) fallback.hidden = true;
    const fields = {
      name: form.elements.namedItem("name").value.trim(),
      type: form.elements.namedItem("type").value,
      typeLabel: typeLabel(form.elements.namedItem("type").value),
      city: form.elements.namedItem("city").value.trim(),
      phone: form.elements.namedItem("phone").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      idea: form.elements.namedItem("idea").value.trim(),
      website: form.elements.namedItem("website") ? form.elements.namedItem("website").value.trim() : "",
      lang
    };
    if (fields.website) {
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = t("form.success");
      form.reset();
      return;
    }
    const missing = ["name", "type", "city", "phone", "email", "idea"].some((key) => !fields[key]);
    if (missing || !form.checkValidity()) {
      form.reportValidity();
      status.hidden = false;
      status.classList.add("is-error");
      status.textContent = t("form.error");
      return;
    }
    status.hidden = false;
    status.classList.remove("is-error");
    status.textContent = t("form.sending");
    if (submit) submit.disabled = true;
    const endpoint = RacletteSite.partnerInquiryUrl();
    const body = partnerPayload(fields);
    let ok = false;
    let payload = null;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(body)
      });
      payload = await response.json().catch(() => ({}));
      ok = response.ok && (payload.success === true || payload.success === "true" || payload.ok === true);
      window.__lastPartnerInquiry = { endpoint, ok, fields };
    } catch (err) {
      window.__lastPartnerInquiry = { endpoint, ok: false, error: String(err) };
    }
    if (submit) submit.disabled = false;
    if (ok) {
      status.classList.remove("is-error");
      status.textContent = t("form.success");
      form.reset();
      return;
    }
    const activation = RacletteSite.partnerInquiryNeedsActivation(payload);
    status.classList.add("is-error");
    status.textContent = t(activation ? "form.activate" : "form.sendError");
    const link = document.getElementById("form-mail");
    if (fallback && link) {
      link.href = RacletteSite.partnerInquiryMailto(fields);
      fallback.hidden = false;
    }
  });
}

function setLang(next) {
  if (!LANGS.includes(next)) next = RacletteSite.preferredLanguage(location.hostname, navigator.languages || [navigator.language]) || "cs";
  try { localStorage.setItem("raclette-lang", next); } catch (err) { /* ignore */ }
  const target = new URL(RacletteSite.languageUrl(next, location));
  lang = next;
  history.replaceState(null, "", target.pathname + target.search + target.hash);
  applyStatic();
  if (!isHomePage()) return;
  renderNetwork();
  renderPoints();
  if (!origin) {
    hideNavigateNearest();
    setStatus("points.idle");
  } else {
    const status = locatedStatus(origin.lat, origin.lng, origin.accuracy);
    showNavigateNearest(status.nearest);
    setStatus(status.key, status.vars);
  }
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
  country = status.nearest.country || country;
  pickedId = status.nearest.id;
  renderNetwork();
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
      // GPS timeout / unavailable → one softer network-based reading for ranking only
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

function boot() {
  const params = new URLSearchParams(window.location.search);
  let initial = params.get("lang");
  if (initial && !LANGS.includes(initial)) initial = null;
  if (!initial) {
    try { initial = localStorage.getItem("raclette-lang"); } catch (err) { initial = null; }
  }
  if (!initial) {
    initial = RacletteSite.preferredLanguage(location.hostname, navigator.languages || [navigator.language]);
  }
  lang = LANGS.includes(initial) ? initial : "cs";
  applyStatic();
  bindPartnerForm();

  document.getElementById("lang").addEventListener("change", (event) => setLang(event.target.value));
  document.getElementById("nav-toggle").addEventListener("click", () => {
    const nav = document.getElementById("site-nav");
    const open = nav.classList.toggle("is-open");
    document.getElementById("nav-toggle").setAttribute("aria-expanded", String(open));
    document.getElementById("nav-toggle").setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
  });
  document.getElementById("site-nav").addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      document.getElementById("site-nav").classList.remove("is-open");
      document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
    }
  });

  if (isHomePage()) {
    country = RaclettePoints.homeCountry(location.hostname);
    bindNetwork();
    renderNetwork();
    renderPoints();
    hideNavigateNearest();
    setStatus("points.idle");
    document.getElementById("locate").addEventListener("click", locate);
    document.getElementById("hero-locate").addEventListener("click", () => {
      // Keep #pointy scroll from the href; still run locate from the same gesture.
      locate();
    });
    const links = [...document.querySelectorAll(".site-nav a")];
    const sections = links
      .map((link) => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("#")) return document.querySelector(href);
        return null;
      })
      .filter(Boolean);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id));
        });
      }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
      sections.forEach((section) => observer.observe(section));
    }
  }

  if (location.hash === "#franchise-form") {
    requestAnimationFrame(() => {
      document.getElementById("franchise-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

boot();
