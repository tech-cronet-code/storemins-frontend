// shared/blocks/storeHero.tsx
import React from "react";
import { Share2 } from "lucide-react";
import cn from "classnames";

/** Server-side settings shape saved for this block */
export type StoreHeroSettings = {
  height_desktop_px?: number;
  height_mobile_px?: number;
  border_radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  background_image_url?: string;
  background_object_position?: string;

  overlay_color?: string; // hex or css color
  overlay_opacity?: number; // 0..100

  // optional "title/subtitle/tagline" content
  title_text?: string;
  subtitle_text?: string;
  tagline_text?: string | string[];

  // optional visibility
  visibility?: "all" | "desktop" | "mobile";
};

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop";
const FALLBACK_LOGO =
  "https://minis-media-assets.swiggy.com/swiggymini/image/upload/h_256,c_fit,fl_lossy,q_auto:eco,f_auto/IMAGE/847486d0-db3e-4d54-bee7-b537747c7ecd/0gZi8UlkP9cWIQrrlQF1u-B63F0C50-8D0C-4529-AC08-1613096E9E43.png";

const radiusClass: Record<
  NonNullable<StoreHeroSettings["border_radius"]>,
  string
> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

function visibilityClass(v?: StoreHeroSettings["visibility"]) {
  switch (v) {
    case "desktop":
      return "hidden md:block";
    case "mobile":
      return "block md:hidden";
    default:
      return "";
  }
}

export const StoreHeroBlock: React.FC<{
  settings?: Partial<StoreHeroSettings>;
}> = ({ settings }) => {
  const s: StoreHeroSettings = {
    height_desktop_px: 400,
    height_mobile_px: 240,
    border_radius: "lg",
    background_image_url: FALLBACK_BG,
    background_object_position: "center",
    overlay_color: "#000000",
    overlay_opacity: 20,
    title_text: "Faasos' Signature Wraps & Rolls",
    subtitle_text: "Extraordinarily Indulgent Wraps",
    tagline_text: [
      "Crafting delicious, homemade treats daily.",
      "Specialising in artisanal breads, cakes, and pastries that bring a touch of sweetness to your life. 🧁",
    ],
    visibility: "all",
    ...(settings || {}),
  };

  const [bg, setBg] = React.useState(s.background_image_url || FALLBACK_BG);
  const [logo, setLogo] = React.useState(FALLBACK_LOGO);
  const [following, setFollowing] = React.useState(false);

  // clamp overlay 0..100 -> 0..1
  const overlayOpacity =
    Math.max(0, Math.min(100, Number(s.overlay_opacity ?? 0))) / 100;

  const desktopH = Math.max(120, Number(s.height_desktop_px ?? 400));
  const mobileH = Math.max(120, Number(s.height_mobile_px ?? 240));

  const BADGE = React.useMemo(
    () => ({
      size: 80,
      overlap: 40,
      shadow: "0 8px 20px rgba(0,0,0,0.15)",
      ring: "0 0 0 4px #fff",
    }),
    []
  );

  const taglines: string[] = Array.isArray(s.tagline_text)
    ? s.tagline_text
    : typeof s.tagline_text === "string"
    ? [s.tagline_text]
    : [];

  return (
    <section className={cn("w-full font-sans", visibilityClass(s.visibility))}>
      <style>{`
        @media (min-width: 768px){ .sh-hero-h { height: ${desktopH}px; } }
      `}</style>

      {/* HERO BACKGROUND */}
      <div
        className={cn(
          "relative sh-hero-h overflow-hidden border border-neutral-200/60 shadow-sm",
          radiusClass[s.border_radius || "lg"]
        )}
        style={{ height: mobileH }}
      >
        <div
          className="absolute inset-0"
          style={{ borderRadius: "inherit" }}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: s.background_object_position || "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: s.overlay_color || "#000",
              opacity: overlayOpacity,
            }}
          />
        </div>
      </div>

      {/* CARD */}
      <div className="relative z-30" style={{ marginTop: -BADGE.overlap }}>
        {/* Logo Badge */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex items-center justify-center z-30"
          style={{
            top: 0,
            width: BADGE.size,
            height: BADGE.size,
            borderRadius: 20,
            boxShadow: `${BADGE.shadow}, ${BADGE.ring}`,
          }}
        >
          <img
            src={logo}
            onError={() => setLogo(FALLBACK_LOGO)}
            alt="brand"
            className="w-3/4 h-3/4 object-contain"
            draggable={false}
            loading="lazy"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-t-3xl shadow-sm">
          <div className="px-6 md:px-10 pt-12 pb-8">
            {/* Title */}
            <h2 className="text-center text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
              {s.title_text}
            </h2>

            {/* Subtitle + Actions */}
            <div className="mt-2 flex items-center justify-center gap-3">
              {!!s.subtitle_text && (
                <p className="text-sm md:text-base text-neutral-500">
                  {s.subtitle_text}
                </p>
              )}

              <div className="flex items-center gap-2 md:gap-2.5">
                <button
                  type="button"
                  onClick={() => setFollowing((f) => !f)}
                  className={cn(
                    "rounded-full font-medium text-white shadow-sm",
                    "transition-colors duration-150",
                    following
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700",
                    "px-3.5 py-1 text-[12px] sm:px-4 sm:py-1.5 sm:text-[13px] md:px-4.5 md:py-1.5 md:text-[14px]"
                  )}
                  aria-pressed={following}
                >
                  {following ? "Following" : "Follow"}
                </button>

                <button
                  type="button"
                  aria-label="Share"
                  className="inline-flex items-center justify-center 
                  text-neutral-400 hover:text-neutral-600 active:text-neutral-800
                  focus:outline-none transition-colors duration-150"
                >
                  <Share2
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4"
                    strokeWidth={1.6}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            {(taglines?.length ?? 0) > 0 && (
              <div className="mt-4 border-t border-neutral-100" />
            )}

            {/* Taglines */}
            {taglines?.length ? (
              <div className="mt-4 space-y-2 text-center">
                {taglines.map((line, i) => (
                  <p
                    key={i}
                    className="text-sm md:text-base text-neutral-600 leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* preloaders */}
      <img
        src={bg}
        onError={() => setBg(FALLBACK_BG)}
        alt=""
        className="hidden"
      />
      <img
        src={logo}
        onError={() => setLogo(FALLBACK_LOGO)}
        alt=""
        className="hidden"
      />
    </section>
  );
};
