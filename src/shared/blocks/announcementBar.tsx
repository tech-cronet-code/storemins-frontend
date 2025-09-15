// Removed useMemo import; fixed Hooks rule and nullish-coalescing warnings

/** --- Canonical settings for the announcement_bar block --- */
export type AnnBarSettings = {
  enabled?: boolean;
  message?: string;
  section_background_color?: string;
  text_color?: string;

  visibility?: "all" | "desktop" | "mobile";
  marquee_enabled?: boolean;
  marquee_mode?: "bounce" | "loop";
  marquee_speed?: number; // 1..10 (higher=faster)

  left_button_enabled?: boolean;
  left_button_show?: boolean;
  left_button_text?: string;
  left_button_label?: string;
  left_button_url?: string;
  left_button_href?: string;
  left_button_new_tab?: boolean;

  right_button_enabled?: boolean;
  right_button_show?: boolean;
  right_button_text?: string;
  right_button_label?: string;
  right_button_url?: string;
  right_button_href?: string;
  right_button_new_tab?: boolean;

  [k: string]: unknown;
};

/** server -> render defaults */
export function normalizeAnnBar(
  raw?: Partial<AnnBarSettings>
): Required<AnnBarSettings> {
  const s = raw || {};
  return {
    enabled: s.enabled ?? true,
    message: s.message ?? "this is announced bar test it out",
    section_background_color: s.section_background_color ?? "#296fc2",
    text_color: s.text_color ?? "#FFFFFF",

    visibility: s.visibility ?? "all",
    marquee_enabled: s.marquee_enabled ?? false,
    marquee_mode: (s.marquee_mode as "bounce" | "loop") ?? "bounce",
    marquee_speed: typeof s.marquee_speed === "number" ? s.marquee_speed : 5,

    // Avoid double-?? with a non-nullish middle operand
    left_button_enabled: s.left_button_enabled ?? Boolean(s.left_button_show),
    left_button_show: s.left_button_show ?? false,
    left_button_text: s.left_button_text ?? s.left_button_label ?? "",
    left_button_label: s.left_button_label ?? s.left_button_text ?? "",
    left_button_url: s.left_button_url ?? s.left_button_href ?? "",
    left_button_href: s.left_button_href ?? s.left_button_url ?? "",
    left_button_new_tab: s.left_button_new_tab ?? true,

    right_button_enabled:
      s.right_button_enabled ?? Boolean(s.right_button_show),
    right_button_show: s.right_button_show ?? false,
    right_button_text: s.right_button_text ?? s.right_button_label ?? "",
    right_button_label: s.right_button_label ?? s.right_button_text ?? "",
    right_button_url: s.right_button_url ?? s.right_button_href ?? "",
    right_button_href: s.right_button_href ?? s.right_button_url ?? "",
    right_button_new_tab: s.right_button_new_tab ?? true,
  } as Required<AnnBarSettings>;
}

