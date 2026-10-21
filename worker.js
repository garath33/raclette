import {
  canonicalFor,
  extractPacks,
  extractPoints,
  htmlLang,
  indexRedirect,
  mergePacks,
  prepareHtml as localizePage
} from "./lib/seo-html.mjs";

export { canonicalFor, indexRedirect };

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formsubmit.co",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "form-action 'self' https://formsubmit.co",
  "upgrade-insecure-requests"
].join("; ");

export function securityHeaders(extra) {
  const headers = new Headers(extra || undefined);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY + "; frame-ancestors 'self'");
  headers.set("Strict-Transport-Security", "max-age=15552000");
  return headers;
}

function redirectTo(location) {
  const headers = securityHeaders();
  headers.set("location", location);
  return new Response(null, { status: 301, headers });
}

function withSecurity(response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: securityHeaders(response.headers)
  });
}

const COPY = ["js/i18n.js", "js/i18n-extra.js", "js/i18n-app.js", "js/i18n-ig.js"];

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
  "raclettelovers.com": "https://www.raclettelovers.com",
};

let copyCache = null;

export async function loadCopy(env, request) {
  if (copyCache) return copyCache;
  let packs = {};
  for (const file of COPY) {
    const asset = await env.ASSETS.fetch(new Request(new URL("/" + file, request.url)));
    if (!asset.ok) return null;
    packs = mergePacks(packs, extractPacks(await asset.text()));
  }
  const pointsFile = await env.ASSETS.fetch(new Request(new URL("/js/points.js", request.url)));
  const points = pointsFile.ok ? extractPoints(await pointsFile.text()) : [];
  const ready = packs.cs && packs.cs["meta.title"] && packs.en && packs.en["meta.title"] && points.length >= 8;
  if (ready) copyCache = { packs, points };
  return { packs, points };
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

export function prepareHtml(html, hostname, search, pathname, packs, points) {
  return localizePage(html, hostname, search, pathname, packs, points);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return redirectTo(url.toString());
    }
    const target = TARGETS[url.hostname];
    if (target) {
      const dest = new URL(target + url.pathname + url.search);
      const hop = indexRedirect(dest.hostname, dest.pathname, dest.search);
      return redirectTo(hop || dest.toString());
    }
    if (url.pathname === "/api/where") {
      const loc = networkLocation(request);
      const headers = securityHeaders({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      });
      if (!loc) return new Response(JSON.stringify({ ok: false }), { status: 404, headers });
      return new Response(JSON.stringify({ ok: true, lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy, city: loc.city }), { headers });
    }
    if (request.method === "GET" || request.method === "HEAD") {
      const hop = indexRedirect(url.hostname, url.pathname, url.search);
      if (hop) return redirectTo(hop);
    }
    if (url.pathname === "/robots.txt") {
      const file = await env.ASSETS.fetch(request);
      const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
      const origin = host === "raclettelovers.com" ? "https://www.raclettelovers.com" : "https://" + host;
      const known = host === "raclettelovers.cz" || host === "raclettelovers.sk" || host === "raclettelovers.ch" || host === "raclettelovers.com";
      if (!known) return withSecurity(file);
      const text = (await file.text()).replace(/Sitemap:\s*\S+/, "Sitemap: " + origin + "/sitemap.xml");
      return new Response(text, {
        status: file.status,
        headers: securityHeaders({ "content-type": "text/plain; charset=utf-8" })
      });
    }
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html") || response.status !== 200) return withSecurity(response);
    const copy = await loadCopy(env, request);
    const html = prepareHtml(
      await response.text(),
      url.hostname,
      url.search,
      url.pathname,
      copy && copy.packs,
      copy && copy.points
    );
    const headers = securityHeaders(response.headers);
    headers.delete("content-length");
    const lang = new URLSearchParams(url.search).get("lang");
    if (lang) headers.set("content-language", htmlLang(lang, url.hostname));
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  },
};
