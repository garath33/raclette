const LANGS = ["cs", "en", "fr", "sk", "it", "de", "pl", "es", "ru"];
const HOST_LANG = {
  "raclettelovers.cz": "cs",
  "raclettelovers.sk": "sk",
  "raclettelovers.ch": "fr",
  "raclettelovers.com": "en"
};
const HOME = {
  cs: "https://raclettelovers.cz",
  sk: "https://raclettelovers.sk",
  fr: "https://raclettelovers.ch"
};
const COM_ORIGIN = "https://www.raclettelovers.com";
const OG_LOCALE = {
  cs: "cs_CZ",
  en: "en_GB",
  fr: "fr_FR",
  sk: "sk_SK",
  it: "it_IT",
  de: "de_DE",
  pl: "pl_PL",
  es: "es_ES",
  ru: "ru_RU"
};
const PAGES = [
  { kind: "home", path: "/" },
  { kind: "partners", path: "/pro-partnery.html" },
  { kind: "app", path: "/app.html" }
];
const APP_LANGS = ["cs", "en", "fr", "sk"];

function apex(hostname) {
  return String(hostname || "").toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

function originFor(hostname) {
  const host = apex(hostname);
  if (host === "raclettelovers.com") return COM_ORIGIN;
  if (HOST_LANG[host]) return "https://" + host;
  return null;
}

export function pagePath(pathname) {
  const leaf = String(pathname || "").split("/").filter(Boolean).pop() || "";
  if (leaf === "pro-partnery.html" || leaf === "pro-partnery") return "/pro-partnery.html";
  if (leaf === "app.html" || leaf === "app") return "/app.html";
  return "/";
}

function isContentPage(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  return path === "/" || path === "/index.html" || path === "/pro-partnery" || path === "/pro-partnery.html" || path === "/app" || path === "/app.html";
}

export function languageFor(hostname, search) {
  const params = new URLSearchParams(search || "");
  const asked = params.get("lang");
  if (LANGS.indexOf(asked) !== -1) return asked;
  return HOST_LANG[apex(hostname)] || null;
}

export function htmlLang(lang, hostname) {
  if (apex(hostname) === "raclettelovers.ch" && (lang === "de" || lang === "fr" || lang === "it")) return lang + "-CH";
  return lang || "en";
}

export function ogLocale(lang, hostname) {
  if (apex(hostname) === "raclettelovers.ch") {
    if (lang === "de") return "de_CH";
    if (lang === "fr") return "fr_CH";
    if (lang === "it") return "it_CH";
  }
  return OG_LOCALE[lang] || "en_GB";
}

export function canonicalFor(hostname, search, pathname) {
  const lang = languageFor(hostname, search) || "en";
  const origin = HOME[lang] || COM_ORIGIN;
  const path = pagePath(pathname);
  if (path === "/") return origin + "/?lang=" + lang;
  return origin + path + "?lang=" + lang;
}

export function indexRedirect(hostname, pathname, search) {
  const origin = originFor(hostname);
  if (!origin || !isContentPage(pathname)) return null;
  const path = pagePath(pathname);
  const params = new URLSearchParams(search || "");
  const asked = params.get("lang");
  const langOk = LANGS.indexOf(asked) !== -1;
  const current = String(pathname || "").replace(/\/+$/, "") || "/";
  const pathOk = current === path;
  if (langOk && pathOk) return null;
  if (!langOk) params.set("lang", HOST_LANG[apex(hostname)]);
  const query = params.toString();
  return origin + path + (query ? "?" + query : "");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}

function skipString(source, index) {
  const quote = source[index];
  let i = index + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  return source.length;
}

function matchingBrace(source, open) {
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(source, i) - 1;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return source.length - 1;
}

function readString(source, index) {
  const quote = source[index];
  let i = index + 1;
  let value = "";
  while (i < source.length) {
    if (source[i] === "\\") {
      const next = source[i + 1];
      if (next === "n") value += "\n";
      else if (next === "u") {
        value += String.fromCharCode(parseInt(source.slice(i + 2, i + 6), 16));
        i += 6;
        continue;
      } else value += next || "";
      i += 2;
      continue;
    }
    if (source[i] === quote) return { value, end: i + 1 };
    value += source[i];
    i += 1;
  }
  return { value, end: source.length };
}

function parsePairs(body) {
  const pack = {};
  for (let i = 0; i < body.length; i += 1) {
    if (body[i] !== '"') continue;
    const key = readString(body, i);
    let j = key.end;
    while (j < body.length && body[j] !== ":") {
      if (body[j] === '"' || body[j] === "'" || body[j] === "`") {
        j = skipString(body, j);
        continue;
      }
      j += 1;
    }
    j += 1;
    while (j < body.length && /\s/.test(body[j])) j += 1;
    if (body[j] !== '"') {
      i = key.end - 1;
      continue;
    }
    const val = readString(body, j);
    pack[key.value] = val.value;
    i = val.end - 1;
  }
  return pack;
}

export function extractPacks(source) {
  const packs = {};
  const text = String(source || "");
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '"' || text[i] === "'" || text[i] === "`") {
      i = skipString(text, i) - 1;
      continue;
    }
    if (text.startsWith("//", i)) {
      const nl = text.indexOf("\n", i);
      i = nl === -1 ? text.length : nl;
      continue;
    }
    if (text.startsWith("/*", i)) {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? text.length : end + 1;
      continue;
    }
    const before = i === 0 ? "" : text[i - 1];
    if (before && /[A-Za-z0-9_]/.test(before)) continue;
    const match = /^(cs|en|fr|sk|it|de|pl|es|ru)\s*:/.exec(text.slice(i));
    if (!match) continue;
    let j = i + match[0].length;
    while (j < text.length && /\s/.test(text[j])) j += 1;
    if (text[j] === "{") {
      const end = matchingBrace(text, j);
      packs[match[1]] = Object.assign(packs[match[1]] || {}, parsePairs(text.slice(j + 1, end)));
      i = end;
      continue;
    }
    if (text[j] === '"' || text[j] === "'") {
      const read = readString(text, j);
      packs[match[1]] = packs[match[1]] || {};
      if (!packs[match[1]]["celeb.ig"]) packs[match[1]]["celeb.ig"] = read.value;
      i = read.end - 1;
    }
  }
  return packs;
}

