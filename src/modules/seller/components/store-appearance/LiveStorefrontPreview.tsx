// import React, { useEffect, useMemo, useRef, useState } from "react";

// export type AnnBarSettings = Record<string, any>;
// type Device = "desktop" | "tablet" | "mobile";

// const DEVICE_SPECS: Record<Device, { w: number; h: number; label: string }> = {
//   desktop: { w: 1280, h: 800, label: "Desktop" },
//   tablet: { w: 834, h: 1112, label: "Tablet" },
//   mobile: { w: 390, h: 844, label: "Mobile" },
// };

// function sameProtocol(u?: string) {
//   try {
//     if (!u) return false;
//     return new URL(u).protocol === window.location.protocol;
//   } catch {
//     return false;
//   }
// }

// export default function LiveStorefrontPreview({
//   publicUrl,
//   annSettings,
//   buildPreviewUrl,
//   fallback,
// }: {
//   publicUrl?: string;
//   annSettings?: AnnBarSettings;
//   buildPreviewUrl: (base: string, settings?: AnnBarSettings) => string;
//   fallback?: React.ReactNode; // local preview component
// }) {
//   const [device, setDevice] = useState<Device>("desktop");
//   const [err, setErr] = useState<string | null>(null);
//   const [loaded, setLoaded] = useState(false);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);

//   const previewUrl = useMemo(() => {
//     if (!publicUrl) return "";
//     return buildPreviewUrl(publicUrl, annSettings);
//   }, [publicUrl, annSettings, buildPreviewUrl]);

//   useEffect(() => {
//     setErr(null);
//     setLoaded(false);
//     if (!previewUrl) return;
//     const t = window.setTimeout(() => {
//       if (!loaded) setErr("refused");
//     }, 1500);
//     return () => window.clearTimeout(t);
//   }, [previewUrl, loaded]);

//   const mixedContent = useMemo(
//     () => !!previewUrl && !sameProtocol(previewUrl),
//     [previewUrl]
//   );

//   const spec = DEVICE_SPECS[device];
//   const showFallback = !publicUrl || mixedContent || !!err;

//   return (
//     <div className="flex h-full w-full flex-col gap-3">
//       {/* Controls */}
//       <div className="flex items-center gap-2">
//         {(Object.keys(DEVICE_SPECS) as Device[]).map((d) => (
//           <button
//             key={d}
//             onClick={() => setDevice(d)}
//             className={`rounded-md px-3 py-1.5 text-sm border ${
//               device === d
//                 ? "bg-black text-white border-black"
//                 : "bg-white text-slate-700 border-slate-300"
//             }`}
//           >
//             {DEVICE_SPECS[d].label}
//           </button>
//         ))}

//         <div className="ml-auto flex items-center gap-2">
//           <a
//             href={previewUrl || "#"}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
//           >
//             Open in new tab
//           </a>
//           <button
//             className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
//             onClick={async () =>
//               previewUrl && (await navigator.clipboard.writeText(previewUrl))
//             }
//           >
//             Copy link
//           </button>
//         </div>
//       </div>

//       {/* Frame area */}
//       <div
//         className="relative flex-1 rounded-xl border border-slate-200 bg-slate-100"
//         style={{ minHeight: 300 }}
//       >
//         {/* Mixed content helper */}
//         {publicUrl && mixedContent && (
//           <EmptyOverlay title="Mixed content blocked">
//             Your dashboard and storefront use different protocols. Serve both
//             over the same protocol (http on localhost).
//           </EmptyOverlay>
//         )}

//         {/* Iframe or fallback */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div
//             className="overflow-hidden rounded-xl bg-white shadow-inner"
//             style={{ width: spec.w, height: spec.h }}
//           >
//             {showFallback ? (
//               fallback ? (
//                 <div className="h-full w-full">{fallback}</div>
//               ) : (
//                 <EmptyOverlay title="Site refused to connect">
//                   The storefront sent headers that block embedding. See the
//                   guide below.
//                 </EmptyOverlay>
//               )
//             ) : (
//               <iframe
//                 key={previewUrl + device}
//                 ref={iframeRef}
//                 src={previewUrl}
//                 title="Storefront Preview"
//                 onLoad={() => setLoaded(true)}
//                 onError={() => setErr("failed")}
//                 sandbox="allow-forms allow-scripts allow-popups allow-same-origin allow-modals allow-popups-to-escape-sandbox"
//                 style={{ width: "100%", height: "100%", border: 0 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* How to allow embedding */}
//       <details className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
//         <summary className="cursor-pointer select-none font-medium">
//           How to allow embedding (dev)
//         </summary>
//         <div className="mt-2 space-y-2 text-slate-600">
//           <p>
//             Add a <b>preview-only</b> exception so the storefront can load in an
//             iframe:
//           </p>
//           <ul className="list-disc pl-5 space-y-1">
//             <li>
//               <b>Remove</b> the <code>X-Frame-Options</code> header for requests
//               containing <code>?__preview=1</code>.
//             </li>
//             <li>
//               Set CSP:{" "}
//               <code>
//                 Content-Security-Policy: frame-ancestors 'self'
//                 http://localhost:5173 http://127.0.0.1:5173;
//               </code>
//             </li>
//           </ul>

//           <p className="text-xs">
//             <b>Next.js (dev):</b> in <code>next.config.js</code>, add a{" "}
//             <code>headers()</code> rule with{" "}
//             <code>
//               has: [{"{"} type: 'query', key: '__preview', value: '1' {"}"}]
//             </code>{" "}
//             and set the CSP above.
//           </p>

//           <p className="text-xs">
//             <b>Nginx (dev):</b> <code>add_header X-Frame-Options "";</code>{" "}
//             <code>
//               add_header Content-Security-Policy "frame-ancestors 'self'
//               http://localhost:5173 http://127.0.0.1:5173" always;
//             </code>
//           </p>
//         </div>
//       </details>
//     </div>
//   );
// }

// function EmptyOverlay({
//   title,
//   children,
// }: {
//   title: string;
//   children?: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-slate-600 p-6">
//       <div className="rounded-full bg-white p-3 shadow">
//         <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//           <path
//             d="M12 9v4m0 4h.01M4.93 19.07A10 10 0 1 1 19.07 4.93 10 10 0 0 1 4.93 19.07Z"
//             stroke="#64748b"
//             strokeWidth="1.5"
//           />
//         </svg>
//       </div>
//       <div className="text-sm font-medium">{title}</div>
//       {children && <div className="text-xs">{children}</div>}
//     </div>
//   );
// }
