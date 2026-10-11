import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` must match the GitHub Pages sub-path (https://c137v8.github.io/itsme).
export default defineConfig({
  plugins: [react()],
  base: "/itsme/",
});