export function mergePacks(base, extra) {
  const out = base || {};
  Object.keys(extra || {}).forEach((lang) => {
    out[lang] = Object.assign(out[lang] || {}, extra[lang]);
  });
  return out;
}

export function extractPoints(source) {
  const points = [];
  const re = /id:\s*"([^"]+)"\s*,\s*country:\s*"([^"]+)"\s*,\s*lat:\s*([0-9.]+)\s*,\s*lng:\s*([0-9.]+)\s*,\s*address:\s*"([^"]*)"\s*,\s*web:\s*(null|"[^"]*")(?:\s*,\s*phone:\s*"([^"]*)")?/g;
  let match;
  while ((match = re.exec(source))) {
    points.push({
      id: match[1],
      country: match[2],
      lat: Number(match[3]),
      lng: Number(match[4]),
      address: match[5],
      web: match[6] === "null" ? null : match[6].slice(1, -1),
      phone: match[7] || ""
    });
  }
  return points;
}

export function pageKind(pathname) {
  const path = pagePath(pathname);
  if (path === "/pro-partnery.html") return "partners";
  if (path === "/app.html") return "app";
  return "home";
}

export function pageCopy(pack, kind) {
  const bag = pack || {};
  if (kind === "partners") return { title: bag["franchise.title"] || "", description: bag["franchise.lead"] || "" };
  if (kind === "app") return { title: bag["app.meta.title"] || "", description: bag["app.meta.description"] || "" };
  return { title: bag["meta.title"] || "", description: bag["meta.description"] || "" };
}

