// storefront/previewRuntime.ts
export function readPreviewPayload() {
  try {
    const raw = new URLSearchParams(window.location.search).get("__preview");
    if (!raw) return null;
    const json = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (json?.exp && Date.now() > json.exp) return null; // optional expiry
    return json;
  } catch {
    return null;
  }
}

/**
 * Example hook point:
 * After you fetch the live theme, call applyPreviewOverrides(theme)
 * to overlay the preview announcement bar settings without publishing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyPreviewOverrides(theme: any) {
  const preview = readPreviewPayload();
  if (!preview?.blocks) return theme;

  const copy = JSON.parse(JSON.stringify(theme));
  for (const b of preview.blocks) {
    if (b.code === "announcement_bar") {
      // merge into your theme state (adjust the path to your structure)
      if (!copy.blocks) copy.blocks = {};
      if (!copy.blocks.announcement_bar) copy.blocks.announcement_bar = {};
      copy.blocks.announcement_bar.settings = {
        ...(copy.blocks.announcement_bar.settings || {}),
        ...(b.settings || {}),
      };
    }
  }
  return copy;
}
