// shared/blocks/announcementBar.tsx
import React, { useEffect, useRef, useState, CSSProperties } from "react";

/* ---------- Types ---------- */
export type AnnBarSettings = {
  enabled?: boolean;
  message?: string;
  section_background_color?: string;
  text_color?: string;
  visibility?: "all" | "desktop" | "mobile" | string;
  marquee_enabled?: boolean;
  marquee_mode?: "bounce" | "loop";
  marquee_speed?: number; // 1..10

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

export type AnnBarUI = {
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
};

export type AnnBarResolved = {
  enabled: boolean;
  message: string;
  section_background_color: string;
  text_color: string;

  visibility: "all" | "desktop" | "mobile";
  marquee_enabled: boolean;
  marquee_mode: "bounce" | "loop";
  marquee_speed: number;

  left_button_enabled: boolean;
  left_button_show: boolean;
  left_button_text: string;
  left_button_label: string;
  left_button_url: string;
  left_button_href: string;
  left_button_new_tab: boolean;

  right_button_enabled: boolean;
  right_button_show: boolean;
  right_button_text: string;
  right_button_label: string;
  right_button_url: string;
  right_button_href: string;
  right_button_new_tab: boolean;
};

/* ---------- helpers ---------- */
const num = (v: unknown, fb: number) =>
  typeof v === "number" && !Number.isNaN(v) ? v : fb;
const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);
const bool = (v: unknown, fb = false) => (typeof v === "boolean" ? v : fb);

const normalizeVisibility = (
  v?: string | null
): AnnBarResolved["visibility"] => {
  const k = (v || "").toString().toLowerCase().trim();
  if (k === "desktop" || k === "desktop only") return "desktop";
  if (k === "mobile" || k === "mobile only") return "mobile";
  return "all";
};

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
  };
}
function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(a: string, b: string) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  if (!A || !B) return 21;
  const L1 = luminance(A);
  const L2 = luminance(B);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}
function ensureReadableTextColor(bg: string, text: string) {
  const bgHex = bg || "#FFFFFF";
  const txtHex = text || "#111827";
  const cr = contrastRatio(bgHex, txtHex);
  if (cr >= 3) return txtHex;
  return contrastRatio(bgHex, "#000000") >= contrastRatio(bgHex, "#FFFFFF")
    ? "#000000"
    : "#FFFFFF";
}

/** media */
function useMedia(query: string) {
  const [matches, set] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => set(mql.matches);
    try {
      mql.addEventListener("change", onChange);
    } catch {
      mql.addListener(onChange);
    }
    set(mql.matches);
    return () => {
      try {
        mql.removeEventListener("change", onChange);
      } catch {
        mql.removeListener(onChange);
      }
    };
  }, [query]);
  return matches;
}

/* ---------- server -> render ---------- */
export function normalizeAnnBar(raw?: Partial<AnnBarSettings>): AnnBarResolved {
  const s = raw ?? {};
  const visibility = normalizeVisibility(s.visibility as string | undefined);
  const marqueeMode = (s.marquee_mode === "loop" ? "loop" : "bounce") as
    | "bounce"
    | "loop";

  const bg = str(s.section_background_color, "#FFFFFF");
  const fg = ensureReadableTextColor(bg, str(s.text_color, "#111827"));

  return {
    enabled: bool(s.enabled, true),
    message: str(s.message, "Your announcement here"),
    section_background_color: bg,
    text_color: fg,
    visibility,
    marquee_enabled: bool(s.marquee_enabled, false),
    marquee_mode: marqueeMode,
    marquee_speed: num(s.marquee_speed, 5),

    left_button_enabled:
      typeof s.left_button_enabled === "boolean"
        ? s.left_button_enabled
        : Boolean(s.left_button_show),
    left_button_show: bool(s.left_button_show, true),
    left_button_text: str(
      s.left_button_text ?? s.left_button_label,
      "Read more"
    ),
    left_button_label: str(
      s.left_button_label ?? s.left_button_text,
      "Read more"
    ),
    left_button_url: str(s.left_button_url ?? s.left_button_href, "#"),
    left_button_href: str(s.left_button_href ?? s.left_button_url, "#"),
    left_button_new_tab: bool(s.left_button_new_tab, true),

    right_button_enabled:
      typeof s.right_button_enabled === "boolean"
        ? s.right_button_enabled
        : Boolean(s.right_button_show),
    right_button_show: bool(s.right_button_show, false),
    right_button_text: str(s.right_button_text ?? s.right_button_label, ""),
    right_button_label: str(s.right_button_label ?? s.right_button_text, ""),
    right_button_url: str(s.right_button_url ?? s.right_button_href, ""),
    right_button_href: str(s.right_button_href ?? s.right_button_url, ""),
    right_button_new_tab: bool(s.right_button_new_tab, true),
  };
}

