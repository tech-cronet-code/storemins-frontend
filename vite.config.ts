import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  build: {
    sourcemap: false,      // ❌ Prevent generation of `.map` files
    minify: 'esbuild',     // ✅ Ensures JS is minified
    outDir: 'dist',        // optional, default output folder
  },
});
