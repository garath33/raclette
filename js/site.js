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

  function normalizedHost(hostname) {
    return String(hostname || "").toLowerCase().replace(/\.$/, "");
  }

  function isComHost(hostname) {
    const host = normalizedHost(hostname);
    return host === "raclettelovers.com" || host === "www.raclettelovers.com";
  }

  function isStagingHost(hostname) {
    const host = normalizedHost(hostname);
    return host === "localhost" || host === "127.0.0.1" || host.endsWith("github.io");
  }

  function defaultLanguage(hostname) {
    return isComHost(hostname) ? "en" : null;
  }

  function pageUrl(code) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", code);
    url.hash = "";
    return url.toString();
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

  function apply(lang, translate) {
    const title = translate("meta.title");
    const description = translate("meta.description");
    document.title = title;
    setMeta("description", description);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:locale", OG_LOCALE[lang] || "cs_CZ");
    setProperty("og:url", pageUrl(lang));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = pageUrl(lang);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
      const code = link.getAttribute("hreflang");
      if (code === "x-default") link.href = pageUrl(defaultLanguage(location.hostname) || "cs");
      else if (LANGUAGES.indexOf(code) !== -1) link.href = pageUrl(code);
    });
    const staging = isStagingHost(location.hostname);
    setMeta("robots", staging ? "noindex, follow" : "index, follow");
    const banner = document.getElementById("env-banner");
    if (banner) {
      banner.hidden = !staging;
      banner.textContent = translate("env.banner");
    }
  }

  return { STAGING_BASE, LANGUAGES, OG_LOCALE, isStagingHost, isComHost, defaultLanguage, apply };
});
