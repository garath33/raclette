(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RaclettePoints = api;
})(typeof self !== "undefined" ? self : this, function () {
  const POINTS = [
    {
      id: "krizovy",
      country: "cz",
      lat: 50.2260421,
      lng: 17.2250049,
      address: "Za Pilou 6, 790 01 Jeseník",
      web: "https://krizovyvrch.cz/cs",
      phone: "+420 604 729 730",
      phoneHref: "tel:+420604729730"
    },
    {
      id: "spindl",
      country: "cz",
      lat: 50.7256448,
      lng: 15.6067567,
      address: "Špindlerův Mlýn",
      web: null
    },
    {
      id: "kabrt",
      country: "cz",
      lat: 50.1466053,
      lng: 14.1026398,
      address: "Kladno",
      web: null
    },
    {
      id: "minorit",
      country: "cz",
      lat: 49.9361636,
      lng: 17.9036825,
      address: "Masarykova třída 342/39, 746 01 Opava",
      web: "https://minorit-opava.cz/kavarna/",
      phone: "+420 737 286 726",
      phoneHref: "tel:+420737286726"
    },
    {
      id: "bonte",
      country: "cz",
      lat: 49.9638485,
      lng: 14.0741966,
      address: "Husovo náměstí 78/6, 266 01 Beroun",
      web: "https://bontesyry.cz",
      phone: "+420 601 537 896",
      phoneHref: "tel:+420601537896"
    },
    {
      id: "eddy",
      country: "ch",
      lat: 46.0632584,
      lng: 7.2161147,
      address: "Route de Valbord 55, 1934 Bruson",
      web: "https://eddy-baillifard.com",
      phone: "+41 27 776 14 70",
      phoneHref: "tel:+41277761470"
    },
    {
      id: "orsieres",
      country: "ch",
      lat: 46.0409525,
      lng: 7.1467833,
      address: "Route du Grand Saint-Bernard 3, 1937 Orsières",
      web: "https://laiterie-orsieres.ch",
      phone: "+41 27 783 29 56",
      phoneHref: "tel:+41277832956"
    },
    {
      id: "mouret",
      country: "ch",
      lat: 46.7450192,
      lng: 7.1714657,
      address: "Route de la Gruyère 6, 1724 Ferpicloz",
      web: "https://www.laiterie-du-mouret.ch",
      phone: "+41 26 413 11 07",
      phoneHref: "tel:+41264131107"
    }
  ];

  const PENDING = [];

  const COUNTRIES = ["cz", "ch"];

  function placesFor(countryId) {
    return {
      points: POINTS.filter((point) => point.country === countryId),
      pending: PENDING.filter((point) => point.country === countryId)
    };
  }

  function branchCount(countryId) {
    const places = placesFor(countryId);
    return places.points.length + places.pending.length;
  }

  function homeCountry(hostname) {
    const host = String(hostname || "").toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
    return host === "raclettelovers.ch" ? "ch" : "cz";
  }

  const FLAGS = {
    cz: '<svg class="flag-svg" viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="20" fill="#ffffff"/><rect y="20" width="60" height="20" fill="#d7141a"/><path d="M0 0 L28 20 L0 40 Z" fill="#11457e"/></svg>',
    ch: '<svg class="flag-svg" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#da291c"/><rect x="13" y="6" width="6" height="20" fill="#ffffff"/><rect x="6" y="13" width="20" height="6" fill="#ffffff"/></svg>'
  };

  const CONTACT_FLAGS = {
    sk: '<svg class="flag-svg" viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="13.333" fill="#ffffff"/><rect y="13.333" width="60" height="13.334" fill="#0b4ea2"/><rect y="26.667" width="60" height="13.333" fill="#ee1c25"/><path fill="#ee1c25" d="M5 6.2h11.2v14.2c0 4.8-5.6 7.4-5.6 7.4s-5.6-2.6-5.6-7.4z"/><path fill="#fff" d="M10.1 8.2h1.3v2.2h2.3v1.3h-2.3v1.5h2.3v1.3h-2.3V17h-1.3v-2.5H7.8v-1.3h2.3v-1.5H7.8V10.4h2.3z"/><path fill="#0b4ea2" d="M6.6 22.8c1.6-1.8 2.9-1.4 3.6.4.8-2 2.1-2.1 3.6-.2-.3 1.6-3.4 3-3.4 3s-3.3-1.4-3.8-3.2z"/></svg>'
  };

  function flagSvg(countryId) {
    return FLAGS[countryId] || "";
  }

  function contactFlag(countryId) {
    return CONTACT_FLAGS[countryId] || FLAGS[countryId] || "";
  }

  function escAttr(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function branchFlag(countryId, label) {
    const svg = flagSvg(countryId);
    if (!svg) return "";
    return '<span class="card-flag" role="img" aria-label="' + escAttr(label) + '">' + svg + "</span>";
  }

  return { POINTS, PENDING, COUNTRIES, placesFor, branchCount, homeCountry, flagSvg, branchFlag, contactFlag };
});
