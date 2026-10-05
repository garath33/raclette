(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RacletteSite = api;
})(typeof self !== "undefined" ? self : this, function () {
  const STAGING_BASE = "https://garath33.github.io/raclette/";
  const LANGUAGES = ["cs", "en", "fr", "sk", "it", "de", "pl", "es", "ru"];
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
  const SITES = {
    "raclettelovers.com": { lang: "en", native: ["en", "pl", "es", "ru"] },
    "raclettelovers.cz": { lang: "cs", native: ["cs"] },
    "raclettelovers.sk": { lang: "sk", native: ["sk"] },
    "raclettelovers.ch": { lang: "de", native: ["de", "fr", "it"] }
  };
  const LANGUAGE_HOME = {
    cs: "raclettelovers.cz",
    sk: "raclettelovers.sk",
    en: "raclettelovers.com",
    de: "raclettelovers.ch",
    fr: "raclettelovers.ch",
    it: "raclettelovers.ch",
    pl: "raclettelovers.com",
    es: "raclettelovers.com",
    ru: "raclettelovers.com"
  };

  function normalizedHost(hostname) {
    return String(hostname || "").toLowerCase().replace(/\.$/, "");
  }

  function apexHost(hostname) {
    return normalizedHost(hostname).replace(/^www\./, "");
  }

  function siteFor(hostname) {
    return SITES[apexHost(hostname)] || null;
  }

  function isPreviewHost(hostname) {
    const host = apexHost(hostname);
    return host === "localhost" || host === "127.0.0.1" || host.endsWith("github.io");
  }

  function isLoversHost(hostname) {
    return Boolean(siteFor(hostname));
  }

  function isComHost(hostname) {
    return apexHost(hostname) === "raclettelovers.com";
  }

  function isStagingHost(hostname) {
    return isPreviewHost(hostname) || isLoversHost(hostname);
  }

  function defaultLanguage(hostname) {
    const site = siteFor(hostname);
    return site ? site.lang : null;
  }

  function isNativeLanguage(hostname, code) {
    const site = siteFor(hostname);
    return Boolean(site && site.native.indexOf(code) !== -1);
  }

  function preferredLanguage(hostname, browserLanguage) {
    const site = siteFor(hostname);
    if (!site) return null;
    const code = String(browserLanguage || "").slice(0, 2).toLowerCase();
    if (site.native.indexOf(code) !== -1) return code;
    return site.lang;
  }

  function languageHome(code) {
    return LANGUAGE_HOME[code] || "raclettelovers.com";
  }

  function languageUrl(code, loc) {
    loc = loc || {};
    const hostname = loc.hostname || "";
    if (LANGUAGES.indexOf(code) === -1) code = defaultLanguage(hostname) || "cs";
    const hash = loc.hash || "";

    if (isPreviewHost(hostname)) {
      const origin = loc.origin || "http://" + hostname;
      const url = new URL(origin);
      url.pathname = loc.pathname || "/";
      url.search = "";
      url.searchParams.set("lang", code);
      url.hash = hash;
      return url.toString();
    }

    const host = languageHome(code);
    const url = new URL("https://" + host + "/");
    if (SITES[host].lang !== code) url.searchParams.set("lang", code);
    url.hash = hash;
    return url.toString();
  }

  function htmlLang(code, hostname) {
    if (apexHost(hostname) === "raclettelovers.ch" && (code === "de" || code === "fr" || code === "it")) {
      return code + "-CH";
    }
    return code === "cs" ? "cs" : code;
  }

  function ogLocale(code, hostname) {
    if (apexHost(hostname) === "raclettelovers.ch") {
      if (code === "de") return "de_CH";
      if (code === "fr") return "fr_CH";
      if (code === "it") return "it_CH";
    }
    return OG_LOCALE[code] || "cs_CZ";
  }

  function setMeta(name, content) {
    let el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setProperty(property, content) {
    let el = document.querySelector('meta[property="' + property + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function apply(lang, translate, loc) {
    loc = loc || (typeof location !== "undefined" ? location : { hostname: "", origin: "", pathname: "/", hash: "" });
    const title = translate("meta.title");
    const description = translate("meta.description");
    const href = languageUrl(lang, loc);
    document.title = title;
    setMeta("description", description);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:locale", ogLocale(lang, loc.hostname));
    setProperty("og:url", href);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = href;
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
      const code = link.getAttribute("hreflang");
      if (code === "x-default") {
        const fallback = isPreviewHost(loc.hostname) ? (defaultLanguage(loc.hostname) || "cs") : "en";
        link.href = languageUrl(fallback, loc);
      } else if (LANGUAGES.indexOf(code) !== -1) {
        link.href = languageUrl(code, loc);
      }
    });
    const staging = isStagingHost(loc.hostname);
    setMeta("robots", staging ? "noindex, follow" : "index, follow");
    const banner = document.getElementById("env-banner");
    if (banner) {
      banner.hidden = !staging;
      banner.textContent = translate("env.banner");
    }
  }

  return {
    STAGING_BASE,
    LANGUAGES,
    OG_LOCALE,
    SITES,
    LANGUAGE_HOME,
    isPreviewHost,
    isLoversHost,
    isStagingHost,
    isComHost,
    isNativeLanguage,
    defaultLanguage,
    preferredLanguage,
    languageHome,
    languageUrl,
    htmlLang,
    ogLocale,
    apply
  };
});