/* ---------- editor UI -> server ---------- */
export function mergeAnnBarFromUI(
  existing: AnnBarSettings | undefined,
  ui: AnnBarUI
): AnnBarSettings {
  const ex = existing || {};
  return {
    ...ex,
    enabled: !!ui.showAnnouncement,
    message: ui.message ?? str(ex.message, ""),
    section_background_color:
      ui.barColor ?? str(ex.section_background_color, "#FFFFFF"),
    text_color: ui.fontColor ?? str(ex.text_color, "#111827"),

    visibility: normalizeVisibility(
      (ui.visibility ?? (ex.visibility as AnnBarResolved["visibility"])) as any
    ),
    marquee_enabled: !!(ui.marqueeEnabled ?? ex.marquee_enabled ?? false),
    marquee_mode:
      ui.marqueeMode === "loop"
        ? "loop"
        : (ex.marquee_mode as "bounce" | "loop") ?? "bounce",
    marquee_speed: num(ui.marqueeSpeed ?? ex.marquee_speed, 5),

    left_button_enabled: !!(
      ui.leftBtnEnabled ??
      ex.left_button_enabled ??
      ex.left_button_show
    ),
    left_button_show: !!(ui.leftBtnEnabled ?? ex.left_button_show),
    left_button_text:
      ui.leftBtnText ?? str(ex.left_button_text ?? ex.left_button_label, ""),
    left_button_label:
      ui.leftBtnText ?? str(ex.left_button_label ?? ex.left_button_text, ""),
    left_button_url:
      ui.leftBtnUrl ?? str(ex.left_button_url ?? ex.left_button_href, ""),
    left_button_href:
      ui.leftBtnUrl ?? str(ex.left_button_href ?? ex.left_button_url, ""),
    left_button_new_tab: !!(ui.leftBtnNewTab ?? ex.left_button_new_tab ?? true),

    right_button_enabled: !!(
      ui.rightBtnEnabled ??
      ex.right_button_enabled ??
      ex.right_button_show
    ),
    right_button_show: !!(ui.rightBtnEnabled ?? ex.right_button_show),
    right_button_text:
      ui.rightBtnText ?? str(ex.right_button_text ?? ex.right_button_label, ""),
    right_button_label:
      ui.rightBtnText ?? str(ex.right_button_label ?? ex.right_button_text, ""),
    right_button_url:
      ui.rightBtnUrl ?? str(ex.right_button_url ?? ex.right_button_href, ""),
    right_button_href:
      ui.rightBtnUrl ?? str(ex.right_button_href ?? ex.right_button_url, ""),
    right_button_new_tab: !!(
      ui.rightBtnNewTab ??
      ex.right_button_new_tab ??
      true
    ),
  };
}

