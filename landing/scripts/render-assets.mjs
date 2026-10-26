// Renders the share cards (public/og/og-{en,ar}.png) and PNG app icons from public/icons/icon.svg.
//   node scripts/render-assets.mjs        (needs a Chromium; set CHROME_PATH if it is not the Playwright one)
// The outputs are committed; re-run only when the card text, photo or icon changes.
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const chrome = process.env.CHROME_PATH || join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
if (!existsSync(chrome)) throw new Error(`No Chromium at ${chrome} — set CHROME_PATH`);

const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["en", "ar"]) {
  await page.goto(`file://${join(root, "scripts/og-template.html")}?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, `public/og/og-${lang}.png`) });
}
const svg = `file://${join(root, "public/icons/icon.svg")}`;
for (const [size, name] of [[180, "icon-180.png"], [192, "icon-192.png"], [512, "icon-512.png"]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>*{margin:0}</style><img src="${svg}" width="${size}" height="${size}">`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: join(root, "public/icons", name), omitBackground: true });
}
await browser.close();
console.log("rendered og-en.png, og-ar.png and icons");
