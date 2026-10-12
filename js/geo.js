(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RacletteGeo = api;
})(typeof self !== "undefined" ? self : this, function () {
  function haversine(aLat, aLng, bLat, bLng) {
    const R = 6371;
    const dLat = ((bLat - aLat) * Math.PI) / 180;
    const dLng = ((bLng - aLng) * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((aLat * Math.PI) / 180) *
        Math.cos((bLat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function rank(points, lat, lng) {
    return points
      .map((point) => ({ point, km: haversine(lat, lng, point.lat, point.lng) }))
      .sort((a, b) => a.km - b.km || a.point.id.localeCompare(b.point.id));
  }

  function nearest(points, lat, lng) {
    const ranked = rank(points, lat, lng);
    return ranked.length ? ranked[0].point : undefined;
  }

  /**
   * A fix with this accuracy radius cannot change the nearest Point when the
   * gap to the runner-up is larger than twice the radius: the reading can
   * move toward the second Point and away from the first at the same time.
   */
  function nearestIsStable(points, lat, lng, accuracyMeters) {
    const ranked = rank(points, lat, lng);
    if (ranked.length < 2) return true;
    const accuracy = Number(accuracyMeters);
    if (!Number.isFinite(accuracy) || accuracy < 0) return false;
    const gapMeters = (ranked[1].km - ranked[0].km) * 1000;
    return gapMeters > accuracy * 2;
  }

  /** precise: trust the fix. coarse: approximate, but the winner holds. uncertain: the error can flip it. */
  function readingKind(points, lat, lng, accuracyMeters) {
    const COARSE_M = 300;
    const accuracy = Number(accuracyMeters);
    if (!Number.isFinite(accuracy) || accuracy < COARSE_M) return "precise";
    if (rank(points, lat, lng).length < 2) return "precise";
    return nearestIsStable(points, lat, lng, accuracy) ? "coarse" : "uncertain";
  }

  /**
   * Directions URL for Google Maps. Destination only — no frozen browser GPS as origin.
   * Maps then starts from the device's live "Your location", which is more accurate indoors
   * than a one-shot navigator.geolocation reading pinned into the URL.
   */
  function mapsDirUrl(point) {
    const dest = point.lat + "," + point.lng;
    return (
      "https://www.google.com/maps/dir/?api=1" +
      "&destination=" + encodeURIComponent(dest) +
      "&travelmode=driving" +
      "&dir_action=navigate"
    );
  }

  return { haversine, rank, nearest, nearestIsStable, readingKind, mapsDirUrl };
});
