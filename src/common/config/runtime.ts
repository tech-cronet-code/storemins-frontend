// export function getApiRoot() {
//   const isDev = import.meta.env.VITE_MODE === "development";
//   const dev = import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL?.trim();
//   const live = import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE?.trim();
//   return (isDev ? dev : live) || "";
// }

// export function getImageBase() {
//   const isDev = import.meta.env.VITE_MODE === "development";
//   const dev = import.meta.env.VITE_PUBLIC_IMAGE_URL_LOCAL?.trim();
//   const live = import.meta.env.VITE_PUBLIC_IMAGE_URL_LIVE?.trim();
//   return (isDev ? dev : live) || "";
// }

// export function getWsUrl() {
//   const api = getApiRoot().replace(/\/+$/, ""); // trim trailing slash
//   const path = (import.meta.env.VITE_PUBLIC_WS_PATH || "/push").replace(/^\/?/, "/");
//   // Build ws(s) URL from API root
//   try {
//     const apiUrl = new URL(api);
//     const protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
//     return `${protocol}//${apiUrl.host}${path}`;
//   } catch {
//     // Fallback: assume same host if API root is empty
//     const loc = window.location;
//     const protocol = loc.protocol === "https:" ? "wss:" : "ws:";
//     return `${protocol}//${loc.host}${path}`;
//   }
// }

export function getApiRoot() {
  // use vite's own flag (more reliable than env var)
  const isDev =
    import.meta.env.DEV ||
    import.meta.env.MODE === "development" ||
    import.meta.env.VITE_MODE === "development";

  const dev = import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL?.trim();
  const live = import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE?.trim();

  /**
   * 🧩 IMPORTANT:
   * In dev, return "" (empty string) if your backend is proxied
   * through Vite (server.proxy in vite.config.ts).
   *
   * This makes frontend requests relative, so:
   *   - http://localhost:5173/customer/...  → proxied to 3000
   *   - https://*.trycloudflare.com/customer/... → also proxied correctly
   *
   * If you hardcode "http://localhost:3000", mobile devices & tunnels break.
   */
  if (isDev) {
    return dev && dev.startsWith("http") ? dev : "";
  }

  // Production stays absolute
  return live || "";
}

export function getImageBase() {
  const isDev =
    import.meta.env.DEV ||
    import.meta.env.MODE === "development" ||
    import.meta.env.VITE_MODE === "development";
  const dev = import.meta.env.VITE_PUBLIC_IMAGE_URL_LOCAL?.trim();
  const live = import.meta.env.VITE_PUBLIC_IMAGE_URL_LIVE?.trim();
  return (isDev ? dev : live) || "";
}

export function getWsUrl() {
  const api = getApiRoot().replace(/\/+$/, "");
  const path = (import.meta.env.VITE_PUBLIC_WS_PATH || "/push").replace(
    /^\/?/,
    "/"
  );
  try {
    const apiUrl = new URL(api);
    const protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${apiUrl.host}${path}`;
  } catch {
    const loc = window.location;
    const protocol = loc.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${loc.host}${path}`;
  }
}
