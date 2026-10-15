const LANGS = ["cs", "en", "fr", "sk", "it", "de", "pl", "es", "ru"];
const HOME = {
  cs: "https://raclettelovers.cz",
  sk: "https://raclettelovers.sk",
  fr: "https://raclettelovers.ch",
};
const HOST_LANG = {
  "raclettelovers.cz": "cs",
  "raclettelovers.sk": "sk",
  "raclettelovers.ch": "fr",
  "raclettelovers.com": "en",
};

const TARGETS = {
  "www.raclettelovers.cz": "https://raclettelovers.cz",
  "www.raclettelovers.sk": "https://raclettelovers.sk",
  "www.raclettelovers.ch": "https://raclettelovers.ch",
  "raclette-lovers.com": "https://www.raclettelovers.com",
  "www.raclette-lovers.com": "https://www.raclettelovers.com",
  "raclette-point-original.com": "https://www.raclettelovers.com",
  "www.raclette-point-original.com": "https://www.raclettelovers.com",
  "raclettepointoriginal.com": "https://www.raclettelovers.com",
  "www.raclettepointoriginal.com": "https://www.raclettelovers.com",
  "raclettepointoriginal.cz": "https://raclettelovers.cz",
  "www.raclettepointoriginal.cz": "https://raclettelovers.cz",
  "raclettepointoriginal.sk": "https://raclettelovers.sk",
  "www.raclettepointoriginal.sk": "https://raclettelovers.sk",
  "raclettepointoriginal.ch": "https://raclettelovers.ch",
  "www.raclettepointoriginal.ch": "https://raclettelovers.ch",
};

export function pagePath(pathname) {
  const leaf = String(pathname || "").split("/").filter(Boolean).pop() || "";
  if (leaf === "pro-partnery.html" || leaf === "pro-partnery") return "/pro-partnery.html";
  if (leaf === "app.html" || leaf === "app") return "/app.html";
  return "/";
}

export function canonicalFor(hostname, search, pathname) {
  const host = String(hostname || "").toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const params = new URLSearchParams(search || "");
  let lang = params.get("lang");
  if (LANGS.indexOf(lang) === -1) lang = HOST_LANG[host] || "en";
  const origin = HOME[lang] || "https://www.raclettelovers.com";
  const path = pagePath(pathname);
  if (path === "/") return origin + "/?lang=" + lang;
  return origin + path + "?lang=" + lang;
}

export function networkLocation(request) {
  const cf = (request && request.cf) || {};
  const lat = Number(cf.latitude);
  const lng = Number(cf.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const city = typeof cf.city === "string" ? cf.city : "";
  return { lat, lng, accuracy: 20000, city };
}

export function prepareHtml(html, hostname, search, pathname) {
  const host = String(hostname || "").toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  if (!HOST_LANG[host]) return html;
  const canonical = canonicalFor(hostname, search, pathname);
  return html
    .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="index, follow">')
    .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + canonical + '">')
    .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + canonical + '">');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = TARGETS[url.hostname];
    if (target) {
      return Response.redirect(target + url.pathname + url.search, 301);
    }
    if (url.pathname === "/api/where") {
      const loc = networkLocation(request);
      const headers = {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      };
      if (!loc) return new Response(JSON.stringify({ ok: false }), { status: 404, headers });
      return new Response(JSON.stringify({ ok: true, lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy, city: loc.city }), { headers });
    }
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html")) return response;
    const html = prepareHtml(await response.text(), url.hostname, url.search, url.pathname);
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  },
};
