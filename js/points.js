(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RaclettePoints = api;
})(typeof self !== "undefined" ? self : this, function () {
  const POINTS = [
    {
      id: "krizovy",
      lat: 50.2260421,
      lng: 17.2250049,
      web: "https://krizovyvrch.cz/cs",
      phone: "+420 604 729 730",
      phoneHref: "tel:+420604729730"
    },
    {
      id: "spindl",
      lat: 50.7256448,
      lng: 15.6067567,
      web: null
    },
    {
      id: "kabrt",
      lat: 50.1466053,
      lng: 14.1026398,
      web: null
    },
    {
      id: "eddy",
      lat: 46.0632584,
      lng: 7.2161147,
      web: "https://eddy-baillifard.com",
      phone: "+41 27 776 14 70",
      phoneHref: "tel:+41277761470"
    },
    {
      id: "orsieres",
      lat: 46.0409525,
      lng: 7.1467833,
      web: "https://laiterie-orsieres.ch",
      phone: "+41 27 783 29 56",
      phoneHref: "tel:+41277832956"
    },
    {
      id: "mouret",
      lat: 46.7450192,
      lng: 7.1714657,
      web: "https://www.laiterie-du-mouret.ch",
      phone: "+41 26 413 11 07",
      phoneHref: "tel:+41264131107"
    },
    {
      id: "minorit",
      lat: 49.9361636,
      lng: 17.9036825,
      web: "https://minorit-opava.cz/kavarna/",
      phone: "+420 737 286 726",
      phoneHref: "tel:+420737286726"
    },
    {
      id: "bonte",
      lat: 49.9638485,
      lng: 14.0741966,
      web: "https://bontesyry.cz",
      phone: "+420 601 537 896",
      phoneHref: "tel:+420601537896"
    }
  ];

  return { POINTS };
});
