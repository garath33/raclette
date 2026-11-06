const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const csstree = require("css-tree");
const { HtmlValidate } = require("html-validate");

const pages = ["index.html", "pro-partnery.html", "app.html"];
const stylesheets = ["css/styles.css", "css/fonts.css"];

function ids(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
}

function localRefs(html, fromFile) {
  const refs = [];
  for (const match of html.matchAll(/\s(?:href|src|srcset)="([^"]*)"/g)) {
    const raw = match[1];
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw) || raw.startsWith("//")) continue;
    const hashAt = raw.indexOf("#");
    const hash = hashAt >= 0 ? decodeURIComponent(raw.slice(hashAt + 1)) : "";
    const beforeHash = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
    const parts = beforeHash.split(",").map((part) => part.trim().split(/\s+/)[0].split("?")[0]).filter(Boolean);
    for (const pathPart of parts.length ? parts : [""]) {
      const file = pathPart === "" ? fromFile : path.normalize(path.join(path.dirname(fromFile), pathPart));
      refs.push({ raw, file, hash });
    }
  }
  return refs;
}

test("sestavení má index, styly a místní odkazy", () => {
  assert.equal(fs.existsSync("index.html"), true);
  assert.ok(fs.statSync("index.html").size > 0);
  const pageHtml = new Map(pages.map((file) => [file, fs.readFileSync(file, "utf8")]));
  for (const [file, html] of pageHtml) {
    for (const sheet of stylesheets) {
      assert.match(html, new RegExp('<link rel="stylesheet" href="' + sheet + '">'), file + " " + sheet);
    }
    for (const ref of localRefs(html, file)) {
      assert.equal(fs.existsSync(ref.file), true, file + " → " + ref.raw);
      if (!ref.hash || !ref.file.endsWith(".html")) continue;
      const target = pageHtml.get(ref.file) || fs.readFileSync(ref.file, "utf8");
      assert.equal(ids(target).has(ref.hash), true, file + " → " + ref.raw);
    }
  }
  for (const sheet of stylesheets) {
    const css = fs.readFileSync(sheet, "utf8");
    assert.ok(css.length > 0, sheet);
    for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
      const value = match[1].trim().replace(/^['"]|['"]$/g, "");
      if (value.startsWith("data:") || value.startsWith("#")) continue;
      const file = path.normalize(path.join(path.dirname(sheet), value));
      assert.equal(fs.existsSync(file), true, sheet + " → " + value);
    }
  }
});

test("veřejné HTML a CSS jsou validní", async () => {
  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:standard"],
    elements: ["html5"]
  });
  for (const file of pages) {
    const report = await htmlvalidate.validateFile(file);
    const messages = report.results.flatMap((result) => result.messages);
    assert.deepEqual(
      messages.map((message) => file + ":" + message.line + " " + message.ruleId + " " + message.message),
      []
    );
  }
  for (const sheet of stylesheets) {
    assert.doesNotThrow(() => csstree.parse(fs.readFileSync(sheet, "utf8"), { positions: true }), sheet);
  }
});