export function withLang(href, lang) {
  const raw = String(href || "");
  if (!raw || /^(https?:|mailto:|tel:|#)/i.test(raw.trim())) return raw;
  const hashAt = raw.indexOf("#");
  const hash = hashAt >= 0 ? raw.slice(hashAt) : "";
  const before = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
  const path = before.split("?")[0];
  const leaf = path.split("/").filter(Boolean).pop() || "";
  if (leaf !== "index.html" && leaf !== "pro-partnery.html" && leaf !== "app.html" && leaf !== "pro-partnery" && leaf !== "app") return raw;
  return path + "?lang=" + lang + hash;
}

function replaceAttr(html, attr, value) {
  const safe = escapeAttr(value);
  const re = new RegExp("(<meta\\s+(?:name|property)=\"" + attr + "\"\\s+content=\")[^\"]*(\")");
  if (re.test(html)) return html.replace(re, "$1" + safe + "$2");
  const re2 = new RegExp("(<meta\\s+content=\")[^\"]*(\"\\s+(?:name|property)=\"" + attr + "\")");
  if (re2.test(html)) return html.replace(re2, "$1" + safe + "$2");
  return null;
}

function replaceNamedMeta(html, name, value) {
  const next = replaceAttr(html, name, value);
  if (next !== null) return next;
  const safe = escapeAttr(value);
  const tag = name.indexOf("og:") === 0
    ? "<meta property=\"" + name + "\" content=\"" + safe + "\">"
    : "<meta name=\"" + name + "\" content=\"" + safe + "\">";
  if (!html.includes("</head>")) return html;
  return html.replace("</head>", "  " + tag + "\n</head>");
}

function selectLanguage(html, lang) {
  return html.replace(/<select id="lang">([\s\S]*?)<\/select>/, (full, inner) => {
    const cleaned = inner.replace(/\s+selected(?:=(?:"selected"|'selected'|selected))?/g, "");
    const next = cleaned.replace(new RegExp("(<option value=\"" + lang + "\")"), "$1 selected");
    return "<select id=\"lang\">" + next + "</select>";
  });
}

function replaceI18n(html, pack) {
  let out = html.replace(/<([a-zA-Z0-9]+)([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (full, tag, attrs, key, inner) => {
    if (inner.includes("<")) return full;
    const value = pack[key];
    if (typeof value !== "string" || value === "") return full;
    return "<" + tag + attrs + ">" + escapeText(value) + "</" + tag + ">";
  });
  out = out.replace(/<[^>]*\sdata-i18n-alt="([^"]+)"[^>]*>/g, (tag, key) => {
    const value = pack[key];
    if (typeof value !== "string" || value === "") return tag;
    const safe = escapeAttr(value);
    if (/\salt="/.test(tag)) return tag.replace(/\salt="[^"]*"/, " alt=\"" + safe + "\"");
    return tag.replace(/>$/, " alt=\"" + safe + "\">");
  });
  out = out.replace(/<[^>]*\sdata-i18n-title="([^"]+)"[^>]*>/g, (tag, key) => {
    const value = pack[key];
    if (typeof value !== "string" || value === "") return tag;
    const safe = escapeAttr(value);
    if (/\stitle="/.test(tag)) return tag.replace(/\stitle="[^"]*"/, " title=\"" + safe + "\"");
    return tag.replace(/>$/, " title=\"" + safe + "\">");
  });
  return out;
}

function decorateHrefs(html, lang) {
  return html.replace(/\shref="([^"]*)"/g, (full, href) => " href=\"" + withLang(href, lang) + "\"");
}

function pointsLd(pack, points) {
  const items = points.map((point, index) => {
    const name = (pack && pack["point." + point.id + ".name"]) || point.id;
    const item = {
      "@type": "FoodEstablishment",
      name: "Raclette Point Original — " + name,
      address: point.address,
      servesCuisine: "Swiss",
      geo: { "@type": "GeoCoordinates", latitude: point.lat, longitude: point.lng }
    };
    if (point.web) item.url = point.web;
    if (point.phone) item.telephone = point.phone;
    return { "@type": "ListItem", position: index + 1, item };
  });
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: (pack && pack["points.title"]) || "Raclette Point Original",
    itemListElement: items
  };
}

function webpageLd(copy, canonical, lang, hostname) {
  const origin = HOME[lang] || COM_ORIGIN;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.title,
    description: copy.description,
    url: canonical,
    inLanguage: htmlLang(lang, hostname),
    isPartOf: { "@type": "WebSite", name: "Raclette Point Original", url: origin + "/" }
  };
}

function jsonScript(id, data) {
  const body = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
  return "<script type=\"application/ld+json\" id=\"" + id + "\">\n" + body + "\n  </script>";
}

function upsertJson(html, id, data) {
  const block = jsonScript(id, data);
  const re = new RegExp("<script type=\"application/ld\\+json\" id=\"" + id + "\">[\\s\\S]*?</script>");
  if (re.test(html)) return html.replace(re, block);
  return html.replace("</head>", "  " + block + "\n</head>");
}

