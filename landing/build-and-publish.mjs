#!/usr/bin/env node
// Copies the Vite build output into the parent Jekyll site so it can be
// deployed with a plain `bundle exec jekyll build` — no Node step required
// in CI. Run via `npm run build:landing` from the repo root (after
// `npm run build` here has produced landing/dist).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const landingDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(landingDir, "..");
const dist = join(landingDir, "dist");

if (!existsSync(dist)) {
  console.error("landing/dist not found — run `npm run build` in landing/ first.");
  process.exit(1);
}

// 1. Built index.html becomes the site root (replaces the Jekyll about page).
const indexHtml = readFileSync(join(dist, "index.html"), "utf8");
writeFileSync(join(repoRoot, "index.html"), indexHtml);

// 2. Hashed JS/CSS bundle -> assets/landing/assets/ (matches vite base "/assets/landing/").
// Skip dist/assets/img/** — it's just the dev-convenience copy of public/assets/img/prof_pic.jpg;
// the real photo already lives at the repo's own assets/img/prof_pic.jpg.
const targetAssets = join(repoRoot, "assets", "landing", "assets");
rmSync(targetAssets, { recursive: true, force: true });
mkdirSync(targetAssets, { recursive: true });
cpSync(join(dist, "assets"), targetAssets, {
  recursive: true,
  filter: (src) => !src.includes(join(dist, "assets", "img"))
});

console.log("Published landing/dist -> ../index.html and ../assets/landing/assets/");
