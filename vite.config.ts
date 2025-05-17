import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/", // ✅ for Railway root hosting; change if using subfolder hosting

    plugins: [
      react(),
      tailwindcss(),
      // wasm(), // enable if you're using WebAssembly
      // topLevelAwait() // enable if you're using top-level await
    ],

    assetsInclude: ["**/*.wasm"],

    server: {
      host: true,
      proxy: isDev
        ? {
            // ✅ Only used in local dev to avoid CORS issues
            "/auth": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined, // ❌ Disable proxy in production!
    },

    build: {
      sourcemap: false, // ✅ Don’t leak source maps in prod
      minify: "esbuild", // ✅ Fast, production-ready minifier
      outDir: "dist", // ✅ Default
      assetsDir: "assets", // ✅ Optional, defaults to 'assets'
      target: "es2015", // ✅ Ensures broad compatibility
      cssCodeSplit: true, // ✅ Extracts CSS separately
      emptyOutDir: true, // ✅ Cleans output dir before building
    },
  };
});
