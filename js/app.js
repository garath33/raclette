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
  return RacletteGeo.mapsDirUrl(point, origin);
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

let locateBusy = false;

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
    const flag = RaclettePoints.branchFlag(point.country, t("map.country." + point.country));
    return (
      '<article class="' + classes.join(" ") + '" data-id="' + point.id + '">' +
        '<div class="card-head">' +
          '<div class="card-top"><div><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
          "<h3>" + flag + name + "</h3>" + '<p class="address">' + point.address + "</p>" + away + "</div>" + badge + "</div>" +
          '<p class="note">' + t("point." + point.id + ".note") + "</p>" + phone +
        "</div>" +
        '<div class="card-map">' +
          '<iframe class="map-embed" title="' + mapTitle + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + mapSrc(point) + '"></iframe>' +
        "</div>" +
        '<div class="card-more">' +
          "<h4>" + t("points.menu") + "</h4><ul class=\"menu\">" + menu + "</ul>" +
          '<div class="card-actions">' + web +
          '<a class="btn btn-solid" data-route="' + point.id + '" href="' + routeUrl(point) + '" target="_blank" rel="noopener noreferrer">' + t("points.route") + "</a></div>" +
        "</div>" +
      "</article>"
    );
  }).join("");
  const pending = RaclettePoints.PENDING.filter((point) => point.country === country).map((point) => (
    '<article class="card is-pending" data-id="' + point.id + '" data-country="' + point.country + '">' +
      '<div class="card-head"><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
      "<h3>" + RaclettePoints.branchFlag(point.country, t("map.country." + point.country)) + t("point." + point.id + ".name") + "</h3>" +
      '<p class="note">' + t("point." + point.id + ".note") + "</p></div></article>"
  )).join("");
  host.innerHTML += pending;
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

function paintPhoneFlags() {
  document.querySelectorAll("[data-flags]").forEach((el) => {
    if (el.querySelector(".phone-flags")) return;
    const flags = document.createElement("span");
    flags.className = "phone-flags";
    flags.setAttribute("aria-hidden", "true");
    el.dataset.flags.split(/\s+/).forEach((id) => {
      const cloth = document.createElement("span");
      cloth.className = "flag-cloth";
      cloth.innerHTML = RaclettePoints.contactFlag(id);
      flags.append(cloth);
    });
    el.prepend(flags);
  });
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
  paintPhoneFlags();
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

function setPartnerStatus(form, status, kind, key) {
  status.hidden = false;
  status.classList.toggle("is-error", kind === "error");
  status.classList.toggle("is-success", kind === "success");
  form.classList.toggle("is-sent", kind === "success");
  status.replaceChildren();
  if (kind === "success") {
    const title = document.createElement("strong");
    title.className = "form-status-title";
    title.textContent = t("form.successTitle");
    const detail = document.createElement("span");
    detail.className = "form-status-detail";
    detail.textContent = t(key);
    status.append(title, detail);
    return;
  }
  status.textContent = t(key);
}

function bindPartnerForm() {
  const form = document.getElementById("partner-form");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    const submit = form.querySelector("button[type='submit']");
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
      setPartnerStatus(form, status, "success", "form.success");
      form.reset();
      return;
    }
    const missing = ["name", "type", "city", "phone", "email", "idea"].some((key) => !fields[key]);
    if (missing || !form.checkValidity()) {
      form.reportValidity();
      setPartnerStatus(form, status, "error", "form.error");
      return;
    }
    setPartnerStatus(form, status, "pending", "form.sending");
    if (submit) submit.disabled = true;
    const endpoint = RacletteSite.partnerInquiryUrl();
    const body = partnerPayload(fields);
    let ok = false;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(body)
      });
      const payload = await response.json().catch(() => ({}));
      ok = response.ok && (payload.success === true || payload.success === "true" || payload.ok === true);
      window.__lastPartnerInquiry = { endpoint, ok, fields };
    } catch (err) {
      window.__lastPartnerInquiry = { endpoint, ok: false, error: String(err) };
    }
    if (submit) submit.disabled = false;
    if (ok) {
      setPartnerStatus(form, status, "success", "form.success");
      form.reset();
      return;
    }
    setPartnerStatus(form, status, "error", "form.sendError");
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
    const status = locatedStatus(origin.lat, origin.lng, origin.accuracy, origin.source, origin.staleKm);
    showNavigateNearest(status.nearest);
    setStatus(status.key, status.vars);
  }
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
  const accuracy = Number(fix.accuracy);
  origin = {
    lat: fix.lat,
    lng: fix.lng,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
    source: fix.source || "browser",
    staleKm: Number(fix.staleKm) || 0
  };
  const status = locatedStatus(origin.lat, origin.lng, origin.accuracy, origin.source, origin.staleKm);
  country = status.nearest.country || country;
  pickedId = status.nearest.id;
  renderNetwork();
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
  setStatus("points.locating");
  hideNavigateNearest();
  const locateBtn = document.getElementById("locate");
  if (locateBtn) locateBtn.disabled = true;
  try {
    const result = await RacletteGeo.acquireFix({
      geolocation: navigator.geolocation,
      fetch,
      networkUrl: new URL("api/where", location.href).href
    });
    if (!result.fix) {
      restoreNavigate();
      setStatus(result.reason === "unsupported" ? "points.unsupported" : "points.denied");
      return;
    }
    applyLocatedOrigin(result.fix);
  } catch (err) {
    restoreNavigate();
    setStatus("points.denied");
  } finally {
    locateBusy = false;
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
    document.getElementById("point-cards").addEventListener("click", (event) => {
      const link = event.target.closest("a[data-route]");
      if (!link || origin) return;
      event.preventDefault();
      locate();
    });
    document.getElementById("navigate-nearest").addEventListener("click", (event) => {
      if (origin && event.currentTarget.getAttribute("href")) return;
      event.preventDefault();
      locate();
    });
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
