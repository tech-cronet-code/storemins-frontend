/**********************************************
 * SocialProofStrip.tsx — Mobile: 3 fully visible, no text clipping
 **********************************************/
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

type Slot = {
  enabled?: boolean;
  platform?: string;
  value?: string;
  label?: string;
  href?: string;
  icon?: string;
  icon_img?: string;
  icon_bg?: string;
  icon_color?: string;
};

type Settings = {
  enabled?: boolean;

  // layout
  align?: "left" | "center" | "right";
  max_items?: number;
  compact?: boolean;

  // section
  section_background_color?: string;
  section_top_margin?: string;
  section_bottom_margin?: string;

  // chip look
  chip_radius?: number;
  chip_background_color?: string;
  chip_border_color?: string;
  chip_shadow?: boolean;
  hover_lift?: boolean;

  // icon
  icon_size?: number;
  icon_pad?: number;
  icon_radius?: number;

  // content
  item1?: Slot;
  item2?: Slot;
  item3?: Slot;
  item4?: Slot;
  item5?: Slot;
  items?: Slot[];

  // misc
  show_edge_fade?: boolean;
  custom_css?: string | null;
};

export default function SocialProofStrip({
  settings,
}: {
  settings?: Settings;
}) {
  const s = settings || {};
  if (s.enabled === false) return null;

  // tokens
  const align = s.align ?? "center";
  const maxItems = s.max_items ?? 5;
  const compact = s.compact ?? true;

  const sectionBg = s.section_background_color ?? "#ffffff";

  const chipRadius = s.chip_radius ?? 18;
  const chipBg = s.chip_background_color ?? "#ffffff";
  const chipBorder = s.chip_border_color ?? "rgba(2,6,23,0.06)";
  const chipShadow = s.chip_shadow ?? true;
  const hoverLift = s.hover_lift ?? true;

  const iconSize = s.icon_size ?? 20;
  const iconPad = s.icon_pad ?? 10;
  const iconRadius = s.icon_radius ?? 12;

  const edgeFade = s.show_edge_fade ?? true;

  // data
  const list: Slot[] = useMemo(() => {
    const slots = [s.item1, s.item2, s.item3, s.item4, s.item5]
      .filter(Boolean)
      .filter((x: any) => x.enabled !== false) as Slot[];
    const arr = (Array.isArray(s.items) ? s.items : []).filter(
      (x) => x && x.enabled !== false
    ) as Slot[];
    const merged = (slots.length ? slots : arr).slice(0, maxItems);

    if (!merged.length) {
      return [
        {
          platform: "Instagram",
          value: "64.1K",
          label: "Followers",
          icon_img:
            "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
          icon_bg:
            "linear-gradient(135deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%)",
        },
        {
          platform: "YouTube",
          value: "64.1K",
          label: "Followers",
          icon_img:
            "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
          icon_bg: "#FF0000",
        },
        {
          platform: "Facebook",
          value: "40K+",
          label: "Followers",
          icon_img:
            "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
          icon_bg: "#1877F2",
        },
      ];
    }
    return merged;
  }, [s.item1, s.item2, s.item3, s.item4, s.item5, s.items, maxItems]);

  if (!list.length) return null;

  const justify =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  // responsive
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isSmall, setIsSmall] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(max-width: 640px)");
    const on = () => setIsSmall(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  // small: pages of 3
  const pagesData = useMemo(() => {
    if (!isSmall) return [];
    const out: Slot[][] = [];
    for (let i = 0; i < list.length; i += 3) out.push(list.slice(i, i + 3));
    return out;
  }, [isSmall, list]);

  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [isSmall, list.length]);

  const goTo = (idx: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isSmall) return;
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setPage(Math.min(pagesData.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isSmall, pagesData.length]);

  const iconBox = iconSize + iconPad * 2;

  return (
    <section
      className="w-full sps-x"
      style={{
        background: sectionBg,
        marginTop: s.section_top_margin || "0rem",
        marginBottom: s.section_bottom_margin || "1.25rem",
        // css vars
        ["--chip-bg" as any]: chipBg,
        ["--chip-br" as any]: chipBorder,
        ["--chip-radius" as any]: `${chipRadius}px`,
        ["--icon-box" as any]: `${iconBox}px`,
        ["--icon-size" as any]: `${iconSize}px`,
        ["--icon-radius" as any]: `${iconRadius}px`,
      }}
    >
      <style>{`
        .sps-x .no-scrollbar::-webkit-scrollbar{ display:none }
        .sps-x .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none }

        .sps-x { --padX: 16px; --gap: 12px; --py: ${
          compact ? 10 : 12
        }px; --px: ${compact ? 16 : 18}px; }

        /* desktop/tablet rail */
        .sps-x .rail-desktop{
          overflow-x:auto;
          gap: var(--gap);
          padding:12px var(--padX);
          display:flex; flex-wrap:nowrap;
          ${
            edgeFade
              ? `mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);
               -webkit-mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);`
              : ""
          }
        }

        /* MOBILE: full viewport width slides (ignores parent padding) */
        .sps-x .rail-mobile{
          display:grid; grid-auto-flow: column;
          grid-auto-columns: 100vw;
          overflow-x:auto; scroll-snap-type:x mandatory;
          padding:12px 0;
        }
        .sps-x .slide{
          scroll-snap-align:start;
          padding-left: max(10px, env(safe-area-inset-left));
          padding-right: max(10px, env(safe-area-inset-right));
          display:grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--gap);
        }
        .sps-x .slide > *{ min-width:0 }

        .sps-x .chip{
          background: var(--chip-bg);
          border: 1px solid var(--chip-br);
          border-radius: var(--chip-radius);
          ${chipShadow ? "box-shadow: 0 8px 28px rgba(2,6,23,0.06);" : ""}
          padding: var(--py) var(--px);
          display:inline-flex; align-items:center;
          width: 100%; box-sizing: border-box;
          min-height: calc(var(--icon-box) + var(--py)*2 - 2px); /* keeps label clear */
          overflow: visible; /* don't crop descenders */
          transition: transform .15s ease;
        }
        .sps-x .chip:hover{ ${hoverLift ? "transform: translateY(-1px);" : ""} }
        .sps-x .chip:focus-visible{
          outline: none;
          box-shadow:
            0 0 0 2px rgba(99,102,241,.15),
            0 0 0 5px rgba(99,102,241,.30);
        }

        .sps-x .iconBox{
          width: var(--icon-box); height: var(--icon-box);
          border-radius: var(--icon-radius);
          display:flex; align-items:center; justify-content:center;
          margin-right: 10px; flex:0 0 auto;
        }
        .sps-x .iconImg, .sps-x .iconI{
          width: var(--icon-size); height: var(--icon-size);
          font-size: var(--icon-size); display:block;
        }

        /* Text wrapper centers vertically and never wraps */
        .sps-x .txt{ display:flex; flex-direction:column; justify-content:center; min-width:0 }
        .sps-x .val{
          font-weight:600;
          font-size: clamp(14px, 4vw, 17px);
          line-height: 1.15;
          letter-spacing:.2px;
          color:#111827;
          white-space:nowrap;
        }
        .sps-x .lbl{
          margin-top:2px;
          font-size: clamp(11px, 3.2vw, 12.5px);
          line-height: 1.28;             /* more breathing so no clipping */
          color:#6B7280;
          font-weight:500;
          white-space:nowrap;
        }

        /* extra shrink tiers so 3 always fit even on tiny screens */
        @media (max-width:390px){
          .sps-x { --padX: 12px; --gap: 10px; --py: 9px; --px: 14px; }
        }
        @media (max-width:360px){
          .sps-x { --padX: 10px; --gap: 8px; --py: 8px; --px: 12px; }
        }
        @media (max-width:340px){
          .sps-x { --padX: 8px; --gap: 8px; --py: 7px; --px: 10px; }
        }

        /* Dots only on mobile when multiple slides */
        .sps-x .dots{ display:none }
        @media (max-width:640px){
          .sps-x .dots{
            display:flex; align-items:center; justify-content:center;
            gap:8px; padding:6px 0 2px;
          }
        }
        .sps-x .dot{ width:6px; height:6px; border-radius:9999px; background:#CBD5E1; transition:.15s ease; }
        .sps-x .dot.active{ background:#6366F1; width:16px; }

        ${s.custom_css || ""}
      `}</style>

      {/* desktop/tablet rail */}
      {!isSmall && (
        <div
          className={clsx("rail-desktop no-scrollbar", justify)}
          role="list"
          aria-label="Social proof"
        >
          {list.map((slot, i) => {
            const iconBG =
              slot.icon_bg ??
              (slot.platform?.toLowerCase().includes("insta")
                ? "linear-gradient(135deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%)"
                : slot.platform?.toLowerCase().includes("tube")
                ? "#FF0000"
                : slot.platform?.toLowerCase().includes("whats")
                ? "#25D366"
                : "#EEF1F6");

            const card = (
              <div
                className="chip group focus:outline-none"
                role={slot.href ? "link" : "listitem"}
                tabIndex={0}
                title={`${slot.platform ?? ""} ${slot.value ?? ""} ${
                  slot.label ?? ""
                }`.trim()}
              >
                <div className="iconBox" style={{ background: iconBG }}>
                  {slot.icon_img ? (
                    <img
                      loading="lazy"
                      src={slot.icon_img}
                      alt={slot.platform || "social"}
                      className="iconImg object-contain"
                    />
                  ) : (
                    <i
                      className={clsx("iconI", slot.icon || "ri-share-line")}
                      style={{ color: slot.icon_color || "#ffffff" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="txt">
                  <div className="val">{slot.value}</div>
                  <div className="lbl">{slot.label}</div>
                </div>
              </div>
            );

            return slot.href ? (
              <a
                key={i}
                href={slot.href}
                target="_blank"
                rel="noreferrer"
                className="focus:outline-none"
                role="listitem"
                aria-label={`${slot.platform ?? "Link"} — opens in new tab`}
              >
                {card}
              </a>
            ) : (
              <div key={i} role="listitem" className="focus:outline-none">
                {card}
              </div>
            );
          })}
        </div>
      )}

      {/* mobile: 3 per slide */}
      {isSmall && (
        <>
          <div
            ref={railRef}
            className="rail-mobile no-scrollbar"
            role="region"
            aria-label="Social proof carousel"
          >
            {pagesData.map((group, gi) => (
              <div key={gi} className="slide">
                {group.map((slot, i) => {
                  const iconBG =
                    slot.icon_bg ??
                    (slot.platform?.toLowerCase().includes("insta")
                      ? "linear-gradient(135deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%)"
                      : slot.platform?.toLowerCase().includes("tube")
                      ? "#FF0000"
                      : slot.platform?.toLowerCase().includes("whats")
                      ? "#25D366"
                      : "#EEF1F6");

                  const card = (
                    <div
                      className="chip group focus:outline-none"
                      role={slot.href ? "link" : "listitem"}
                      tabIndex={0}
                      title={`${slot.platform ?? ""} ${slot.value ?? ""} ${
                        slot.label ?? ""
                      }`.trim()}
                    >
                      <div className="iconBox" style={{ background: iconBG }}>
                        {slot.icon_img ? (
                          <img
                            loading="lazy"
                            src={slot.icon_img}
                            alt={slot.platform || "social"}
                            className="iconImg object-contain"
                          />
                        ) : (
                          <i
                            className={clsx(
                              "iconI",
                              slot.icon || "ri-share-line"
                            )}
                            style={{ color: slot.icon_color || "#ffffff" }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="txt">
                        <div className="val">{slot.value}</div>
                        <div className="lbl">{slot.label}</div>
                      </div>
                    </div>
                  );

                  return slot.href ? (
                    <a
                      key={i}
                      href={slot.href}
                      target="_blank"
                      rel="noreferrer"
                      className="focus:outline-none"
                      role="listitem"
                      aria-label={`${
                        slot.platform ?? "Link"
                      } — opens in new tab`}
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={i} role="listitem" className="focus:outline-none">
                      {card}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {pagesData.length > 1 && (
            <div className="dots" role="tablist" aria-label="Slide pagination">
              {pagesData.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-selected={page === i}
                  className={clsx("dot", page === i && "active")}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