export function localizeHtml(html, lang, packs, hostname, pathname, points) {
  const pack = (packs && packs[lang]) || null;
  if (!pack) return html;
  const kind = pageKind(pathname);
  const copy = pageCopy(pack, kind);
  const canonical = canonicalFor(hostname, "?lang=" + lang, pathname);
  let out = replaceI18n(html, pack);
  out = decorateHrefs(out, lang);
  out = out.replace(/<html lang="[^"]*">/, "<html lang=\"" + htmlLang(lang, hostname) + "\">");
  if (copy.title) {
    out = out.replace(/<title>[^<]*<\/title>/, "<title>" + escapeText(copy.title) + "</title>");
    out = replaceNamedMeta(out, "og:title", copy.title);
    out = replaceNamedMeta(out, "twitter:title", copy.title);
  }
  if (copy.description) {
    out = replaceNamedMeta(out, "description", copy.description);
    out = replaceNamedMeta(out, "og:description", copy.description);
    out = replaceNamedMeta(out, "twitter:description", copy.description);
  }
  out = replaceNamedMeta(out, "og:locale", ogLocale(lang, hostname));
  if (pack["hero.photoAlt"] && kind !== "app") out = replaceNamedMeta(out, "og:image:alt", pack["hero.photoAlt"]);
  out = selectLanguage(out, lang);
  out = upsertJson(out, "webpage-ld", webpageLd(copy, canonical, lang, hostname));
  if (kind === "home") out = upsertJson(out, "points-ld", pointsLd(pack, points || []));
  return out;
}

function stampHead(html, canonical, robots) {
  return html
    .replace(/<meta name="robots" content="[^"]*">/, "<meta name=\"robots\" content=\"" + robots + "\">")
    .replace(/<link rel="canonical" href="[^"]*">/, "<link rel=\"canonical\" href=\"" + canonical + "\">")
    .replace(/<meta property="og:url" content="[^"]*">/, "<meta property=\"og:url\" content=\"" + canonical + "\">");
}

export function prepareHtml(html, hostname, search, pathname, packs, points) {
  const host = apex(hostname);
  const explicit = new URLSearchParams(search || "").get("lang");
  if (!HOST_LANG[host]) {
    let out = html.replace(/<meta name="robots" content="[^"]*">/, "<meta name=\"robots\" content=\"noindex, follow\">");
    if (!packs || LANGS.indexOf(explicit) === -1) return out;
    const canonical = canonicalFor(hostname, search, pathname);
    out = stampHead(out, canonical, "noindex, follow");
    return localizeHtml(out, explicit, packs, hostname, pathname, points);
  }
  const canonical = canonicalFor(hostname, search, pathname);
  const out = stampHead(html, canonical, "index, follow");
  const lang = languageFor(hostname, search);
  if (!packs || !lang) return out;
  return localizeHtml(out, lang, packs, hostname, pathname, points);
}

function langsFor(kind) {
  return kind === "app" ? APP_LANGS : LANGS;
}

export function sitemapXml() {
  const lines = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">"
  ];
  for (const page of PAGES) {
    const langs = langsFor(page.kind);
    for (const lang of langs) {
      const loc = canonicalFor(languageHost(lang), "?lang=" + lang, page.path);
      lines.push("  <url>");
      lines.push("    <loc>" + loc + "</loc>");
      for (const alt of langs) {
        lines.push("    <xhtml:link rel=\"alternate\" hreflang=\"" + alt + "\" href=\"" + canonicalFor(languageHost(alt), "?lang=" + alt, page.path) + "\"/>");
      }
      lines.push("    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" + canonicalFor(languageHost("en"), "?lang=en", page.path) + "\"/>");
      lines.push("  </url>");
    }
  }
  lines.push("</urlset>");
  lines.push("");
  return lines.join("\n");
}

function languageHost(lang) {
  if (lang === "cs") return "raclettelovers.cz";
  if (lang === "sk") return "raclettelovers.sk";
  if (lang === "fr") return "raclettelovers.ch";
  return "www.raclettelovers.com";
}

export { LANGS, HOST_LANG, APP_LANGS };
