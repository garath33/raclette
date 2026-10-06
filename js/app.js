const POINTS = RaclettePoints.POINTS;

const MENU = ["menu.classic", "menu.fries", "menu.tenderloin", "menu.panini"];
const MENU_COLORS = ["#fece52", "#f5811f", "#00a85c", "#007dc5"];

let lang = "cs";
let origin = null;
let activeId = "krizovy";

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
  const dest = point.lat + "," + point.lng;
  if (origin) {
    return "https://www.google.com/maps/dir/?api=1&origin=" + origin.lat + "," + origin.lng + "&destination=" + dest + "&travelmode=driving";
  }
  return "https://www.google.com/maps/dir/?api=1&destination=" + dest + "&travelmode=driving";
}

function setStatus(key, vars) {
  const el = document.getElementById("locator-status");
  el.textContent = t(key, vars);
}

function renderPoints() {
  const host = document.getElementById("point-cards");
  const ranked = POINTS.map((point) => {
    const distance = origin ? haversine(origin.lat, origin.lng, point.lat, point.lng) : null;
    return { point, distance };
  }).sort((a, b) => {
    if (a.distance == null || b.distance == null) return 0;
    return a.distance - b.distance;
  });
  const nearestId = origin ? ranked[0].point.id : null;

  host.innerHTML = ranked.map(({ point, distance }, index) => {
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
    if (point.id === activeId) classes.push("is-active");
    if (point.id === nearestId) classes.push("is-nearest");
    return (
      '<article class="' + classes.join(" ") + '" data-id="' + point.id + '" tabindex="0">' +
        '<div class="card-top"><div><p class="kicker">' + t("point." + point.id + ".where") + "</p>" +
        "<h3>" + name + "</h3>" + addressLine(point.id) + away + "</div>" + badge + "</div>" +
        '<p class="note">' + t("point." + point.id + ".note") + "</p>" + phone +
        "<h4>" + t("points.menu") + "</h4><ul class=\"menu\">" + menu + "</ul>" +
        '<div class="card-actions">' + web +
        '<a class="btn btn-solid" href="' + routeUrl(point) + '" target="_blank" rel="noopener noreferrer">' + t("points.route") + "</a></div>" +
      "</article>"
    );
  }).join("");

  host.querySelectorAll(".card").forEach((card) => {
    const select = () => selectPoint(card.dataset.id);
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      select();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });
}

function addressLine(id) {
  const addresses = {
    krizovy: "Za Pilou 6, 790 01 Jeseník",
    spindl: "Špindlerův Mlýn",
    kabrt: "Kladno"
  };
  return '<p class="address">' + addresses[id] + "</p>";
}

function selectPoint(id) {
  activeId = id;
  const point = POINTS.find((item) => item.id === id);
  const frame = document.getElementById("map-frame");
  frame.src = mapSrc(point);
  frame.title = t("points.mapTitle");
  renderPoints();
}

function applyStatic() {
  document.documentElement.lang = RacletteSite.htmlLang(lang, location.hostname);
  RacletteSite.apply(lang, t, location);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  const toggle = document.getElementById("nav-toggle");
  const open = document.getElementById("site-nav").classList.contains("is-open");
  toggle.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
  const frame = document.getElementById("map-frame");
  frame.title = t("points.mapTitle");
  document.getElementById("lang").value = lang;
}

function typeLabel(value) {
  const key = "form.type." + value;
  const label = t(key);
  return label === key ? value : label;
}

function partnerMailto(data) {
  const lines = [
    t("form.mail.name") + ": " + data.name,
    t("form.mail.type") + ": " + typeLabel(data.type),
    t("form.mail.city") + ": " + data.city,
    t("form.mail.phone") + ": " + data.phone,
    t("form.mail.email") + ": " + data.email,
    "",
    t("form.mail.idea") + ":",
    data.idea
  ];
  return "mailto:milan@raclette-original.com?subject=" +
    encodeURIComponent(t("franchise.subject")) +
    "&body=" + encodeURIComponent(lines.join("\n"));
}

function bindPartnerForm() {
  const form = document.getElementById("partner-form");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    const fields = {
      name: form.elements.namedItem("name").value.trim(),
      type: form.elements.namedItem("type").value,
      city: form.elements.namedItem("city").value.trim(),
      phone: form.elements.namedItem("phone").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      idea: form.elements.namedItem("idea").value.trim()
    };
    const missing = Object.values(fields).some((value) => !value);
    if (missing || !form.checkValidity()) {
      form.reportValidity();
      status.hidden = false;
      status.classList.add("is-error");
      status.textContent = t("form.error");
      return;
    }
    status.hidden = false;
    status.classList.remove("is-error");
    status.textContent = t("form.ready");
    const href = partnerMailto(fields);
    window.__lastPartnerMailto = href;
    if (!window.__skipPartnerMailto) window.location.href = href;
  });
}

function setLang(next) {
  if (!LANGS.includes(next)) next = RacletteSite.preferredLanguage(location.hostname, navigator.languages || [navigator.language]) || "cs";
  try { localStorage.setItem("raclette-lang", next); } catch (err) { /* ignore */ }
  const target = new URL(RacletteSite.languageUrl(next, location));
  lang = next;
  history.replaceState(null, "", target.pathname + target.search + target.hash);
  applyStatic();
  const point = POINTS.find((item) => item.id === activeId);
  document.getElementById("map-frame").src = mapSrc(point);
  renderPoints();
  if (!origin) setStatus("points.idle");
}

function locate() {
  if (!navigator.geolocation) {
    setStatus("points.unsupported");
    return;
  }
  setStatus("points.locating");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const nearest = POINTS.slice().sort((a, b) => haversine(origin.lat, origin.lng, a.lat, a.lng) - haversine(origin.lat, origin.lng, b.lat, b.lng))[0];
      activeId = nearest.id;
      const km = formatKm(haversine(origin.lat, origin.lng, nearest.lat, nearest.lng));
      document.getElementById("map-frame").src = mapSrc(nearest);
      renderPoints();
      setStatus("points.found", { name: t("point." + nearest.id + ".name"), km: km });
      document.getElementById("point-cards").querySelector(".card")?.focus();
    },
    () => setStatus("points.denied"),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
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
  document.getElementById("map-frame").src = mapSrc(POINTS[0]);
  renderPoints();
  setStatus("points.idle");

  document.getElementById("lang").addEventListener("change", (event) => setLang(event.target.value));
  document.getElementById("locate").addEventListener("click", locate);
  document.getElementById("hero-locate").addEventListener("click", locate);
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

  const links = [...document.querySelectorAll(".site-nav a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
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

boot();
