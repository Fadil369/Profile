import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/assets/landing/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true
  }
});
