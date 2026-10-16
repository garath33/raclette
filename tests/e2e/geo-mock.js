/** Shared geo mocks for Playwright e2e tests.
 * geo.js after denied/timeout also calls watchPosition (8–15 s)
 * and resolveFailureStatusKey reads navigator.permissions.query.
 */
function mockGeoError(page, code, message, permState) {
  return page.addInitScript(
    ({ code, message, permState }) => {
      const fail = (_ok, err) => {
        if (typeof err === "function") err({ code, message });
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition = fail;
        navigator.geolocation.watchPosition = (ok, err) => {
          fail(ok, err);
          return 0;
        };
        navigator.geolocation.clearWatch = () => {};
      }
      // null → needGps (Chrome); "denied" → deniedSite / needGpsInstalled; "prompt" → needGpsPrompt
      if (navigator.permissions && typeof navigator.permissions.query === "function") {
        navigator.permissions.query = async (desc) => {
          if (desc && desc.name === "geolocation") {
            if (permState == null) {
              throw new Error("permissions unavailable");
            }
            return { state: permState, onchange: null };
          }
          return { state: "prompt", onchange: null };
        };
      }
    },
    { code, message, permState: permState === undefined ? null : permState }
  );
}

module.exports = { mockGeoError };
