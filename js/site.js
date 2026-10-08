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
    "raclettelovers.com": { lang: "en" },
    "raclettelovers.cz": { lang: "cs" },
    "raclettelovers.sk": { lang: "sk" },
    "raclettelovers.ch": { lang: "fr" }
  };
  const COUNTRY_LANG = {
    CZ: "cs",
    SK: "sk",
    CH: "fr",
    DE: "de",
    AT: "de",
    LI: "de",
    FR: "fr",
    LU: "fr",
    MC: "fr",
    IT: "it",
    SM: "it",
    PL: "pl",
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    CL: "es",
    PE: "es",
    UY: "es",
    EC: "es",
    VE: "es",
    RU: "ru",
    BY: "ru",
    KZ: "ru",
    GB: "en",
    US: "en",
    AU: "en",
    CA: "en",
    NZ: "en",
    IE: "en"
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
    return isPreviewHost(hostname);
  }

  function defaultLanguage(hostname) {
    const site = siteFor(hostname);
    return site ? site.lang : null;
  }

  function isNativeLanguage(_hostname, code) {
    return LANGUAGES.indexOf(code) !== -1;
  }

  function languageFromLocales(locales) {
    const list = Array.isArray(locales) ? locales : [locales];
    for (let i = 0; i < list.length; i++) {
      const parts = String(list[i] || "").replace(/_/g, "-").split("-");
      const lang = parts[0].toLowerCase();
      const region = (parts[1] || "").toUpperCase();
      if (lang === "gsw") return "de";
      if (LANGUAGES.indexOf(lang) !== -1) return lang;
      if (COUNTRY_LANG[region] && LANGUAGES.indexOf(COUNTRY_LANG[region]) !== -1) return COUNTRY_LANG[region];
    }
    return null;
  }

  function preferredLanguage(hostname, locales) {
    return languageFromLocales(locales) || defaultLanguage(hostname) || "cs";
  }

  function languageUrl(code, loc) {
    loc = loc || {};
    const hostname = loc.hostname || "";
    if (LANGUAGES.indexOf(code) === -1) code = preferredLanguage(hostname) || "cs";
    const origin = loc.origin || (hostname ? "https://" + hostname : "https://raclettelovers.com");
    const url = new URL(origin);
    url.pathname = loc.pathname || "/";
    url.search = "";
    url.searchParams.set("lang", code);
    url.hash = loc.hash || "";
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

  const INDEX_ORIGIN = {
    cs: "https://raclettelovers.cz",
    sk: "https://raclettelovers.sk",
    fr: "https://raclettelovers.ch"
  };
  const COM_ORIGIN = "https://www.raclettelovers.com";

  function indexedUrl(code) {
    if (LANGUAGES.indexOf(code) === -1) code = "en";
    return (INDEX_ORIGIN[code] || COM_ORIGIN) + "/?lang=" + code;
  }

  function partnerInquiryUrl() {
    return "https://formsubmit.co/ajax/milan@raclette-original.com";
  }

  function apply(lang, translate, loc) {
    loc = loc || (typeof location !== "undefined" ? location : { hostname: "", origin: "", pathname: "/", hash: "" });
    const title = translate("meta.title");
    const description = translate("meta.description");
    const preview = isStagingHost(loc.hostname);
    const href = preview ? languageUrl(lang, loc) : indexedUrl(lang);
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
      if (code === "x-default") link.href = preview ? languageUrl("en", loc) : indexedUrl("en");
      else if (LANGUAGES.indexOf(code) !== -1) link.href = preview ? languageUrl(code, loc) : indexedUrl(code);
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
    COUNTRY_LANG,
    isPreviewHost,
    isLoversHost,
    isStagingHost,
    isComHost,
    isNativeLanguage,
    defaultLanguage,
    languageFromLocales,
    preferredLanguage,
    languageUrl,
    indexedUrl,
    htmlLang,
    ogLocale,
    partnerInquiryUrl,
    apply
  };
});
