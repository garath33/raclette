const fs = require("node:fs");
const { defineConfig } = require("@playwright/test");

const port = 4174;
const chrome = "/usr/bin/google-chrome";
const localChrome = !process.env.CI && fs.existsSync(chrome);

module.exports = defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:" + port,
    locale: "cs-CZ",
    trace: "retain-on-failure",
    launchOptions: localChrome
      ? { executablePath: chrome, args: ["--no-sandbox", "--disable-dev-shm-usage"] }
      : { args: ["--no-sandbox", "--disable-dev-shm-usage"] }
  },
  webServer: {
    command: "python3 -m http.server " + port,
    url: "http://127.0.0.1:" + port,
    reuseExistingServer: false,
    timeout: 15000
  }
});
