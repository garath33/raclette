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
    }
  ];

  return { POINTS };
});
