const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["geolocation"]);
});


/** geo.js po denied/timeout zkouší i watchPosition (až 8–15 s). Mock musí pokrýt obě cesty. */
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

