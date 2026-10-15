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

  return { POINTS, PENDING, COUNTRIES, placesFor, branchCount, homeCountry };
});
