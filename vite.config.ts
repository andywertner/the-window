import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { port: 5174, strictPort: true },
  // Some school Chromebooks are stuck on older Chrome.
  build: { target: ["chrome96", "safari15", "firefox100"] },
});
