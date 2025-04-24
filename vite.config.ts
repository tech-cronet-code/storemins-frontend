import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import wasm from 'vite-plugin-wasm'; // 👈 add this
// import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  //  wasm(), 
  // topLevelAwait(),
  tailwindcss()
  ],
  assetsInclude: ["**/*.wasm"],
  // optimizeDeps: {
  //   exclude: ['argon2-browser'],
  // },
  server: {
    host: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false,      // ❌ Prevent generation of `.map` files
    minify: 'esbuild',     // ✅ Ensures JS is minified
    outDir: 'dist',        // optional, default output folder
  },
});