/* ---------- Component ---------- */
export function AnnouncementBarBlock({
  settings,
  allowFullBleed = false,
}: {
  settings?: Partial<AnnBarSettings>;
  allowFullBleed?: boolean;
}) {
  const s = normalizeAnnBar(settings);

  // state
  const [dismissed, setDismissed] = useState(false);
  const [needsMarquee, setNeedsMarquee] = useState(false);

  // media
  const isMdUp = useMedia("(min-width: 768px)");

  const visibleByMQ =
    s.visibility === "all" ||
    (s.visibility === "desktop" && isMdUp) ||
    (s.visibility === "mobile" && !isMdUp);

  const shouldShow = s.enabled && !dismissed && visibleByMQ;

  const baseSpeed = Math.max(1, Math.min(10, Number(s.marquee_speed ?? 5)));
  const baseDuration = 14 - baseSpeed;

  const barBg = s.section_background_color || "#FFFFFF";
  const barFg = s.text_color || "#111827";

  // refs
  const annWrapRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightInnerRef = useRef<HTMLDivElement | null>(null);

  // dimensions
  const [rightW, setRightW] = useState(0);
  const [trackW, setTrackW] = useState(0);

  // mirror a clamped width on the left so the title stays centered
  const RIGHT_MAX_PCT = 0.4;
  const clampGhost = (track: number, rw: number) =>
    Math.max(112, Math.min(rw, Math.round(track * RIGHT_MAX_PCT)));

  // small screens: marquee fallback thresholds
  const SMALL_FORCE_W = 560; // if the whole rail is narrower than this, scroll
  const SMALL_FORCE_CHARS = 14; // long messages on mobile scroll even if overflow calc is flaky

  // expose height var for sticky offset users can consume
  useEffect(() => {
    const setVar = (px: number) =>
      document.documentElement.style.setProperty("--annbar-offset", `${px}px`);
    if (!shouldShow) {
      setVar(0);
      return;
    }
    const measureH = () => {
      const h = Math.ceil(
        annWrapRef.current?.getBoundingClientRect().height || 0
      );
      setVar(h);
    };
    measureH();
    const ro =
      (window as any).ResizeObserver && annWrapRef.current
        ? new (window as any).ResizeObserver(measureH)
        : null;
    ro?.observe?.(annWrapRef.current as Element);
    window.addEventListener("resize", measureH);
    const id = window.setInterval(measureH, 500);
    return () => {
      ro?.disconnect?.();
      window.removeEventListener("resize", measureH);
      clearInterval(id);
      setVar(0);
    };
  }, [shouldShow]);

  // measure widths + decide marquee
  useEffect(() => {
    if (!shouldShow) return;

    let raf = 0;
    const measure = () => {
      const cwScroll = Math.ceil(centerRef.current?.scrollWidth || 0);
      const cwClient = Math.ceil(centerRef.current?.clientWidth || 0);
      const rw0 =
        Math.ceil(rightInnerRef.current?.scrollWidth || 0) ||
        Math.ceil(rightInnerRef.current?.offsetWidth || 0);
      const track = Math.ceil(railRef.current?.clientWidth || 0);

      setRightW(rw0);
      setTrackW(track);

      const isNarrow = track > 0 && track <= SMALL_FORCE_W;
      const longOnMobile =
        !isMdUp && (s.message?.trim().length || 0) > SMALL_FORCE_CHARS;

      const overflow = cwClient > 0 && cwScroll > cwClient;

      setNeedsMarquee(
        isNarrow || longOnMobile || overflow || !!s.marquee_enabled
      );
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", onResize);
    const id = window.setInterval(measure, 600);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [shouldShow, isMdUp, s.message, s.marquee_enabled]);

  if (!shouldShow) return null;

  const pillCls =
    "inline-flex items-center rounded-full whitespace-nowrap focus:outline-none focus:ring-2 transition";
  const pillStyle: CSSProperties = {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    fontSize: "clamp(11px, 2.6vw, 14px)",
    padding: "clamp(2px, 0.5vw, 6px) clamp(8px, 2vw, 14px)",
    lineHeight: 1.2,
    maxWidth: "28ch",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const Action = ({
    text,
    url,
    newTab,
  }: {
    text?: string;
    url?: string;
    newTab?: boolean;
  }) =>
    text?.trim() ? (
      <a
        href={url}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={pillCls}
        style={pillStyle}
      >
        {text}
      </a>
    ) : null;

  const displayText =
    s.message && s.message.trim() ? s.message.trim() : "Your announcement here";

  const mirroredLeft = clampGhost(trackW, rightW);

  return (
    <div ref={annWrapRef} style={{ position: "relative", zIndex: 300 }}>
      <div
        ref={rootRef}
        className={`flex ${allowFullBleed ? "w-screen" : "w-full"}`}
        style={{
          backgroundColor: barBg,
          color: barFg,
          position: "relative",
          zIndex: 300,
          maxWidth: "100vw",
          overflow: "hidden",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.06)",
          marginLeft: allowFullBleed ? "calc(50% - 50vw)" : undefined,
          marginRight: allowFullBleed ? "calc(50% - 50vw)" : undefined,
        }}
        role="region"
        aria-label="Announcement"
      >
        <style>{`
          @keyframes marqueeLoop   { 0% {transform:translateX(100%)} 100% {transform:translateX(-100%)} }
          @keyframes marqueeBounce { 0% {transform:translateX(25%)} 100% {transform:translateX(-25%)} }
          @media (prefers-reduced-motion: reduce) {
            .annbar-marquee { animation: none !important; transform: none !important; }
          }
        `}</style>

        <div className="w-full px-3 md:px-6 py-2" ref={railRef}>
          {/* SINGLE ROW: ghost | center | right */}
          <div
            className="flex items-center"
            style={{ gap: 8, whiteSpace: "nowrap", minHeight: 44 }}
          >
            {/* left ghost mirrors (clamped) right width to keep title centered */}
            <div
              aria-hidden
              style={{
                width: Math.max(isMdUp ? 96 : 72, mirroredLeft || 0),
                minWidth: isMdUp ? 96 : 72,
                height: 0,
                flex: "0 0 auto",
              }}
            />

            {/* center */}
            <div className="flex-1 overflow-hidden">
              <div
                ref={centerRef}
                className="text-center font-medium"
                style={{
                  color: barFg,
                  whiteSpace: "nowrap",
                  textOverflow: "clip",
                  overflow: "hidden",
                  // smaller min on phones gives extra room before scrolling
                  fontSize: "clamp(11px, 3.2vw, 16px)",
                  lineHeight: 1.3,
                }}
              >
                {needsMarquee ? (
                  (s.marquee_mode ?? "bounce") === "loop" ? (
                    <div className="relative w-full overflow-hidden">
                      <div
                        className="annbar-marquee inline-block will-change-transform"
                        style={{
                          animation: `marqueeLoop ${baseDuration}s linear infinite`,
                          paddingInline: 12,
                        }}
                      >
                        {displayText}
                        {"\u00A0\u00A0\u00A0"}
                        {displayText}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full overflow-hidden">
                      <div
                        className="annbar-marquee inline-block will-change-transform"
                        style={{
                          animation: `marqueeBounce ${baseDuration}s ease-in-out infinite alternate`,
                        }}
                      >
                        {displayText}
                      </div>
                    </div>
                  )
                ) : (
                  <span>{displayText}</span>
                )}
              </div>
            </div>

            {/* right controls — never hidden/clamped */}
            <div
              ref={rightInnerRef}
              className="flex items-center justify-end"
              style={{ gap: 8, whiteSpace: "nowrap", flex: "0 0 auto" }}
            >
              {s.left_button_enabled && (
                <Action
                  text={s.left_button_text}
                  url={s.left_button_url || s.left_button_href}
                  newTab={s.left_button_new_tab}
                />
              )}
              {s.right_button_enabled && (
                <Action
                  text={s.right_button_text}
                  url={s.right_button_url || s.right_button_href}
                  newTab={s.right_button_new_tab}
                />
              )}
              <button
                type="button"
                aria-label="Close announcement"
                onClick={() => setDismissed(true)}
                className="rounded-full flex items-center justify-center focus:outline-none focus:ring"
                title="Close"
                style={{
                  height: "clamp(28px, 7.2vw, 36px)",
                  width: "clamp(28px, 7.2vw, 36px)",
                  color: "#6B7280",
                  flex: "0 0 auto",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: "clamp(16px, 4.4vw, 20px)",
                    lineHeight: 1,
                  }}
                >
                  ×
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* HMR helper */
export const Blocks = { AnnouncementBarBlock };
export type { AnnBarSettings as AnnouncementBarSettings };
