// Snapshots the built site so crawlers, link previews, AI assistants and no-JS readers get real HTML:
//   dist/index.html     ← English  (/)
//   dist/ar/index.html  ← Arabic   (/ar/)
// React re-renders on load, so the snapshot only has to be correct, not interactive.
// Live data (registry, GitHub) is blocked here on purpose: the static HTML must never claim a
// check passed — only the visitor's own browser can say that.
//   node scripts/prerender.mjs   (after `vite build`; set CHROME_PATH if Chromium is elsewhere)
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const chrome = process.env.CHROME_PATH || join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
if (!existsSync(chrome)) throw new Error(`No Chromium at ${chrome} — set CHROME_PATH`);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".txt": "text/plain", ".xml": "application/xml" };
const template = readFileSync(join(dist, "index.html"));
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(dist, path);
  if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    return res.end(readFileSync(file));
  }
  res.writeHead(200, { "Content-Type": "text/html" }); // SPA fallback, like Apache's FallbackResource
  res.end(template);
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: chrome });
const pages = [
  ["/", "index.html"],
  ["/ar/", "ar/index.html"]
];
const out = {};
for (const [path, file] of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: "dark", locale: path === "/ar/" ? "ar-SA" : "en-US" });
  await page.route(/registry\.brainsait\.de|api\.github\.com|\/bpr\.php|\/__pulse/, (r) => r.abort());
  await page.addInitScript(() => {
    try { localStorage.setItem("elfadil-langhint-dismissed", "1"); } catch {}
  });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForSelector("#main section#bpr");
  const html = await page.evaluate(() => {
    document.querySelectorAll(".lang-hint, .booking-backdrop, .workspace-overlay").forEach((n) => n.remove());
    document.querySelectorAll("[inert]").forEach((n) => n.removeAttribute("inert"));
    document.documentElement.removeAttribute("data-theme"); // the inline script sets it before paint
    // the font stylesheet switched itself on while rendering here; ship it non-blocking again
    document.querySelectorAll('link[rel="stylesheet"][onload]').forEach((l) => l.setAttribute("media", "print"));
    return "<!doctype html>\n" + document.documentElement.outerHTML;
  });
  out[file] = html;
  await page.close();
}
await browser.close();
server.close();

for (const [file, html] of Object.entries(out)) {
  mkdirSync(dirname(join(dist, file)), { recursive: true });
  writeFileSync(join(dist, file), html);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ").replace(/\s+/g, " ");
  console.log(`prerendered ${file}: ${(html.length / 1024).toFixed(0)} KB, ${text.split(" ").length} words of text`);
}

// Keep the release manifest true to what ships (release-manifest.mjs ran before these files changed).
const manifestPath = join(dist, "release.json");
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const file of Object.keys(out)) manifest.files[file] = createHash("sha256").update(readFileSync(join(dist, file))).digest("hex");
  manifest.files = Object.fromEntries(Object.entries(manifest.files).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}
