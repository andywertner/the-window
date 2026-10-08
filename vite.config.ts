import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { port: 5174, strictPort: true },
  // School Chromebooks are on Chrome 103. chrome96 keeps the bundle runnable there.
  build: { target: ["chrome96", "safari15", "firefox100"] },
});