/** editor UI -> server settings (keeps unknown keys) */
export function mergeAnnBarFromUI(
  existing: AnnBarSettings | undefined,
  ui: {
    showAnnouncement?: boolean;
    message?: string;
    barColor?: string;
    fontColor?: string;
    visibility?: "all" | "desktop" | "mobile";
    marqueeEnabled?: boolean;
    marqueeMode?: "bounce" | "loop";
    marqueeSpeed?: number;
    leftBtnEnabled?: boolean;
    leftBtnText?: string;
    leftBtnUrl?: string;
    leftBtnNewTab?: boolean;
    rightBtnEnabled?: boolean;
    rightBtnText?: string;
    rightBtnUrl?: string;
    rightBtnNewTab?: boolean;
  }
): AnnBarSettings {
  return {
    ...(existing || {}),
    enabled: !!ui.showAnnouncement,
    message: ui.message ?? "",
    section_background_color: ui.barColor ?? "#296fc2",
    text_color: ui.fontColor ?? "#FFFFFF",

    visibility: ui.visibility || "all",
    marquee_enabled: !!ui.marqueeEnabled,
    marquee_mode: ui.marqueeMode === "loop" ? "loop" : "bounce",
    marquee_speed: Number(ui.marqueeSpeed ?? 5),

    left_button_enabled: !!ui.leftBtnEnabled,
    left_button_show: !!ui.leftBtnEnabled,
    left_button_text: ui.leftBtnText || "",
    left_button_label: ui.leftBtnText || "",
    left_button_url: ui.leftBtnUrl || "",
    left_button_href: ui.leftBtnUrl || "",
    left_button_new_tab: !!ui.leftBtnNewTab,

    right_button_enabled: !!ui.rightBtnEnabled,
    right_button_show: !!ui.rightBtnEnabled,
    right_button_text: ui.rightBtnText || "",
    right_button_label: ui.rightBtnText || "",
    right_button_url: ui.rightBtnUrl || "",
    right_button_href: ui.rightBtnUrl || "",
    right_button_new_tab: !!ui.rightBtnNewTab,
  };
}

/** Canonical block component used by BOTH editor preview & public storefront */
export function AnnouncementBarBlock({
  settings,
}: {
  settings?: Partial<AnnBarSettings>;
}) {
  const s = normalizeAnnBar(settings);

  // Compute values without Hooks to avoid conditional hook call issues
  const speed = Math.max(1, Math.min(10, Number(s.marquee_speed ?? 5)));
  const duration = 14 - speed; // match your preview mapping

  if (!s.enabled) return null;

  const visibilityCls =
    s.visibility === "desktop"
      ? "hidden md:flex"
      : s.visibility === "mobile"
      ? "flex md:hidden"
      : "flex";

  const Btn = ({
    text,
    url,
    newTab,
  }: {
    text?: string;
    url?: string;
    newTab?: boolean;
  }) => {
    if (!text?.trim()) return null;
    const cls =
      "rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium hover:bg-white/15";
    const style = { color: s.text_color as string };
    return url?.trim() ? (
      <a
        href={url}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={cls}
        style={style}
      >
        {text}
      </a>
    ) : (
      <span className={cls} style={style}>
        {text}
      </span>
    );
  };

  return (
    <div
      className={`${visibilityCls}`}
      style={{
        backgroundColor: s.section_background_color,
        color: s.text_color,
        minHeight: 44,
      }}
    >
      {/* local keyframes to keep component self-contained */}
      <style>{`
        @keyframes marqueeLoop   { 0% {transform:translateX(100%)} 100% {transform:translateX(-100%)} }
        @keyframes marqueeBounce { 0% {transform:translateX(25%)} 100% {transform:translateX(-25%)} }
      `}</style>

      <div className="flex w-full items-center gap-3 px-3">
        <div className="shrink-0">
          {s.left_button_enabled && (
            <Btn
              text={s.left_button_text}
              url={s.left_button_url || s.left_button_href}
              newTab={s.left_button_new_tab}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden py-2 text-center">
          {s.marquee_enabled ? (
            s.marquee_mode === "loop" ? (
              <div
                className="inline-block whitespace-nowrap will-change-transform"
                style={{
                  animation: `marqueeLoop ${duration}s linear infinite`,
                }}
              >
                {s.message}\u00A0\u00A0\u00A0{s.message}
              </div>
            ) : (
              <div
                className="inline-block whitespace-nowrap will-change-transform"
                style={{
                  animation: `marqueeBounce ${duration}s ease-in-out infinite alternate`,
                }}
              >
                {s.message}
              </div>
            )
          ) : (
            <div className="inline-block">{s.message}</div>
          )}
        </div>

        <div className="shrink-0">
          {s.right_button_enabled && (
            <Btn
              text={s.right_button_text}
              url={s.right_button_url || s.right_button_href}
              newTab={s.right_button_new_tab}
            />
          )}
        </div>
      </div>
    </div>
  );
}
