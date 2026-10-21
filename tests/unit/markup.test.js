const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const csstree = require("css-tree");
const { HtmlValidate } = require("html-validate");

const pages = ["index.html", "pro-partnery.html", "app.html"];

function ids(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
}

function localRefs(html, fromFile) {
  const refs = [];
  for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const raw = match[1];
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw) || raw.startsWith("//")) continue;
    const hashAt = raw.indexOf("#");
    const hash = hashAt >= 0 ? decodeURIComponent(raw.slice(hashAt + 1)) : "";
    const beforeHash = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
    const pathPart = beforeHash.split("?")[0];
    const file = pathPart === "" ? fromFile : path.normalize(path.join(path.dirname(fromFile), pathPart));
    refs.push({ raw, file, hash });
  }
  return refs;
}

test("sestavení má index, styly a místní odkazy", () => {
  assert.equal(fs.existsSync("index.html"), true);
  assert.ok(fs.statSync("index.html").size > 0);
  const css = fs.readFileSync("css/styles.css", "utf8");
  assert.ok(css.length > 0);
  const pageHtml = new Map(pages.map((file) => [file, fs.readFileSync(file, "utf8")]));
  for (const [file, html] of pageHtml) {
    assert.match(html, /<link rel="stylesheet" href="css\/styles\.css">/, file);
    for (const ref of localRefs(html, file)) {
      assert.equal(fs.existsSync(ref.file), true, file + " → " + ref.raw);
      if (!ref.hash || !ref.file.endsWith(".html")) continue;
      const target = pageHtml.get(ref.file) || fs.readFileSync(ref.file, "utf8");
      assert.equal(ids(target).has(ref.hash), true, file + " → " + ref.raw);
    }
  }
  for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
    const value = match[1].trim().replace(/^['"]|['"]$/g, "");
    if (value.startsWith("data:") || value.startsWith("#")) continue;
    const file = path.normalize(path.join("css", value));
    assert.equal(fs.existsSync(file), true, value);
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
  assert.doesNotThrow(() => csstree.parse(fs.readFileSync("css/styles.css", "utf8"), { positions: true }));
});
