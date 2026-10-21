import fs from "node:fs";
import { extractPacks, extractPoints, localizeHtml, mergePacks, sitemapXml } from "./seo-html.mjs";

const files = ["js/i18n.js", "js/i18n-extra.js", "js/i18n-app.js", "js/i18n-ig.js"];
let packs = {};
for (const file of files) packs = mergePacks(packs, extractPacks(fs.readFileSync(file, "utf8")));
const points = extractPoints(fs.readFileSync("js/points.js", "utf8"));
const pages = [
  ["index.html", "/", "www.raclettelovers.com"],
  ["pro-partnery.html", "/pro-partnery.html", "www.raclettelovers.com"],
  ["app.html", "/app.html", "www.raclettelovers.com"]
];
for (const [file, path, host] of pages) {
  const html = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, localizeHtml(html, "en", packs, host, path, points));
}
fs.writeFileSync("sitemap.xml", sitemapXml("www.raclettelovers.com"));
