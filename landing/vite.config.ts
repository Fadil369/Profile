import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import releaseManifest from "./release-manifest.mjs";

export default defineConfig({
  plugins: [react(), releaseManifest()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true
  }
});
