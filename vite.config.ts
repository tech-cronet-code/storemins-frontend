// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Set your repo name here:
const repo = "storemins-frontend";

/**
 * Minimal, removable helper for dev tunnels.
 * - Always allows any *.trycloudflare.com host (works with Quick Tunnels).
 * - If TUNNEL_HOST is set (e.g. pumps-laptop-...trycloudflare.com), we also:
 *   - allow that exact host
 *   - switch HMR to WSS on 443 with that host (for stable hot reload over HTTPS)
 *
 * Delete this function + its usage to fully revert.
 */
function devTunnelServerExtras(mode: string) {
  if (mode !== "development") return {};

  const tunnelHost = process.env.TUNNEL_HOST?.trim();
  // Vite’s host check will accept exact hosts; many setups also accept a
  // domain-style suffix (".example.com"). We include both patterns to be safe.
  const baseAllowed = [".trycloudflare.com"]; // covers any <random>.trycloudflare.com
  const allowedHosts = tunnelHost ? [tunnelHost, ...baseAllowed] : baseAllowed;

  // When using a public HTTPS tunnel, set HMR to WSS on port 443 for reliability.
  const hmr = tunnelHost
    ? {
        host: tunnelHost,
        protocol: "wss" as const,
        clientPort: 443,
      }
    : undefined;

  return {
    allowedHosts,
    hmr,
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const tunnelExtras = devTunnelServerExtras(mode);

  return {
    base: isDev ? "/" : `/${repo}/`,
    plugins: [
      react(),
      tailwindcss(),
      // wasm(), // enable if you're using WebAssembly
      // topLevelAwait() // enable if you're using top-level await
    ],

    assetsInclude: ["**/*.wasm"],

    server: {
      host: true,
      // ⬇️ Add tunnel-related bits here (easy to remove later)
      ...(tunnelExtras as any),

      proxy: isDev
        ? {
            "/auth": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
            "/storefront": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined, // never proxy in prod
    },

    // vite.config.ts (use the version I gave you earlier + this proxy block)
    // server: {
    //   host: true,
    //   ...(tunnelExtras as any),

    //   proxy: isDev
    //     ? {
    //         "/auth": {
    //           target: "http://localhost:3000",
    //           changeOrigin: true,
    //           secure: false,

    //           // ⬇️ make cookies usable from https://*.trycloudflare.com
    //           cookieDomainRewrite: "", // drop Domain=..., becomes host-only
    //           cookiePathRewrite: "/", // normalize path

    //           // ensure cookies are marked Secure when coming over HTTPS (the tunnel)
    //           configure: (proxy) => {
    //             proxy.on("proxyRes", (proxyRes, req) => {
    //               const hdr = proxyRes.headers["set-cookie"];
    //               const isHttps =
    //                 (req as any).headers["x-forwarded-proto"] === "https" ||
    //                 (req as any).socket?.encrypted;
    //               if (Array.isArray(hdr) && isHttps) {
    //                 proxyRes.headers["set-cookie"] = hdr.map((c) =>
    //                   c.includes("Secure") ? c : `${c}; Secure`
    //                 );
    //               }
    //             });
    //           },
    //         },
    //         "/storefront": {
    //           target: "http://localhost:3000",
    //           changeOrigin: true,
    //           secure: false,
    //           cookieDomainRewrite: "",
    //           cookiePathRewrite: "/",
    //           configure: (proxy) => {
    //             proxy.on("proxyRes", (proxyRes, req) => {
    //               const hdr = proxyRes.headers["set-cookie"];
    //               const isHttps =
    //                 (req as any).headers["x-forwarded-proto"] === "https" ||
    //                 (req as any).socket?.encrypted;
    //               if (Array.isArray(hdr) && isHttps) {
    //                 proxyRes.headers["set-cookie"] = hdr.map((c) =>
    //                   c.includes("Secure") ? c : `${c}; Secure`
    //                 );
    //               }
    //             });
    //           },
    //         },
    //       }
    //     : undefined,
    // },

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
