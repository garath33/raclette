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
      web: "https://krizovyvrch.cz/cs",
      phone: "+420 604 729 730",
      phoneHref: "tel:+420604729730"
    },
    {
      id: "spindl",
      country: "cz",
      lat: 50.7256448,
      lng: 15.6067567,
      web: null
    },
    {
      id: "kabrt",
      country: "cz",
      lat: 50.1466053,
      lng: 14.1026398,
      web: null
    }
  ];

  /* Švýcarská pobočka už je, ale bez adresy a souřadnic. Nesmí vstoupit do výběru nejbližšího Pointu. */
  const PENDING = [
    { id: "swiss", country: "ch" }
  ];

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
