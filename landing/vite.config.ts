import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built output is copied into the parent Jekyll site by ../scripts/build-landing.mjs:
// dist/index.html -> repo root index.html, dist/assets/* -> repo assets/landing/.
// base must match that final asset path on the deployed (baseurl-less) elfadil.com domain.
export default defineConfig({
  plugins: [react()],
  base: "/assets/landing/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true
  }
});
