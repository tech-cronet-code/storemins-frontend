// // Helpers for building a working preview URL on localhost

// export type AnnBarSettings = Record<string, any>;

// // Use your storefront dev server URL. Overridable via .env
// // Example for Vite/Next storefront running locally:
// const DEV_PREVIEW_BASE =
//   (import.meta as any).env?.VITE_PUBLIC_API_URL_RUNTIME_LOCAL ||
//   "http://localhost:5174";

// function forceSameProtocol(url: string) {
//   try {
//     const u = new URL(url, window.location.origin);
//     // Keep the same protocol as the dashboard (http on localhost)
//     u.protocol = window.location.protocol;
//     return u.toString();
//   } catch {
//     return url;
//   }
// }

// export function getPublicStoreUrl(store?: any): string | undefined {
//   const isLocal =
//     location.hostname === "localhost" || location.hostname === "127.0.0.1";
//   if (isLocal) return forceSameProtocol(DEV_PREVIEW_BASE);

//   // prod-ish (tweak this to match your data)
//   const domain =
//     store?.customDomainHttps ||
//     store?.customDomain ||
//     (store?.slug ? `https://${store.slug}.yourstorefront.com` : undefined);

//   return domain ? forceSameProtocol(domain) : undefined;
// }

// export function buildPreviewUrl(baseUrl: string, annSettings?: AnnBarSettings) {
//   const u = new URL(forceSameProtocol(baseUrl));
//   u.searchParams.set("__preview", "1");
//   if (annSettings) {
//     u.searchParams.set("__ab", encodeURIComponent(JSON.stringify(annSettings)));
//   }
//   return u.toString();
// }
