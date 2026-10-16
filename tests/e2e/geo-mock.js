/** Shared geo mocks for Playwright smoke tests.
 * geo.js after denied/timeout also calls watchPosition (8–15 s).
 * Tests must mock both getCurrentPosition and watchPosition.
 */
function mockGeoError(page, code, message) {
  return page.addInitScript(
    ({ code, message }) => {
      const fail = (_ok, err) => {
        if (typeof err === "function") err({ code, message });
      };
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition = fail;
      navigator.geolocation.watchPosition = (ok, err) => {
        fail(ok, err);
        return 0;
      };
      navigator.geolocation.clearWatch = () => {};
    },
    { code, message }
  );
}

module.exports = { mockGeoError };
